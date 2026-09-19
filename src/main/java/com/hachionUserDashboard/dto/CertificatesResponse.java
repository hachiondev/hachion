package com.hachionUserDashboard.dto;

import java.util.List;

public record CertificatesResponse(long total, List<CertificateDTO> items) {
}