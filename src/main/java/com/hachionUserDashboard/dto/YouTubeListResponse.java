package com.hachionUserDashboard.dto;

import java.util.List;

public class YouTubeListResponse {
	private String channelId;
	private String handle;
	private List<YouTubeVideo> videos;
	private int total;
	private String note;

	public String getChannelId() {
		return channelId;
	}

	public void setChannelId(String channelId) {
		this.channelId = channelId;
	}

	public String getHandle() {
		return handle;
	}

	public void setHandle(String handle) {
		this.handle = handle;
	}

	public List<YouTubeVideo> getVideos() {
		return videos;
	}

	public void setVideos(List<YouTubeVideo> videos) {
		this.videos = videos;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}
}