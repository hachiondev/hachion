package com.hachionUserDashboard.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.*;
import com.hachionUserDashboard.entity.*;
import com.hachionUserDashboard.repository.ToolsItemRepository;
import com.hachionUserDashboard.repository.ToolsRepository;

@Service
public class ToolsServiceImpl {

	private final ToolsRepository toolsRepository;
	private final ToolsItemRepository toolsItemRepository;

	@Value("${tools.images.upload.path}")
	private String uploadPath;

	public ToolsServiceImpl(ToolsRepository toolsRepository, ToolsItemRepository toolsItemRepository) {
		this.toolsRepository = toolsRepository;
		this.toolsItemRepository = toolsItemRepository;
	}

	public ToolsResponse addTools(String category, String course, List<String> names, List<String> links,
			List<MultipartFile> images, List<String> imageUrls) {

		validateSizes(names, links, images, imageUrls);

		// ✅ STEP 1: FIND EXISTING PARENT (VERY IMPORTANT)
		ToolsEntity tools = toolsRepository.findByCategoryNameAndCourseName(category, course).orElseGet(() -> {
			ToolsEntity t = new ToolsEntity();
			t.setCategoryName(category);
			t.setCourseName(course);
			t.setCreatedDate(LocalDate.now());
			t.setItems(new ArrayList<>());
			return t;
		});

		// Existing children (if parent already exists)
		List<ToolsItemEntity> items = tools.getItems();

		for (int i = 0; i < names.size(); i++) {

			// ✅ Duplicate tool check (same as before)
			Long count = toolsItemRepository.countDuplicate(category, course, names.get(i));
			if (count != null && count > 0) {
				throw new RuntimeException("Duplicate tool not allowed for same category and course: " + names.get(i));
			}

			ToolsItemEntity item = new ToolsItemEntity();
			item.setToolsName(names.get(i));
			item.setToolsLink(links.get(i));

//			String imageFileName = saveImage(images.get(i), category, course, names.get(i));
//
//			item.setImageName(images.get(i).getOriginalFilename());
//			item.setImageUrl(imageFileName);
			if (images != null && images.size() > i && images.get(i) != null && !images.get(i).isEmpty()) {

				String imageFileName = saveImage(images.get(i), category, course, names.get(i));
				item.setImageName(images.get(i).getOriginalFilename());
				item.setImageUrl(imageFileName);

			} else if (imageUrls != null && imageUrls.size() > i && imageUrls.get(i) != null
			        && !imageUrls.get(i).isBlank()) {

			    // Reuse existing image
			    item.setImageUrl(imageUrls.get(i));

			    // ALSO set imageName (important)
			    item.setImageName(imageUrls.get(i));
			}


			item.setTools(tools);

			items.add(item);
		}

		tools.setItems(items);

		// ✅ STEP 2: SAVE (INSERT if new, UPDATE if exists)
		return map(toolsRepository.save(tools));
	}

	// ================= GET =================
	public ToolsResponse getByCategoryAndCourse(String category, String course) {

		ToolsEntity entity = toolsRepository.findByCategoryNameAndCourseName(category, course)
				.orElseThrow(() -> new RuntimeException("Tools not found"));

		return map(entity);
	}

	public ToolsResponse updateTools(String category, String course, List<Long> itemIds, List<String> names,
			List<String> links, List<MultipartFile> images) {

		validateSizesForUpdate(names, links, images);

		ToolsEntity entity = toolsRepository.findByCategoryNameAndCourseName(category, course)
				.orElseThrow(() -> new RuntimeException("Tools not found"));

		// Existing DB items mapped by ID
		Map<Long, ToolsItemEntity> existingMap = entity.getItems().stream()
				.collect(Collectors.toMap(ToolsItemEntity::getId, i -> i));

		List<ToolsItemEntity> updatedItems = new ArrayList<>();

		for (int i = 0; i < names.size(); i++) {

			Long itemId = itemIds.get(i);
			boolean isNew = (itemId == null || itemId == 0);

			// ✅ Duplicate check ONLY for new rows
			if (isNew) {
				Long count = toolsItemRepository.countDuplicate(category, course, names.get(i));
				if (count != null && count > 0) {
					throw new RuntimeException(
							"Duplicate tool not allowed for same category and course: " + names.get(i));
				}
			}

			ToolsItemEntity item;

			if (!isNew && existingMap.containsKey(itemId)) {
				// UPDATE existing row
				item = existingMap.get(itemId);
			} else {
				// ADD new row
				item = new ToolsItemEntity();
				item.setTools(entity);
			}

			item.setToolsName(names.get(i));
			item.setToolsLink(links.get(i));

			// Image update (optional)
			if (images != null && images.size() > i && !images.get(i).isEmpty()) {

				// If image is replaced → delete old image first
				if (item.getImageUrl() != null) {
					deleteImageFile(item.getImageUrl());
				}

				String imageFileName = saveImage(images.get(i), category, course, names.get(i));

				item.setImageName(images.get(i).getOriginalFilename());
				item.setImageUrl(imageFileName);
			}

			updatedItems.add(item);
		}

		// 🔥 DELETE removed rows + their images
		Set<Long> updatedIds = updatedItems.stream().filter(i -> i.getId() != null).map(ToolsItemEntity::getId)
				.collect(Collectors.toSet());

		for (ToolsItemEntity oldItem : entity.getItems()) {
			if (oldItem.getId() != null && !updatedIds.contains(oldItem.getId())) {
				// Child row removed → delete image from disk
				deleteImageFile(oldItem.getImageUrl());
			}
		}

		// Replace DB children
		entity.getItems().clear();
		entity.getItems().addAll(updatedItems);

		return map(toolsRepository.save(entity));
	}

	private void deleteImageFile(String fileName) {

		if (fileName == null || fileName.isBlank()) {
			return;
		}

		try {
			Path imagePath = Paths.get(uploadPath).resolve(fileName) // safe join
					.normalize().toAbsolutePath();

			System.out.println("Deleting image: " + imagePath);

			boolean deleted = Files.deleteIfExists(imagePath);

			if (deleted) {
				System.out.println("Image deleted successfully: " + fileName);
			} else {
				System.out.println("Image not found on disk: " + fileName);
			}

		} catch (Exception e) {
			System.err.println("Failed to delete image file: " + fileName);
			e.printStackTrace();
		}
	}

	// ================= DELETE =================
	public void deleteByCategoryAndCourse(String category, String course) {
		toolsRepository.deleteByCategoryNameAndCourseName(category, course);
	}

	// ================= IMAGE SAVE =================
	private String saveImage(MultipartFile file, String category, String course, String toolsName) {
		try {
			String safeCategory = category.replaceAll("\\s+", "");
			String safeCourse = course.replaceAll("\\s+", "");
			String safeTool = toolsName.replaceAll("\\s+", "");

			String ext = Objects.requireNonNull(file.getOriginalFilename())
					.substring(file.getOriginalFilename().lastIndexOf("."));

			String fileName = safeCategory + "_" + safeCourse + "_" + safeTool + ext;

			File dir = new File(uploadPath);
			if (!dir.exists()) {
				dir.mkdirs();
			}

			Path fullPath = Paths.get(uploadPath, fileName);

			// 🚫 Prevent overwrite
			if (Files.exists(fullPath)) {
				throw new RuntimeException("Duplicate image not allowed for same category, course and tool");
			}

			Files.write(fullPath, file.getBytes());

			// ✅ Only filename stored in DB
			return fileName;

		} catch (Exception e) {
			throw new RuntimeException("Image upload failed: " + e.getMessage(), e);
		}
	}

	// ================= VALIDATION =================
	private void validateSizes(List<String> names, List<String> links, List<MultipartFile> images,
			List<String> imageUrls) {
		if (names == null || links == null) {
			throw new RuntimeException("Tools data missing");
		}

		if (names.size() != links.size()) {
			throw new RuntimeException("Tools names and links count mismatch");
		}

		if ((images != null && images.size() != names.size())
				&& (imageUrls != null && imageUrls.size() != names.size())) {
			throw new RuntimeException("Tools images count mismatch");
		}

	}

	private void validateSizesForUpdate(List<String> names, List<String> links, List<MultipartFile> images) {
		if (names == null || links == null) {
			throw new RuntimeException("Tools data missing");
		}

		if (names.size() != links.size()) {
			throw new RuntimeException("Tools names and links count mismatch");
		}

		if (images != null && images.size() != names.size()) {
			throw new RuntimeException("Tools images count mismatch");
		}
	}

	// ================= MAPPER =================
	private ToolsResponse map(ToolsEntity entity) {

		ToolsResponse r = new ToolsResponse();
		r.setCurrId(entity.getCurrId());
		r.setCategory_name(entity.getCategoryName());
		r.setCourseName(entity.getCourseName());
		r.setCreatedDate(entity.getCreatedDate());

		List<ToolsItemResponse> items = entity.getItems().stream().map(i -> {
			ToolsItemResponse ir = new ToolsItemResponse();
			ir.setId(i.getId());
			ir.setToolsName(i.getToolsName());
			ir.setToolsLink(i.getToolsLink());
			ir.setImageName(i.getImageName());
			ir.setImageUrl(i.getImageUrl());
			return ir;
		}).toList();

		r.setTool_image(items);
		return r;
	}

	public List<ToolsResponse> getAllTools() {

		List<ToolsEntity> entities = toolsRepository.findAll();

		return entities.stream().map(this::map).collect(Collectors.toList());
	}

	public List<ToolsFlatResponse> getAllToolsFlat() {

		List<ToolsEntity> entities = toolsRepository.findAll();
		List<ToolsFlatResponse> response = new ArrayList<>();

		for (ToolsEntity entity : entities) {
			for (ToolsItemEntity item : entity.getItems()) {

				ToolsFlatResponse r = new ToolsFlatResponse();

				r.setCurrId(entity.getCurrId());
				r.setCategory_name(entity.getCategoryName());
				r.setCourseName(entity.getCourseName());
				r.setCreatedDate(entity.getCreatedDate());

				r.setId(item.getId());
				r.setToolsName(item.getToolsName());
				r.setToolsLink(item.getToolsLink());
				r.setImageName(item.getImageName());
				r.setImageUrl(item.getImageUrl());

				response.add(r);
			}
		}

		response.sort(Comparator.comparing(ToolsFlatResponse::getCategory_name, String.CASE_INSENSITIVE_ORDER));

		return response;
	}

	public ToolsFlatResponse updateSingleToolItem(Long itemId, String category, String course, String toolsName,
			String toolsLink, MultipartFile image) {

		ToolsItemEntity item = toolsItemRepository.findById(itemId)
				.orElseThrow(() -> new RuntimeException("Tool item not found"));

		ToolsEntity parent = item.getTools();

		// ✅ Safety validation (important)
		if (!parent.getCategoryName().equals(category) || !parent.getCourseName().equals(course)) {
			throw new RuntimeException("Category or Course mismatch");
		}

		// ✅ Duplicate name check (exclude current row)
		Long count = toolsItemRepository.countDuplicateExcludeId(category, course, toolsName, itemId);
		if (count != null && count > 0) {
			throw new RuntimeException("Duplicate tool not allowed");
		}

		// Update fields
		item.setToolsName(toolsName);
		item.setToolsLink(toolsLink);

		// Image update (optional)
		if (image != null && !image.isEmpty()) {

			// delete old image
			if (item.getImageUrl() != null) {
				deleteImageFile(item.getImageUrl());
			}

			String imageFileName = saveImage(image, category, course, toolsName);
			item.setImageName(image.getOriginalFilename());
			item.setImageUrl(imageFileName);
		}

		ToolsItemEntity saved = toolsItemRepository.save(item);

		return mapToFlatResponse(parent, saved);
	}

	private ToolsFlatResponse mapToFlatResponse(ToolsEntity entity, ToolsItemEntity item) {
		ToolsFlatResponse r = new ToolsFlatResponse();

		r.setCurrId(entity.getCurrId());
		r.setCategory_name(entity.getCategoryName());
		r.setCourseName(entity.getCourseName());
		r.setCreatedDate(entity.getCreatedDate());

		r.setId(item.getId());
		r.setToolsName(item.getToolsName());
		r.setToolsLink(item.getToolsLink());
		r.setImageName(item.getImageName());
		r.setImageUrl(item.getImageUrl());

		return r;
	}

	public void deleteSingleToolItem(Long itemId, String category, String course) {

		ToolsItemEntity item = toolsItemRepository.findById(itemId)
				.orElseThrow(() -> new RuntimeException("Tool item not found"));

		ToolsEntity parent = item.getTools();

		// ✅ SAFETY CHECK
		if (!parent.getCategoryName().equals(category) || !parent.getCourseName().equals(course)) {
			throw new RuntimeException("Category or Course mismatch");
		}

		// ✅ DELETE IMAGE FIRST
		if (item.getImageUrl() != null && !item.getImageUrl().isBlank()) {
			deleteImageFile(item.getImageUrl());
		}

		// ✅ DELETE DB RECORD
		toolsItemRepository.delete(item);
	}

	public List<ToolsCoverResponse> getToolsByCourse(String courseName) {

		List<ToolsEntity> entities = toolsRepository.findByCourseName(courseName);

		List<ToolsCoverResponse> response = new ArrayList<>();

		for (ToolsEntity entity : entities) {
			for (ToolsItemEntity item : entity.getItems()) {

				ToolsCoverResponse r = new ToolsCoverResponse();
				r.setToolsName(item.getToolsName());
				r.setToolsLink(item.getToolsLink());
				r.setImageUrl(item.getImageUrl());

				response.add(r);
			}
		}

		return response;
	}

	public List<String> getAllToolNames() {
		return toolsRepository.findDistinctToolNamesOrderByAsc();
	}

	public ToolDetailsResponse getToolDetailsByName(String toolName) {

		List<ToolsItemEntity> items = toolsItemRepository.findByToolsNameIgnoreCaseOrderByIdAsc(toolName);

		if (items.isEmpty()) {
			throw new RuntimeException("Tool not found: " + toolName);
		}

		// ✅ FIRST TOOL (earliest inserted)
		ToolsItemEntity item = items.get(0);

		ToolDetailsResponse response = new ToolDetailsResponse();
		response.setToolsName(item.getToolsName());
		response.setToolsLink(item.getToolsLink());
		response.setImageName(item.getImageName());
		response.setImageUrl(item.getImageUrl());

		// Parent entity values
		response.setCategoryName(item.getTools().getCategoryName());
		response.setCourseName(item.getTools().getCourseName());

		return response;
	}
}
