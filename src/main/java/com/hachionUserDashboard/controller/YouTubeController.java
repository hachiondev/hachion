package com.hachionUserDashboard.controller;

import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.hachionUserDashboard.dto.YouTubeListResponse;
import com.hachionUserDashboard.dto.YouTubeVideo;
import com.hachionUserDashboard.service.YouTubeService;

import java.util.List;

@RestController
@RequestMapping("/api/youtube")
@Validated
public class YouTubeController {

	@Autowired
	private YouTubeService service;

	@Value("${youtube.channel.handle:@hachion}")
	private String defaultHandle;

	@GetMapping(value = "/channel-id", produces = MediaType.APPLICATION_JSON_VALUE)
	public Object channelId(@RequestParam(required = false) String handle) {
		String h = (handle == null || handle.isBlank()) ? defaultHandle : handle;
		String channelId = service.getChannelIdByHandle(h);
		return java.util.Map.of("handle", h, "channelId", channelId);
	}

	@GetMapping(value = "/videos", produces = MediaType.APPLICATION_JSON_VALUE)
	public YouTubeListResponse videos(@RequestParam(required = false) String handle,
			@RequestParam(defaultValue = "3") @Min(1) int pages,
			@RequestParam(defaultValue = "50") @Min(1) int pageSize,
			@RequestParam(defaultValue = "12") @Min(1) int limit) {

		String h = (handle == null || handle.isBlank()) ? defaultHandle : handle;
		String channelId = service.getChannelIdByHandle(h);
		List<YouTubeVideo> all = service.getChannelVideosSortedByViews(channelId, pages, pageSize);
		List<YouTubeVideo> top = all.stream().limit(limit).toList();

		YouTubeListResponse response = new YouTubeListResponse();
		response.setHandle(h);
		response.setChannelId(channelId);
		response.setVideos(top);
		response.setTotal(top.size());
		response.setNote("Sorted by viewCount desc; fetched " + Math.min(pages, 10) + " page(s) of uploads");
		return response;
	}
}
