package Response;

import java.util.List;

//@Getter
//@Setter
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
public class WorkshopResponse {

	private Long workshopId;

	private List<String> courseNames;

	private String courseCategory;

	private String date;

	private String time;

	private String timeZone;

	private String message;

	private String fullName;

	private String emailId;

	private String mobileNumber;

	private String country;

	public Long getWorkshopId() {
		return workshopId;
	}

	public void setWorkshopId(Long workshopId) {
		this.workshopId = workshopId;
	}

	public List<String> getCourseNames() {
		return courseNames;
	}

	public void setCourseNames(List<String> courseNames) {
		this.courseNames = courseNames;
	}

	public String getCourseCategory() {
		return courseCategory;
	}

	public void setCourseCategory(String courseCategory) {
		this.courseCategory = courseCategory;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public WorkshopResponse() {
		super();
	}

	public WorkshopResponse(Long workshopId, List<String> courseNames, String courseCategory, String date, String time,
			String timeZone, String message, String fullName, String emailId, String mobileNumber, String country) {
		super();
		this.workshopId = workshopId;
		this.courseNames = courseNames;
		this.courseCategory = courseCategory;
		this.date = date;
		this.time = time;
		this.timeZone = timeZone;
		this.message = message;
		this.fullName = fullName;
		this.emailId = emailId;
		this.mobileNumber = mobileNumber;
		this.country = country;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

}
