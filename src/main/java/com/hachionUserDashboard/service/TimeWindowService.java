package com.hachionUserDashboard.service;

import com.hachionUserDashboard.config.SchedulesProps;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

//@Service
//@RequiredArgsConstructor
//public class TimeWindowService {
//
//	@Autowired
//	private SchedulesProps schedules;
//
//	private static class Window {
//		final int startMin; // minutes from 00:00 UTC
//		final int endMin; // minutes from 00:00 UTC
//
//		Window(int s, int e) {
//			this.startMin = s;
//			this.endMin = e;
//		}
//
//		boolean contains(int nowMin) {
//			// supports wrap-around, e.g. 23:30-05:00
//			return (startMin <= endMin) ? (nowMin >= startMin && nowMin < endMin)
//					: (nowMin >= startMin || nowMin < endMin);
//		}
//	}
//
//	private static List<String> splitCsv(String csv) {
//		if (csv == null || csv.isBlank())
//			return List.of();
//		return Arrays.stream(csv.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
//	}
//
//	private static int parseHmToMinutes(String hm) {
//		String[] p = hm.split(":");
//		int h = Integer.parseInt(p[0]), m = Integer.parseInt(p[1]);
//		return h * 60 + m;
//	}
//
//	private static List<Window> parseWindows(String windowsUtc) {
//		if (windowsUtc == null || windowsUtc.isBlank())
//			return List.of();
//		List<Window> out = new ArrayList<>();
//		for (String seg : windowsUtc.split(",")) {
//			String s = seg.trim();
//			if (s.isEmpty())
//				continue;
//			String[] parts = s.split("-");
//			int a = parseHmToMinutes(parts[0].trim());
//			int b = parseHmToMinutes(parts[1].trim());
//			out.add(new Window(a, b));
//		}
//		return out;
//	}
//
//	private Map<String, List<Window>> buildExtToWindows() {
//		Map<String, List<Window>> map = new HashMap<>();
//
//		var gAExts = splitCsv(schedules.getGroupA().getMembers());
//		var gAWin = parseWindows(schedules.getGroupA().getWindowsUtc());
//		for (String e : gAExts)
//			map.put(e, gAWin);
//
//		var gBExts = splitCsv(schedules.getGroupB().getMembers());
//		var gBWin = parseWindows(schedules.getGroupB().getWindowsUtc());
//		for (String e : gBExts)
//			map.put(e, gBWin);
//
//		return map;
//	}
//
//	public boolean isAllowedNowUtc(String extension) {
//		// current time in UTC minutes
//		LocalTime nowUtc = LocalTime.now(ZoneOffset.UTC);
//		int nowMin = nowUtc.getHour() * 60 + nowUtc.getMinute();
//
//		List<Window> windows = buildExtToWindows().getOrDefault(extension, List.of());
//		if (windows.isEmpty())
//			return true; // if no rule → allow by default (or return false to block)
//		for (Window w : windows) {
//			if (w.contains(nowMin))
//				return true;
//		}
//		return false;
//	}
//}
@Service
@RequiredArgsConstructor
public class TimeWindowService {

	@Autowired
	private SchedulesProps schedules;

	private static class Window {
		final int startMin;
		final int endMin;

		Window(int s, int e) {
			this.startMin = s;
			this.endMin = e;
		}

		boolean contains(int nowMin) {

			return (startMin <= endMin) ? (nowMin >= startMin && nowMin < endMin)
					: (nowMin >= startMin || nowMin < endMin);
		}

		@Override
		public String toString() {
			return "%02d:%02d-%02d:%02d".formatted(startMin / 60, startMin % 60, endMin / 60, endMin % 60);
		}
	}

	private static List<String> splitCsv(String csv) {
		if (csv == null || csv.isBlank())
			return List.of();
		return Arrays.stream(csv.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
	}

	private static String stripComment(String s) {
		if (s == null)
			return "";
		int i = s.indexOf('#');
		if (i >= 0)
			s = s.substring(0, i);
		i = s.indexOf(';');
		if (i >= 0)
			s = s.substring(0, i);
		return s.trim();
	}

	private static boolean isHm(String s) {
		if (s == null)
			return false;
		s = s.trim();
		if (!s.matches("\\d{1,2}:\\d{2}"))
			return false;
		String[] p = s.split(":");
		int h = Integer.parseInt(p[0]), m = Integer.parseInt(p[1]);
		return (h >= 0 && h < 24 && m >= 0 && m < 60);
	}

	private static int parseHmToMinutes(String hm) {
		String[] p = hm.split(":");
		int h = Integer.parseInt(p[0]), m = Integer.parseInt(p[1]);
		return h * 60 + m;
	}

	private static List<Window> parseWindows(String windowsUtc) {
		if (windowsUtc == null || windowsUtc.isBlank())
			return List.of();

		String cleaned = stripComment(windowsUtc);
		List<Window> out = new ArrayList<>();

		for (String seg : cleaned.split(",")) {
			String s = stripComment(seg.trim());
			if (s.isEmpty())
				continue;

			String[] parts = s.split("-");
			if (parts.length != 2)
				continue;

			String aStr = parts[0].trim();
			String bStr = parts[1].trim();

			if (!isHm(aStr) || !isHm(bStr))
				continue;

			int a = parseHmToMinutes(aStr);
			int b = parseHmToMinutes(bStr);
			out.add(new Window(a, b));
		}
		return out;
	}

	private Map<String, List<Window>> buildExtToWindows() {
		Map<String, List<Window>> map = new HashMap<>();

		var gAExts = splitCsv(schedules.getGroupA().getMembers());
		var gAWin = parseWindows(schedules.getGroupA().getWindowsUtc());
		for (String e : gAExts) {
			map.put(e, gAWin);
		}

		var gBExts = splitCsv(schedules.getGroupB().getMembers());
		var gBWin = parseWindows(schedules.getGroupB().getWindowsUtc());
		for (String e : gBExts) {
			if (map.containsKey(e)) {
				System.out.println("⚠️ extension " + e + " appears in multiple groups; using groupB windows");
			}
			map.put(e, gBWin);
		}

		return map;
	}

	public boolean isAllowedNowUtc(String extension) {

		LocalTime nowUtc = LocalTime.now(ZoneOffset.UTC);
		int nowMin = nowUtc.getHour() * 60 + nowUtc.getMinute();

		List<Window> windows = buildExtToWindows().getOrDefault(extension, List.of());

		if (windows.isEmpty()) {
			System.out.println(
					"⏰ isAllowedNowUtc ext=" + extension + " at UTC " + nowUtc + " windows=[] -> false (no windows)");
			return false;
		}

		boolean allowed = windows.stream().anyMatch(w -> w.contains(nowMin));

		String winStr = windows.stream().map(Window::toString).collect(java.util.stream.Collectors.joining(","));
		System.out.println("⏰ isAllowedNowUtc ext=" + extension + " at UTC " + nowUtc + " (" + nowMin + "m) windows=["
				+ winStr + "] -> " + allowed);

		return allowed;
	}
}
