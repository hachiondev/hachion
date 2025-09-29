package com.hachionUserDashboard.service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.config.VitelProps;
import com.hachionUserDashboard.dto.VitelRecord;
import com.hachionUserDashboard.dto.VitelRecords;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CallPollerService {

	@Autowired
	private VitelClient vitel;

	@Autowired
	private ChatClient chat;
	@Autowired
	private CallFormatter fmt;
	@Autowired
	private VitelProps vitelProps;

	
	private final Map<String, Instant> lastSeenByExt = new ConcurrentHashMap<>();
	
	private final Set<String> seenHashes = ConcurrentHashMap.newKeySet();

	 private List<String> extensions() {
	        return Arrays.stream(Optional.ofNullable(vitelProps.getExtensionsCsv()).orElse("")
	                .split(","))
	            .map(String::trim)
	            .filter(s -> !s.isBlank())
	            .toList();
	    }

	    @Scheduled(fixedDelayString = "${poller.fixedDelayMs}")
	    public void tick() {
	        LocalDate day = LocalDate.now();
	        System.out.println("⚙️ tick() started for date " + day);

	        for (String ext : extensions()) {
	            Instant newestSeenThisTick = null;
	            try {
	                System.out.println("🔎 polling ext " + ext);

	                VitelRecords vr = vitel.fetchFor(ext, day);
	                List<VitelRecord> list = new ArrayList<>(Optional.ofNullable(vr.getRecord())
	                        .orElseGet(Collections::emptyList));
	                list.sort(Comparator.comparing(r -> fmt.parseStartToUtc(r.getStart())));
	                System.out.println("📥 ext " + ext + ": parsed records = " + list.size());

	                Instant lastSeen = lastSeenByExt.get(ext);
	                System.out.println("⏱️ lastSeen[" + ext + "]=" + lastSeen);

	                for (VitelRecord r : list) {
	                    Instant startUtc = fmt.parseStartToUtc(r.getStart());

	                    if (lastSeen != null && !startUtc.isAfter(lastSeen)) {
	                        continue; 
	                    }

	                    int dur = safeInt(r.getDuration());
	                    String disp = r.getDisposition();
	                    if (dur <= 0 && (disp == null || disp.isBlank())) {
	                        continue; 
	                    }

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

	                    
	                    try {
	                        chat.postPlainText(line);
	                    } catch (Exception postErr) {
	                        System.out.println("⚠️ chat post failed for ext " + ext + ": " + postErr.getMessage());
	                        
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
	        try { return Integer.parseInt(s == null ? "0" : s.trim()); }
	        catch (Exception e) { return 0; }
	    }
	}