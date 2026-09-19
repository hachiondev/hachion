package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Entity
@Table(name = "geo_keyword", uniqueConstraints = {
		@UniqueConstraint(columnNames = { "geo_keyword_group_id", "geo_keyword_name" }) })
@Data
public class GeoKeyword {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String geoKeywordName;
	private LocalDate createdDate;

	@ManyToOne
	@JoinColumn(name = "geo_keyword_group_id", nullable = false)
	private GeoKeywordGroup group;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getGeoKeywordName() {
		return geoKeywordName;
	}

	public void setGeoKeywordName(String geoKeywordName) {
		this.geoKeywordName = geoKeywordName;
	}

	public LocalDate getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDate createdDate) {
		this.createdDate = createdDate;
	}

	public GeoKeywordGroup getGroup() {
		return group;
	}

	public void setGroup(GeoKeywordGroup group) {
		this.group = group;
	}

}