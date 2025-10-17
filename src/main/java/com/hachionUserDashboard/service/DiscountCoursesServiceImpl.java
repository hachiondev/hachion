package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.hachionUserDashboard.dto.DiscountCousesRequest;
import com.hachionUserDashboard.dto.DiscountCousesResponse;
import com.hachionUserDashboard.entity.DiscountCourses;
import com.hachionUserDashboard.repository.DiscountCoursesRepository;

import Service.DiscountCoursesServiceInterface;

@Service
public class DiscountCoursesServiceImpl implements DiscountCoursesServiceInterface {

	@Autowired
	private DiscountCoursesRepository discountCoursesRepository;

	@Override
	public DiscountCousesResponse createCouponCode(DiscountCousesRequest discountCousesRequest) {

		DiscountCourses entity = new DiscountCourses();
		entity.setCourseNames(discountCousesRequest.getCourseNames());
		entity.setCountryNames(discountCousesRequest.getCountryNames());
		entity.setDiscountPercentage(discountCousesRequest.getDiscountPercentage());
		entity.setStartDate(discountCousesRequest.getStartDate());

		entity.setEndDate(discountCousesRequest.getEndDate());
		entity.setStatus(discountCousesRequest.getStatus());
		entity.setCreatedDate(LocalDate.now());
		entity.setNumberOfHits(0);

		DiscountCourses discountCourses = discountCoursesRepository.save(entity);
		DiscountCousesResponse discountCousesResponse = createResponseForDiscountCourses(discountCourses);
		return discountCousesResponse;
	}

	@Override
	public DiscountCousesResponse updateCouponCode(DiscountCousesRequest discountCousesRequest) {

		if (discountCousesRequest.getDiscountId() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "discountId is required");
		}

		DiscountCourses entity = discountCoursesRepository.findById(discountCousesRequest.getDiscountId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Discount not found"));

		LocalDate newStart = discountCousesRequest.getStartDate() != null ? discountCousesRequest.getStartDate()
				: entity.getStartDate();

		LocalDate newEnd = discountCousesRequest.getEndDate() != null ? discountCousesRequest.getEndDate()
				: entity.getEndDate();

		if (newStart != null && newEnd != null && newEnd.isBefore(newStart)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "endDate cannot be before startDate");
		}

		if (discountCousesRequest.getCourseNames() != null) {
			entity.setCourseNames(discountCousesRequest.getCourseNames());
		}
		if (discountCousesRequest.getCountryNames() != null) {
			entity.setCountryNames(discountCousesRequest.getCountryNames());
		}
		if (discountCousesRequest.getDiscountPercentage() != null) {
			entity.setDiscountPercentage(discountCousesRequest.getDiscountPercentage());
		}
		if (discountCousesRequest.getStartDate() != null) {
			entity.setStartDate(discountCousesRequest.getStartDate());
		}
		if (discountCousesRequest.getEndDate() != null) {
			entity.setEndDate(discountCousesRequest.getEndDate());
		}
		if (discountCousesRequest.getStatus() != null) {
			entity.setStatus(discountCousesRequest.getStatus());
		}

		DiscountCourses saved = discountCoursesRepository.save(entity);
		return createResponseForDiscountCourses(saved);
	}

	@Override
	public void deleteCouponCode(Long discountId) {
		if (discountId == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "discountId is required");
		}

		DiscountCourses entity = discountCoursesRepository.findById(discountId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Discount not found"));

		discountCoursesRepository.delete(entity);
	}

	@Override
	public List<DiscountCousesResponse> getAlCouponCodeDetails() {
		List<DiscountCourses> entities = discountCoursesRepository.findAll();

		return entities.stream().map(this::createResponseForDiscountCourses).collect(Collectors.toList());
	}

	private DiscountCousesResponse createResponseForDiscountCourses(DiscountCourses discountCourses) {
		DiscountCousesResponse discountCousesResponse = new DiscountCousesResponse();
		discountCousesResponse.setDiscountId(discountCourses.getDiscountId());
		discountCousesResponse.setCourseNames(discountCourses.getCourseNames());
		discountCousesResponse.setCountryNames(discountCourses.getCountryNames());
		discountCousesResponse.setDiscountPercentage(discountCourses.getDiscountPercentage());
		discountCousesResponse.setStartDate(discountCourses.getStartDate());
		discountCousesResponse.setEndDate(discountCourses.getEndDate());
		discountCousesResponse.setStatus(discountCourses.getStatus());
		discountCousesResponse.setCreatedDate(discountCourses.getCreatedDate());
		discountCousesResponse.setNumberOfHits(discountCourses.getNumberOfHits());
		return discountCousesResponse;
	}
}
