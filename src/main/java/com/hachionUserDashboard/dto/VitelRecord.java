package com.hachionUserDashboard.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class VitelRecord {

	@JsonProperty("extension")
	private String extension;
	@JsonProperty("from")
	private String from;
	@JsonProperty("to")
	private String to;
	@JsonProperty("start")
	private String start;
	@JsonProperty("duration")
	private String duration;
	@JsonProperty("disposition")
	private String disposition;
	@JsonProperty("direction")
	private String direction;

	@JsonProperty("calldate")
	private String calldate;
	@JsonProperty("src")
	private String src;
	@JsonProperty("dst")
	private String dst;
	@JsonProperty("billsec")
	private String billsec;
	@JsonProperty("callstatus")
	private String callstatus;

	public String getStart() {
		return (start != null && !start.isBlank()) ? start : calldate;
	}

	public String getFrom() {
		return (from != null && !from.isBlank()) ? from : src;
	}

	public String getTo() {
		return (to != null && !to.isBlank()) ? to : dst;
	}

	public String getDuration() {
		return (duration != null && !duration.isBlank()) ? duration : billsec;
	}

	public String getDirection() {
		if (direction != null && !direction.isBlank())
			return direction;
		if (callstatus == null)
			return null;
		return callstatus.equalsIgnoreCase("Outbound") ? "outbound"
				: callstatus.equalsIgnoreCase("Inbound") ? "inbound" : callstatus.toLowerCase();
	}

	public String getExtension() {
		return extension;
	}

	public void setExtension(String extension) {
		this.extension = extension;
	}

	public String getDisposition() {
		return disposition;
	}

	public void setDisposition(String disposition) {
		this.disposition = disposition;
	}

	public String getCalldate() {
		return calldate;
	}

	public void setCalldate(String calldate) {
		this.calldate = calldate;
	}

	public String getSrc() {
		return src;
	}

	public void setSrc(String src) {
		this.src = src;
	}

	public String getDst() {
		return dst;
	}

	public void setDst(String dst) {
		this.dst = dst;
	}

	public String getBillsec() {
		return billsec;
	}

	public void setBillsec(String billsec) {
		this.billsec = billsec;
	}

	public String getCallstatus() {
		return callstatus;
	}

	public void setCallstatus(String callstatus) {
		this.callstatus = callstatus;
	}

	public void setFrom(String from) {
		this.from = from;
	}

	public void setTo(String to) {
		this.to = to;
	}

	public void setStart(String start) {
		this.start = start;
	}

	public void setDuration(String duration) {
		this.duration = duration;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}

}