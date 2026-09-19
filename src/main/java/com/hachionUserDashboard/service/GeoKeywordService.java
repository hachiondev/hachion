package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.GeoKeywordItem;
import com.hachionUserDashboard.dto.GeoKeywordListResponse;
import com.hachionUserDashboard.dto.GeoKeywordRequest;
import com.hachionUserDashboard.dto.GeoKeywordResponse;
import com.hachionUserDashboard.entity.GeoKeyword;
import com.hachionUserDashboard.entity.GeoKeywordGroup;
import com.hachionUserDashboard.repository.GeoKeywordGroupRepository;
import com.hachionUserDashboard.repository.GeoKeywordRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GeoKeywordService {

	@Autowired
	private GeoKeywordGroupRepository groupRepo;

	@Autowired
	private GeoKeywordRepository keywordRepo;

	@Transactional
	public GeoKeywordResponse addGeoKeywords(GeoKeywordRequest request) {

		GeoKeywordGroup group = null;

		Optional<GeoKeywordGroup> existingGroup = groupRepo.findByCategoryNameAndCourseName(request.getCategoryName(),
				request.getCourseName());

		if (existingGroup.isPresent()) {
			group = existingGroup.get();
		} else {
			group = new GeoKeywordGroup();
			group.setCategoryName(request.getCategoryName());
			group.setCourseName(request.getCourseName());
			group.setCreatedDate(LocalDate.now());

			group = groupRepo.save(group);
		}

		List<GeoKeywordItem> responseKeywordList = new ArrayList<>();

		List<String> keywords = request.getGeoKeywords();

		if (keywords != null) {

			for (int i = 0; i < keywords.size(); i++) {

				String keywordName = keywords.get(i);

				if (keywordName == null || keywordName.trim().isEmpty()) {
					continue;
				}

				keywordName = keywordName.trim();

				Optional<GeoKeyword> existingKeyword = keywordRepo.findByGroupAndGeoKeywordName(group, keywordName);

				GeoKeyword geoKeyword = null;

				if (existingKeyword.isPresent()) {
					geoKeyword = existingKeyword.get();
				} else {
					geoKeyword = new GeoKeyword();
					geoKeyword.setGroup(group);
					geoKeyword.setGeoKeywordName(keywordName);
					geoKeyword.setCreatedDate(LocalDate.now());

					geoKeyword = keywordRepo.save(geoKeyword);
				}

				GeoKeywordItem item = new GeoKeywordItem();
				item.setGeoKeywordId(geoKeyword.getId());
				item.setGeoKeywordName(geoKeyword.getGeoKeywordName());

				responseKeywordList.add(item);
			}
		}

		GeoKeywordResponse response = new GeoKeywordResponse();
		response.setGeoKeywordGroupId(group.getId());
		response.setCategoryName(group.getCategoryName());
		response.setCourseName(group.getCourseName());
		response.setGroupCreatedDate(group.getCreatedDate());

		response.setGeoKeywords(responseKeywordList);

		return response;
	}

	public List<GeoKeywordListResponse> getAllGeoKeywords() {
		return keywordRepo.findAllGeoKeywordList();
	}

	@Transactional
	public GeoKeywordItem updateGeoKeyword(GeoKeywordItem request) {

		GeoKeyword existing = keywordRepo.findById(request.getGeoKeywordId())
				.orElseThrow(() -> new RuntimeException("GeoKeyword not found"));

		GeoKeywordGroup group = existing.getGroup();

		String newKeyword = request.getGeoKeywordName().trim();

		keywordRepo.findByGroupAndGeoKeywordName(group, newKeyword).ifPresent(k -> {
			if (!k.getId().equals(existing.getId())) {
				throw new RuntimeException(
						request.getGeoKeywordName() + " " + "GeoKeyword already exists for this Category and Course");
			}
		});

		existing.setGeoKeywordName(newKeyword);

		GeoKeyword saved = keywordRepo.save(existing);

		GeoKeywordItem response = new GeoKeywordItem();
		response.setGeoKeywordId(saved.getId());
		response.setGeoKeywordName(saved.getGeoKeywordName());

		return response;
	}

	@Transactional
	public void deleteGeoKeyword(Long geoKeywordId) {

		GeoKeyword keyword = keywordRepo.findById(geoKeywordId)
				.orElseThrow(() -> new RuntimeException("GeoKeyword not found"));

		GeoKeywordGroup group = keyword.getGroup();

		keywordRepo.delete(keyword);

		long remainingCount = keywordRepo.countByGroup(group);

		if (remainingCount == 0) {
			groupRepo.delete(group);
		}
	}

	public GeoKeywordResponse getGeoKeywordsByCategoryAndCourse(String categoryName, String courseName) {

		GeoKeywordGroup group = groupRepo.findByCategoryNameAndCourseName(categoryName, courseName)
				.orElseThrow(() -> new RuntimeException("No GeoKeywords found for given Category and Course"));

		List<GeoKeyword> keywords = keywordRepo.findByGroup(group);

		List<GeoKeywordItem> items = new ArrayList<>();

		for (GeoKeyword keyword : keywords) {
			GeoKeywordItem item = new GeoKeywordItem();
			item.setGeoKeywordId(keyword.getId());
			item.setGeoKeywordName(keyword.getGeoKeywordName());
			items.add(item);
		}

		GeoKeywordResponse response = new GeoKeywordResponse();
		response.setGeoKeywordGroupId(group.getId());
		response.setCategoryName(group.getCategoryName());
		response.setCourseName(group.getCourseName());
		response.setGroupCreatedDate(group.getCreatedDate());
		response.setGeoKeywords(items);

		return response;
	}

	public GeoKeywordResponse getGeoKeywordsByCourseName(String courseName) {

		GeoKeywordGroup group = groupRepo.findByCourseNameIgnoreCase(courseName)
				.orElseThrow(() -> new RuntimeException("No GeoKeywords found for given Course"));

		List<GeoKeyword> keywords = keywordRepo.findByGroup(group);

		List<GeoKeywordItem> items = new ArrayList<>();

		for (GeoKeyword keyword : keywords) {
			GeoKeywordItem item = new GeoKeywordItem();
			item.setGeoKeywordId(keyword.getId());
			item.setGeoKeywordName(keyword.getGeoKeywordName());
			items.add(item);
		}

		GeoKeywordResponse response = new GeoKeywordResponse();
		response.setGeoKeywordGroupId(group.getId());
		response.setCourseName(group.getCourseName());
		response.setGroupCreatedDate(group.getCreatedDate());
		response.setGeoKeywords(items);

		return response;
	}

}
