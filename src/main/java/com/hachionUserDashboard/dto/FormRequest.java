package com.hachionUserDashboard.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class FormRequest {
    private String fullName;
    private String emailId;
    private String mobileNumber;
    private String timeZone;
    private String courseName;
}
