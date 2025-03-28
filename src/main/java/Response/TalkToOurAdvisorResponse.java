package Response;

public class TalkToOurAdvisorResponse {

	private Long id;

	private String fullName;

	private String emailId;

	private int noOfPeople;

	private String companyName;

	private String mobileNumber;

	private String trainingCourse;

	private String comments;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public int getNoOfPeople() {
		return noOfPeople;
	}

	public void setNoOfPeople(int noOfPeople) {
		this.noOfPeople = noOfPeople;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getTrainingCourse() {
		return trainingCourse;
	}

	public void setTrainingCourse(String trainingCourse) {
		this.trainingCourse = trainingCourse;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public TalkToOurAdvisorResponse(Long id, String fullName, String emailId, int noOfPeople, String companyName,
			String mobileNumber, String trainingCourse, String comments) {
		super();
		this.id = id;
		this.fullName = fullName;
		this.emailId = emailId;
		this.noOfPeople = noOfPeople;
		this.companyName = companyName;
		this.mobileNumber = mobileNumber;
		this.trainingCourse = trainingCourse;
		this.comments = comments;
	}

	public TalkToOurAdvisorResponse() {
		super();
	}

}
