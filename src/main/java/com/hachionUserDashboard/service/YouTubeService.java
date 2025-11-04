package com.hachionUserDashboard.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.hachionUserDashboard.dto.YouTubeVideo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class YouTubeService {

	@Autowired
	private RestClient restClient;

	@Autowired
	private String youtubeApiKey;

	private static final String BASE = "https://www.googleapis.com/youtube/v3";

	@Cacheable(cacheNames = "channelIdByHandle", key = "#handle")
	public String getChannelIdByHandle(String handle) {
	    String h = handle == null ? "" : handle.trim();
	    if (h.isEmpty()) throw new RuntimeException("Handle is empty");

	    // 1) Try with @ (encoded)
	    String url1 = BASE + "/channels?part=id&forHandle=" +
	            URLEncoder.encode(h.startsWith("@") ? h : "@" + h, StandardCharsets.UTF_8) +
	            "&key=" + youtubeApiKey;
	    Map<?,?> r1 = restClient.get().uri(url1).retrieve().body(Map.class);
	    Object i1 = r1 == null ? null : r1.get("items");
	    List<?> items1 = (i1 instanceof List) ? (List<?>) i1 : List.of();
	    if (!items1.isEmpty()) {
	        Map<?,?> first = (Map<?, ?>) items1.get(0);
	        String id = Objects.toString(first.get("id"), null);
	        if (id != null && !id.isBlank()) return id;
	    }

	    // 2) Try without @
	    String url2 = BASE + "/channels?part=id&forHandle=" +
	            URLEncoder.encode(h.startsWith("@") ? h.substring(1) : h, StandardCharsets.UTF_8) +
	            "&key=" + youtubeApiKey;
	    Map<?,?> r2 = restClient.get().uri(url2).retrieve().body(Map.class);
	    Object i2 = r2 == null ? null : r2.get("items");
	    List<?> items2 = (i2 instanceof List) ? (List<?>) i2 : List.of();
	    if (!items2.isEmpty()) {
	        Map<?,?> first = (Map<?, ?>) items2.get(0);
	        String id = Objects.toString(first.get("id"), null);
	        if (id != null && !id.isBlank()) return id;
	    }

	    // 3) Fallback: search the channel by name/handle and take the best match
	    String q = h.startsWith("@") ? h.substring(1) : h;
	    String url3 = BASE + "/search?part=snippet&type=channel&maxResults=5&q=" +
	            URLEncoder.encode(q, StandardCharsets.UTF_8) +
	            "&key=" + youtubeApiKey;
	    Map<?,?> r3 = restClient.get().uri(url3).retrieve().body(Map.class);
	    Object i3 = r3 == null ? null : r3.get("items");
	    List<?> items3 = (i3 instanceof List) ? (List<?>) i3 : List.of();
	    for (Object it : items3) {
	        Map<?,?> item = (Map<?,?>) it;
	        Map<?,?> id = (Map<?,?>) item.get("id");
	        Map<?,?> sn = (Map<?,?>) item.get("snippet");
	        String customUrl = sn != null ? Objects.toString(sn.get("customUrl"), "") : "";
	        String title = sn != null ? Objects.toString(sn.get("title"), "") : "";
	        if (customUrl.equalsIgnoreCase("@" + q) || title.equalsIgnoreCase("Hachion")) {
	            return Objects.toString(id.get("channelId"), null);
	        }
	    }
	    if (!items3.isEmpty()) {
	        Map<?,?> item = (Map<?,?>) items3.get(0);
	        Map<?,?> id = (Map<?,?>) item.get("id");
	        return Objects.toString(id.get("channelId"), null);
	    }

	    throw new RuntimeException("Channel not found for handle: " + handle);
	}


	@Cacheable(cacheNames = "videosByChannel", key = "#channelId + '::' + #pages + '::' + #pageSize")
	public List<YouTubeVideo> getChannelVideosSortedByViews(String channelId, int pages, int pageSize) {
		List<String> videoIds = new ArrayList<>();
		String pageToken = null;
		int fetchedPages = 0;

		while (fetchedPages < pages) {
			StringBuilder sb = new StringBuilder(BASE + "/search?part=snippet").append("&channelId=").append(channelId)
					.append("&type=video").append("&order=date").append("&maxResults=")
					.append(Math.min(50, Math.max(1, pageSize))).append("&key=").append(youtubeApiKey);
			if (pageToken != null)
				sb.append("&pageToken=").append(pageToken);

			Map<?, ?> searchResp = restClient.get().uri(sb.toString()).retrieve().body(Map.class);
			Object itemsObj = searchResp.get("items");
			List<?> items = itemsObj instanceof List ? (List<?>) itemsObj : List.of();

			for (Object it : items) {
				Map<?, ?> item = (Map<?, ?>) it;
				Map<?, ?> id = (Map<?, ?>) item.get("id");
				if (id != null && id.get("videoId") != null) {
					videoIds.add(id.get("videoId").toString());
				}
			}
			Object next = searchResp.get("nextPageToken");
			pageToken = next == null ? null : next.toString();
			fetchedPages++;
			if (pageToken == null)
				break;
		}

		if (videoIds.isEmpty())
			return List.of();

		List<YouTubeVideo> videos = new ArrayList<>();
		for (int i = 0; i < videoIds.size(); i += 50) {
			List<String> batch = videoIds.subList(i, Math.min(i + 50, videoIds.size()));
			String url = BASE + "/videos?part=snippet,statistics&id=" + String.join(",", batch) + "&key="
					+ youtubeApiKey;

			Map<?, ?> vidsResp = restClient.get().uri(url).retrieve().body(Map.class);
			Object itemsObj = vidsResp.get("items");
			List<?> items = itemsObj instanceof List ? (List<?>) itemsObj : List.of();

			for (Object it : items) {
				Map<?, ?> item = (Map<?, ?>) it;
				String vid = Objects.toString(item.get("id"), null);
				Map<?, ?> sn = (Map<?, ?>) item.get("snippet");
				Map<?, ?> thumbs = sn == null ? null : (Map<?, ?>) sn.get("thumbnails");
				Map<?, ?> high = thumbs == null ? null : (Map<?, ?>) thumbs.get("high");
				Map<?, ?> medium = thumbs == null ? null : (Map<?, ?>) thumbs.get("medium");
				String thumbUrl = high != null ? Objects.toString(high.get("url"), null)
						: (medium != null ? Objects.toString(medium.get("url"), null) : null);
				Map<?, ?> stats = (Map<?, ?>) item.get("statistics");
				long views = 0L;
				if (stats != null && stats.get("viewCount") != null) {
					try {
						views = Long.parseLong(stats.get("viewCount").toString());
					} catch (NumberFormatException ignored) {
					}
				}
				YouTubeVideo video = new YouTubeVideo();
				video.setVideoId(vid);
				video.setTitle(sn == null ? null : Objects.toString(sn.get("title"), ""));
				video.setThumbnail(thumbUrl);
				video.setPublishedAt(sn == null ? null : Objects.toString(sn.get("publishedAt"), ""));
				video.setViewCount(views);
				videos.add(video);
			}
		}

		videos.sort(Comparator.comparingLong(YouTubeVideo::getViewCount).reversed());
		return videos;
	}
}
