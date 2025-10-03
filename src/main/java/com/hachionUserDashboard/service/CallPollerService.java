package com.hachionUserDashboard.service;

//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class CallPollerService {
//
//	@Autowired
//	private VitelClient vitel;
//
//	@Autowired
//	private ChatClient chat;
//	@Autowired
//	private CallFormatter fmt;
//	@Autowired
//	private VitelProps vitelProps;
//
//	@Autowired
//	private TimeWindowService timeWindow;
//
//	private final Map<String, Instant> lastSeenByExt = new ConcurrentHashMap<>();
//
//	private final Set<String> seenHashes = ConcurrentHashMap.newKeySet();
//
//	private List<String> extensions() {
//		return Arrays.stream(Optional.ofNullable(vitelProps.getExtensionsCsv()).orElse("").split(",")).map(String::trim)
//				.filter(s -> !s.isBlank()).toList();
//	}
//
//	@Scheduled(fixedDelayString = "${poller.fixedDelayMs}")
//	public void tick() {
//		LocalDate day = LocalDate.now();
//		System.out.println("⚙️ tick() started for date " + day);
//
//		for (String ext : extensions()) {
//
//			if (!timeWindow.isAllowedNowUtc(ext)) {
//				System.out.println("⏸️ skipping ext " + ext + " (outside allowed UTC window)");
//				continue;
//			}
//
//			Instant newestSeenThisTick = null;
//			try {
//				System.out.println("🔎 polling ext " + ext);
//
//				VitelRecords vr = vitel.fetchFor(ext, day);
//				List<VitelRecord> list = new ArrayList<>(
//						Optional.ofNullable(vr.getRecord()).orElseGet(Collections::emptyList));
//				list.sort(Comparator.comparing(r -> fmt.parseStartToUtc(r.getStart())));
//				System.out.println("📥 ext " + ext + ": parsed records = " + list.size());
//
//				Instant lastSeen = lastSeenByExt.get(ext);
//				System.out.println("⏱️ lastSeen[" + ext + "]=" + lastSeen);
//
//				for (VitelRecord r : list) {
//					Instant startUtc = fmt.parseStartToUtc(r.getStart());
//
//					if (lastSeen != null && !startUtc.isAfter(lastSeen)) {
//						continue;
//					}
//
//					int dur = safeInt(r.getDuration());
//					String disp = r.getDisposition();
//					if (dur <= 0 && (disp == null || disp.isBlank())) {
//						continue;
//					}
//
//					String hash = fmt.hash(ext, r.getFrom(), r.getTo(), startUtc, dur, disp);
//					if (!seenHashes.add(hash)) {
//						continue;
//					}
//
//					if (newestSeenThisTick == null || startUtc.isAfter(newestSeenThisTick)) {
//						newestSeenThisTick = startUtc;
//					}
//
//					String agent = "Ext " + ext;
//					String line = fmt.formatLine(agent, ext, r, startUtc, dur);
//					System.out.println("🆕 " + line);
//
//					try {
//						chat.postPlainText(line);
//					} catch (Exception postErr) {
//						System.out.println("⚠️ chat post failed for ext " + ext + ": " + postErr.getMessage());
//
//					}
//				}
//
//			} catch (Exception e) {
//				System.out.println("❌ polling failed for ext " + ext + ": " + e.getMessage());
//			} finally {
//				if (newestSeenThisTick != null) {
//					lastSeenByExt.put(ext, newestSeenThisTick);
//					System.out.println("✅ updated lastSeen[" + ext + "] -> " + newestSeenThisTick);
//				}
//			}
//		}
//	}
//
//	private int safeInt(String s) {
//		try {
//			return Integer.parseInt(s == null ? "0" : s.trim());
//		} catch (Exception e) {
//			return 0;
//		}
//	}
//}
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.config.VitelProps;
import com.hachionUserDashboard.dto.VitelRecord;
import com.hachionUserDashboard.dto.VitelRecords;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CallPollerService {

    @Autowired private VitelClient vitel;
    @Autowired private ChatClient chat;
    @Autowired private CallFormatter fmt;
    @Autowired private VitelProps vitelProps;
    @Autowired private TimeWindowService timeWindow;

    // per-extension watermark of newest seen call start time (UTC)
    private final Map<String, Instant> lastSeenByExt = new ConcurrentHashMap<>();
    // global de-dup across app lifetime (ext/from/to/startUtc/dur/disp hash)
    private final Set<String> seenHashes = ConcurrentHashMap.newKeySet();

    private List<String> extensions() {
        return Arrays.stream(
                    Optional.ofNullable(vitelProps.getExtensionsCsv()).orElse("")
                        .split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();
    }

    @Scheduled(fixedDelayString = "${poller.fixedDelayMs}")
    public void tick() {
        // Use the vendor’s calendar day (e.g., America/New_York), not system default zone
        ZoneId vendorZone;
        try {
            vendorZone = ZoneId.of(Optional.ofNullable(vitelProps.getRecordsZone()).orElse("UTC"));
        } catch (Exception ex) {
            vendorZone = ZoneOffset.UTC; // safe fallback
        }
        LocalDate day = LocalDate.now(vendorZone);

        System.out.println("⚙️ tick() started for date " + day + " (vendorZone=" + vendorZone + ")");

        for (String ext : extensions()) {

            // Skip if current UTC time is outside configured windows for this extension
            if (!timeWindow.isAllowedNowUtc(ext)) {
                System.out.println("⏸️ skipping ext " + ext + " (outside allowed UTC window)");
                continue;
            }

            Instant newestSeenThisTick = null;
            final List<String> newLines = new ArrayList<>(); // batch messages to avoid 429s

            try {
                System.out.println("🔎 polling ext " + ext);
                System.out.println("baseUrl=" + vitelProps.getBaseUrl() + ", user=" + vitelProps.getUsername());

                // Fetch vendor-day records for this extension
                VitelRecords vr = vitel.fetchFor(ext, day);

                List<VitelRecord> list = new ArrayList<>(
                        Optional.ofNullable(vr.getRecord()).orElseGet(Collections::emptyList));

                // Sort by start time (ascending, in UTC)
                list.sort(Comparator.comparing(r -> fmt.parseStartToUtc(r.getStart())));
                System.out.println("📥 ext " + ext + ": parsed records = " + list.size());

                Instant lastSeen = lastSeenByExt.get(ext);
                System.out.println("⏱️ lastSeen[" + ext + "]=" + lastSeen);

                for (VitelRecord r : list) {
                    Instant startUtc = fmt.parseStartToUtc(r.getStart());

                    // Watermark filter
                    if (lastSeen != null && !startUtc.isAfter(lastSeen)) {
                        continue;
                    }

                    int dur = safeInt(r.getDuration());
                    String disp = r.getDisposition();
                    // Ignore empty/no-duration + no disposition rows
                    if (dur <= 0 && (disp == null || disp.isBlank())) {
                        continue;
                    }

                    // Global de-dup
                    String hash = fmt.hash(ext, r.getFrom(), r.getTo(), startUtc, dur, disp);
                    if (!seenHashes.add(hash)) {
                        continue;
                    }

                    if (newestSeenThisTick == null || startUtc.isAfter(newestSeenThisTick)) {
                        newestSeenThisTick = startUtc;
                    }

                    String agent = "Ext " + ext;
                    String line = fmt.formatLine(agent, ext, r, startUtc, dur);
                    System.out.println("🆕 " + line);
                    newLines.add(line);
                }

                // Batch post (one message per ext per tick) – helps avoid Google Chat 429
                if (!newLines.isEmpty()) {
                    String payload = newLines.stream().collect(Collectors.joining("\n"));
                    try {
                        chat.postPlainText(payload);
                    } catch (Exception postErr) {
                        System.out.println("⚠️ chat post failed for ext " + ext + ": " + postErr.getMessage());
                        // (Optional) you can add retry/backoff here on 429 if needed
                    }
                }

            } catch (Exception e) {
                System.out.println("❌ polling failed for ext " + ext + ": " + e.getMessage());
            } finally {
                if (newestSeenThisTick != null) {
                    lastSeenByExt.put(ext, newestSeenThisTick);
                    System.out.println("✅ updated lastSeen[" + ext + "] -> " + newestSeenThisTick);
                }
            }
        }
    }

    private int safeInt(String s) {
        try {
            return Integer.parseInt(s == null ? "0" : s.trim());
        } catch (Exception e) {
            return 0;
        }
    }
}
