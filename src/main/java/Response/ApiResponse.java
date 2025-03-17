package Response;

public class ApiResponse {
	private String message;

    // Constructor, getters, and setters
    public ApiResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
