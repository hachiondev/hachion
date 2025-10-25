package com.hachionUserDashboard.service;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Component;

import com.hachionUserDashboard.dto.VitelRecord;

import java.time.*;
import java.time.format.DateTimeFormatter;

@Component
public class CallFormatter {
	public String hash(String ext, String from, String to, Instant start, int dur, String disp) {
		String key = String.join("|", nn(ext), nn(from), nn(to), start.toString(), String.valueOf(dur), nn(disp));
		return DigestUtils.sha256Hex(key);
	}

	public Instant parseStartToUtc(String start) {
		if (start == null || start.isBlank()) {

			return Instant.now();
		}
		String s = start.trim().replace('T', ' ');
		DateTimeFormatter[] fmts = new DateTimeFormatter[] { DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
				DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"), DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"),
				DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm:ss") };
		for (var f : fmts) {
			try {
				return LocalDateTime.parse(s, f).toInstant(ZoneOffset.UTC);
			} catch (Exception ignore) {
			}
		}

		return LocalDateTime.parse(s.replace(' ', 'T')).toInstant(ZoneOffset.UTC);
	}

	public String prettyDuration(int sec) {
		int m = Math.max(sec, 0) / 60, s = Math.max(sec, 0) % 60;
		return String.format("%02d:%02d", m, s);
	}

	public String formatLine(String agentName, String ext, VitelRecord r, Instant startUtc, int dur) {
		String disp = cap(r.getDisposition());
		String ts = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").withZone(ZoneOffset.UTC).format(startUtc);
		String who = (r.getDirection() != null && r.getDirection().equalsIgnoreCase("outbound"))
				? r.getFrom() + " → " + r.getTo()
				: r.getTo() + " ← " + r.getFrom();
		return "%s (%s) • %s • %s • %s • %s".formatted(agentName, ext, who, prettyDuration(dur), disp, ts);
	}

	private String cap(String s) {
		if (s == null || s.isBlank())
			return "";
		return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
	}

	private String nn(String s) {
		return s == null ? "" : s;
	}
}