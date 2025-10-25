package com.hachionUserDashboard.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "schedules")

public class SchedulesProps {

	private Group groupA = new Group();
	private Group groupB = new Group();

	public static class Group {
		private String members; // CSV: "101,102,104"
		private String windowsUtc;

		// "HH:mm-HH:mm,HH:mm-HH:mm"
		public String getMembers() {
			return members;
		}

		public void setMembers(String members) {
			this.members = members;
		}

		public String getWindowsUtc() {
			return windowsUtc;
		}

		public void setWindowsUtc(String windowsUtc) {
			this.windowsUtc = windowsUtc;
		}
	}

	public Group getGroupA() {
		return groupA;
	}

	public void setGroupA(Group groupA) {
		this.groupA = groupA;
	}

	public Group getGroupB() {
		return groupB;
	}

	public void setGroupB(Group groupB) {
		this.groupB = groupB;
	}

}