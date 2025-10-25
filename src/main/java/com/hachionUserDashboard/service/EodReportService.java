package com.hachionUserDashboard.service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.config.VitelProps;
import com.hachionUserDashboard.dto.VitelRecord;
import com.hachionUserDashboard.dto.VitelRecords;

@Service
public class EodReportService {

	@Autowired
	private VitelClient vitel;
	@Autowired
	private VitelProps vitelProps;
	@Autowired
	private ChatClient chat;
	@Autowired
	private CallFormatter fmt;

	@Value("${eod.maxChars:3500}")
	private int maxChars;

	@Value("${eod.zone:}")
	private String explicitZone;

	@Value("${eod.sortNumeric:false}")
	private boolean sortNumeric;

//    public void runEodForYesterday() {
//        
//        ZoneId reportZone = resolveZone(); 
//
//        
//        LocalDate reportDate = LocalDate.now(reportZone).minusDays(1);
//
//        
//        ZonedDateTime startLocal = reportDate.atStartOfDay(reportZone);
//        ZonedDateTime endLocalExclusive = reportDate.plusDays(1).atStartOfDay(reportZone);
//        ZonedDateTime endLocal = endLocalExclusive.minusNanos(1);
//
//        System.out.println("\n=== EOD RUN (" + reportZone + " day) ===");
//        System.out.println("Target date (" + reportZone + "): " + reportDate);
//        System.out.println("Window " + reportZone + ": " + startLocal + " .. " + endLocal);
//        System.out.println("Window UTC: " + startLocal.toInstant() + " .. " + endLocal.toInstant());
//
//        
//        List<String> csvOrder = Arrays.stream(
//                Optional.ofNullable(vitelProps.getExtensionsCsv()).orElse("")
//                        .split(","))
//            .map(String::trim)
//            .filter(s -> !s.isBlank())
//            .collect(Collectors.toList());
//        System.out.println("Extensions from properties (CSV order): " + csvOrder);
//
//        List<String> ordered = extensionsOrdered();
//        System.out.println("Extensions FINAL order used:           " + ordered);
//
//        for (String ext : ordered) {
//            
//            VitelRecords vr = vitel.fetchFor(ext, reportDate);
//            List<VitelRecord> recs = new ArrayList<>(
//                    Optional.ofNullable(vr.getRecord()).orElseGet(Collections::emptyList));
//
//            
//            recs.sort(Comparator.comparing(r -> fmt.parseStartToUtc(r.getStart())));
//
//            System.out.println(("\n[Ext %s] raw records: %d").formatted(ext, recs.size()));
//            if (!recs.isEmpty()) {
//                Instant first = fmt.parseStartToUtc(recs.get(0).getStart());
//                Instant last  = fmt.parseStartToUtc(recs.get(recs.size() - 1).getStart());
//                System.out.println(("[Ext %s] firstUTC=%s, lastUTC=%s").formatted(ext, first, last));
//            }
//
//            List<String> lines = new ArrayList<>();
//            int total = 0, ans = 0, miss = 0, inbound = 0, outbound = 0, talk = 0;
//
//            for (VitelRecord r : recs) {
//                int dur = safeInt(r.getDuration());
//                String disp = r.getDisposition();
//
//                
//                if (dur <= 0 && (disp == null || disp.isBlank())) continue;
//
//                Instant startUtc = fmt.parseStartToUtc(r.getStart());
//                lines.add(fmt.formatLine("Ext " + ext, ext, r, startUtc, dur));
//
//                total++;
//                if (equalsIgnoreCase(disp, "no answer") || dur == 0) miss++; else ans++;
//                if (equalsIgnoreCase(r.getDirection(), "inbound"))  inbound++;
//                if (equalsIgnoreCase(r.getDirection(), "outbound")) outbound++;
//                talk += Math.max(dur, 0);
//            }
//
//            System.out.println(("[Ext %s] totals: total=%d, ans=%d, miss=%d, in=%d, out=%d, talk=%s")
//                    .formatted(ext, total, ans, miss, inbound, outbound, fmt.prettyDuration(talk)));
//
//            String header = """
//                    *📒 Vitel — EOD (%s %s) — Ext %s*
//                    _Total:_ %d | _Ans:_ %d | _Miss:_ %d | _In:_ %d | _Out:_ %d | _Talk:_ %s
//                    """.formatted(reportDate, reportZone.getId(), ext, total, ans, miss, inbound, outbound, fmt.prettyDuration(talk));
//
//            System.out.println(header);
//
//            if (lines.isEmpty()) {
//                System.out.println(("[Ext %s] No calls for this extension.").formatted(ext));
//                chat.postPlainText(header + "\n_No calls for this extension._");
//                continue;
//            }
//
//            System.out.println(("[Ext %s] total lines to post: %d").formatted(ext, lines.size()));
//            int preview = Math.min(3, lines.size());
//            System.out.println(("[Ext %s] sample lines (first %d):").formatted(ext, preview));
//            for (int i = 0; i < preview; i++) {
//                System.out.println("  " + lines.get(i));
//            }
//
//            
//            StringBuilder buf = new StringBuilder(header).append("\n");
//            for (String line : lines) {
//                if (buf.length() + line.length() + 1 > maxChars) {
//                    System.out.println(("[Ext %s] sending chunk (%d chars)").formatted(ext, buf.length()));
//                    chat.postPlainText(buf.toString());
//                    buf = new StringBuilder("*(Ext %s — continued)*\n".formatted(ext));
//                }
//                buf.append(line).append("\n");
//            }
//            if (buf.length() > 0) {
//                chat.postPlainText(buf.toString());
//                System.out.println(("[Ext %s] final chunk sent (%d chars).").formatted(ext, buf.length()));
//            }
//        }
//    }

	public void runEodForYesterday() {

		ZoneId reportZone = resolveZone();
		LocalDate reportDate = LocalDate.now(reportZone).minusDays(1);

		ZonedDateTime startLocal = reportDate.atStartOfDay(reportZone);
		ZonedDateTime endLocalExclusive = reportDate.plusDays(1).atStartOfDay(reportZone);
		ZonedDateTime endLocal = endLocalExclusive.minusNanos(1);

		System.out.println("\n=== EOD RUN (" + reportZone + " day) ===");
		System.out.println("Target date (" + reportZone + "): " + reportDate);
		System.out.println("Window " + reportZone + ": " + startLocal + " .. " + endLocal);
		System.out.println("Window UTC: " + startLocal.toInstant() + " .. " + endLocal.toInstant());

		List<String> csvOrder = Arrays.stream(Optional.ofNullable(vitelProps.getExtensionsCsv()).orElse("").split(","))
				.map(String::trim).filter(s -> !s.isBlank()).collect(Collectors.toList());
		System.out.println("Extensions from properties (CSV order): " + csvOrder);

		List<String> ordered = extensionsOrdered();
		System.out.println("Extensions FINAL order used:           " + ordered);

		for (String ext : ordered) {

			VitelRecords vr = vitel.fetchFor(ext, reportDate);
			List<VitelRecord> recs = new ArrayList<>(
					Optional.ofNullable(vr.getRecord()).orElseGet(Collections::emptyList));

			recs.sort(Comparator.comparing(r -> fmt.parseStartToUtc(r.getStart())));

			System.out.println(("\n[Ext %s] raw records: %d").formatted(ext, recs.size()));
			if (!recs.isEmpty()) {
				Instant first = fmt.parseStartToUtc(recs.get(0).getStart());
				Instant last = fmt.parseStartToUtc(recs.get(recs.size() - 1).getStart());
				System.out.println(("[Ext %s] firstUTC=%s, lastUTC=%s").formatted(ext, first, last));
			}

			// --- compute totals only ---
			int total = 0, ans = 0, miss = 0, inbound = 0, outbound = 0, talk = 0;

			for (VitelRecord r : recs) {
				int dur = safeInt(r.getDuration());
				String disp = r.getDisposition();

				// skip clearly empty records
				if (dur <= 0 && (disp == null || disp.isBlank()))
					continue;

				total++;
				if (equalsIgnoreCase(disp, "no answer") || dur == 0)
					miss++;
				else
					ans++;
				if (equalsIgnoreCase(r.getDirection(), "inbound"))
					inbound++;
				if (equalsIgnoreCase(r.getDirection(), "outbound"))
					outbound++;
				talk += Math.max(dur, 0);
			}

			System.out.println(("[Ext %s] totals: total=%d, ans=%d, miss=%d, in=%d, out=%d, talk=%s").formatted(ext,
					total, ans, miss, inbound, outbound, fmt.prettyDuration(talk)));

			String header = ("*📒 Vitel — EOD (%s %s) — Ext %s*\n"
					+ "_Total:_ %d | _Ans:_ %d | _Miss:_ %d | _In:_ %d | _Out:_ %d | _Talk:_ %s").formatted(reportDate,
							reportZone.getId(), ext, total, ans, miss, inbound, outbound, fmt.prettyDuration(talk));

			// ✅ post ONLY the 2 lines (title + totals)
			chat.postPlainText(header);

			// ---------------------------------------------------------------------
			// ❌ COMMENTED: detailed per-call lines, previews, chunking, etc.
			// List<String> lines = new ArrayList<>();
			// for (VitelRecord r : recs) { ... lines.add(fmt.formatLine(...)); }
			// if (lines.isEmpty()) { chat.postPlainText(header + "\n_No calls for this
			// extension._"); continue; }
			// StringBuilder buf = new StringBuilder(header).append("\n");
			// for (String line : lines) { ... chat.postPlainText(buf.toString()); }
			// ---------------------------------------------------------------------
		}
	}

	private ZoneId resolveZone() {
		String z = (explicitZone != null && !explicitZone.isBlank()) ? explicitZone
				: Optional.ofNullable(vitelProps.getRecordsZone()).orElse("America/New_York");
		try {
			return ZoneId.of(z);
		} catch (Exception e) {
			return ZoneId.of("America/New_York");
		}
	}

	private List<String> extensionsOrdered() {
		List<String> list = Arrays.stream(Optional.ofNullable(vitelProps.getExtensionsCsv()).orElse("").split(","))
				.map(String::trim).filter(s -> !s.isBlank()).collect(Collectors.toList());

		if (!sortNumeric)
			return list;

		return list.stream().sorted(Comparator.comparingInt(s -> {
			try {
				return Integer.parseInt(s);
			} catch (Exception e) {
				return Integer.MAX_VALUE;
			}
		})).collect(Collectors.toList());
	}

	private static boolean equalsIgnoreCase(String a, String b) {
		return a != null && b != null && a.equalsIgnoreCase(b);
	}

	private static int safeInt(String s) {
		try {
			return Integer.parseInt(s == null ? "0" : s.trim());
		} catch (Exception e) {
			return 0;
		}
	}
}
