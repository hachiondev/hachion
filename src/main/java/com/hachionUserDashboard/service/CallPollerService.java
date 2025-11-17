package com.hachionUserDashboard.service;

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
       
        ZoneId vendorZone;
        try {
            vendorZone = ZoneId.of(Optional.ofNullable(vitelProps.getRecordsZone()).orElse("UTC"));
        } catch (Exception ex) {
            vendorZone = ZoneOffset.UTC; // safe fallback
        }
        LocalDate day = LocalDate.now(vendorZone);

        

        for (String ext : extensions()) {

            // Skip if current UTC time is outside configured windows for this extension
            if (!timeWindow.isAllowedNowUtc(ext)) {
                
                continue;
            }

            Instant newestSeenThisTick = null;
            final List<String> newLines = new ArrayList<>(); // batch messages to avoid 429s

            try {
                
                // Fetch vendor-day records for this extension
                VitelRecords vr = vitel.fetchFor(ext, day);

                List<VitelRecord> list = new ArrayList<>(
                        Optional.ofNullable(vr.getRecord()).orElseGet(Collections::emptyList));

                // Sort by start time (ascending, in UTC)
                list.sort(Comparator.comparing(r -> fmt.parseStartToUtc(r.getStart())));
                

                Instant lastSeen = lastSeenByExt.get(ext);
                

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
                    
                    newLines.add(line);
                }

                // Batch post (one message per ext per tick) – helps avoid Google Chat 429
                if (!newLines.isEmpty()) {
                    String payload = newLines.stream().collect(Collectors.joining("\n"));
                    try {
                        chat.postPlainText(payload);
                    } catch (Exception postErr) {
                        
                        // (Optional) you can add retry/backoff here on 429 if needed
                    }
                }

            } catch (Exception e) {
                
            } finally {
                if (newestSeenThisTick != null) {
                    lastSeenByExt.put(ext, newestSeenThisTick);
                    
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
