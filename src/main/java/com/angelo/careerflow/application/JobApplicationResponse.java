package com.angelo.careerflow.application;

import java.time.Instant;
import java.time.LocalDate;

public record JobApplicationResponse(
        String id,
        String company,
        String roleTitle,
        ApplicationStatus status,
        LocalDate appliedDate,
        String location,
        WorkplaceType workplaceType,
        String salaryRange,
        String jobPostingUrl,
        String description,
        String applicantName,
        Instant createdAt,
        Instant updatedAt
) {
    public static JobApplicationResponse from(JobApplication application) {
        return new JobApplicationResponse(
                application.getId(),
                application.getCompany(),
                application.getRoleTitle(),
                application.getStatus(),
                application.getAppliedDate(),
                application.getLocation(),
                application.getWorkplaceType(),
                application.getSalaryRange(),
                application.getJobPostingUrl(),
                application.getDescription(),
                application.getApplicantName(),
                application.getCreatedAt(),
                application.getUpdatedAt()
        );
    }
}