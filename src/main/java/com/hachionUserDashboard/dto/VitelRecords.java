package com.hachionUserDashboard.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class VitelRecords {
	@JacksonXmlElementWrapper(localName = "record", useWrapping = false)
	@JsonProperty("record")
	private List<VitelRecord> record;

	public List<VitelRecord> getRecord() {
		return record;
	}

	public void setRecord(List<VitelRecord> record) {
		this.record = record;
	}

	public String getTotalnoofrecords() {

		return null;
	}

}