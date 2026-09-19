package com.hachionUserDashboard.dto;

public class YouTubeVideo {
	private String videoId;
	private String title;
	private String thumbnail;
	private String publishedAt;
	private long viewCount;

	public YouTubeVideo() {
	}

	public YouTubeVideo(String videoId, String title, String thumbnail, String publishedAt, long viewCount) {
		this.videoId = videoId;
		this.title = title;
		this.thumbnail = thumbnail;
		this.publishedAt = publishedAt;
		this.viewCount = viewCount;
	}

	// Getters and setters
	public String getVideoId() {
		return videoId;
	}

	public void setVideoId(String videoId) {
		this.videoId = videoId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}

	public String getPublishedAt() {
		return publishedAt;
	}

	public void setPublishedAt(String publishedAt) {
		this.publishedAt = publishedAt;
	}

	public long getViewCount() {
		return viewCount;
	}

	public void setViewCount(long viewCount) {
		this.viewCount = viewCount;
	}
}
