package com.hachionUserDashboard.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.ToolDetailsResponse;
import com.hachionUserDashboard.dto.ToolsCoverResponse;
import com.hachionUserDashboard.dto.ToolsFlatResponse;
import com.hachionUserDashboard.dto.ToolsResponse;
import com.hachionUserDashboard.service.ToolsServiceImpl;

@RestController
@RequestMapping("/api/tools")
@CrossOrigin
public class ToolsController {

	private final ToolsServiceImpl toolsService;

	public ToolsController(ToolsServiceImpl toolsService) {
		this.toolsService = toolsService;
	}

	// ADD
//	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//	public ToolsResponse addTools(@RequestParam String category_name, @RequestParam String courseName,
//			@RequestParam List<String> toolsName, @RequestParam List<String> toolsLink,
//			@RequestParam List<MultipartFile> toolImages) {
//		return toolsService.addTools(category_name, courseName, toolsName, toolsLink, toolImages);
//	}
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ToolsResponse addTools(
	        @RequestParam String category_name,
	        @RequestParam String courseName,
	        @RequestParam List<String> toolsName,
	        @RequestParam List<String> toolsLink,
	        @RequestParam(required = false) List<MultipartFile> toolImages,
	        @RequestParam(required = false) List<String> imageUrls) {

	    return toolsService.addTools(category_name, courseName, toolsName, toolsLink, toolImages, imageUrls);
	}


	// GET by category + course
	@GetMapping
	public ToolsResponse getByCategoryAndCourse(@RequestParam String category_name, @RequestParam String courseName) {
		return toolsService.getByCategoryAndCourse(category_name, courseName);
	}

	// UPDATE (ADD / DELETE child rows handled)
	@PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ToolsResponse updateTools(@RequestParam String category_name, @RequestParam String courseName,
			@RequestParam List<Long> itemIds, // existing ids or 0 for new
			@RequestParam List<String> toolsName, @RequestParam List<String> toolsLink,
			@RequestParam(required = false) List<MultipartFile> toolImages) {
		return toolsService.updateTools(category_name, courseName, itemIds, toolsName, toolsLink, toolImages);
	}

	// DELETE full course tools
	@DeleteMapping
	public void deleteTools(@RequestParam String category_name, @RequestParam String courseName) {
		toolsService.deleteByCategoryAndCourse(category_name, courseName);
	}

	@GetMapping("/all")
	public List<ToolsResponse> getAllTools() {
		return toolsService.getAllTools();
	}

	@GetMapping("/all/flat")
	public List<ToolsFlatResponse> getAllToolsFlat() {
		return toolsService.getAllToolsFlat();
	}

	@PutMapping("/item/{itemId}")
	public ResponseEntity<ToolsFlatResponse> updateToolItem(@PathVariable Long itemId,
			@RequestParam String category_name, @RequestParam String courseName, @RequestParam String toolsName,
			@RequestParam String toolsLink, @RequestParam(required = false) MultipartFile toolImage) {
		return ResponseEntity.ok(
				toolsService.updateSingleToolItem(itemId, category_name, courseName, toolsName, toolsLink, toolImage));
	}

	@DeleteMapping("/item/{itemId}")
	public ResponseEntity<String> deleteToolItem(@PathVariable Long itemId, @RequestParam String category_name,
			@RequestParam String courseName) {

		toolsService.deleteSingleToolItem(itemId, category_name, courseName);
		return ResponseEntity.ok("Tool item deleted successfully");
	}

	@GetMapping("/by-course")
	public ResponseEntity<List<ToolsCoverResponse>> getToolsByCourse(@RequestParam String courseName) {

		List<ToolsCoverResponse> tools = toolsService.getToolsByCourse(courseName);

		return ResponseEntity.ok(tools);
	}

	@GetMapping("/names")
	public ResponseEntity<List<String>> getAllToolNames() {
		return ResponseEntity.ok(toolsService.getAllToolNames());
	}

	@GetMapping("/details")
	public ResponseEntity<ToolDetailsResponse> getToolDetails(@RequestParam String toolName) {

		return ResponseEntity.ok(toolsService.getToolDetailsByName(toolName));
	}
}