package com.hachionUserDashboard.util;

import java.time.LocalTime;

public class PollWindow {
	private final LocalTime start;
	private final LocalTime end;

	public PollWindow(LocalTime start, LocalTime end) {
		this.start = start;
		this.end = end;
	}

	public static PollWindow of(String from, String to) {
		return new PollWindow(LocalTime.parse(from), LocalTime.parse(to));
	}

	public boolean contains(LocalTime t) {

		if (end.isAfter(start))
			return !t.isBefore(start) && t.isBefore(end);

		return !t.isBefore(start) || t.isBefore(end);
	}
}