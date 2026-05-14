package com.angelo.careerflow.application;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;

public record UpdateApplicationRequest(
        @NotBlank String company,
        @NotBlank String roleTitle,
        ApplicationStatus status,
        LocalDate appliedDate,
        String location,
        WorkplaceType workplaceType,
        String salaryRange,
        @URL String jobPostingUrl,
        String description,
        String applicantName
) {
}