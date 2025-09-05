package Response;

public class ApiResponseAdmin {
	private String message;

    // Constructor, getters, and setters
    public ApiResponseAdmin(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
