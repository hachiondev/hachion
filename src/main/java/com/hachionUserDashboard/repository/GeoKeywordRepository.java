package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hachionUserDashboard.dto.GeoKeywordListResponse;
import com.hachionUserDashboard.entity.GeoKeyword;
import com.hachionUserDashboard.entity.GeoKeywordGroup;

public interface GeoKeywordRepository extends JpaRepository<GeoKeyword, Long> {

	boolean existsByGroupAndGeoKeywordName(GeoKeywordGroup group, String geoKeywordName);

	Optional<GeoKeyword> findByGroupAndGeoKeywordName(GeoKeywordGroup group, String geoKeywordName);

	@Query("""
			    SELECT new com.hachionUserDashboard.dto.GeoKeywordListResponse(
			    k.id,
			        g.id,
			        g.categoryName,
			        g.courseName,
			        g.createdDate,
			        k.geoKeywordName
			    )
			    FROM GeoKeyword k
			    JOIN k.group g
			    ORDER BY g.categoryName ASC
			""")
	List<GeoKeywordListResponse> findAllGeoKeywordList();

	long countByGroup(GeoKeywordGroup group);

	List<GeoKeyword> findByGroup(GeoKeywordGroup group);

}