package com.angelo.careerflow.application;

import com.angelo.careerflow.exception.ResourceNotFoundException;
import com.angelo.careerflow.user.User;
import com.angelo.careerflow.user.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public JobApplicationService(
            JobApplicationRepository applicationRepository,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getApplications(
            ApplicationStatus status,
            String company,
            Pageable pageable
    ) {
        User user = getCurrentUser();

        Page<JobApplication> page;

        if (status != null && company != null && !company.isBlank()) {
            page = applicationRepository.findByUserIdAndStatusAndCompanyContainingIgnoreCase(
                    user.getId(),
                    status,
                    company,
                    pageable
            );
        } else if (status != null) {
            page = applicationRepository.findByUserIdAndStatus(
                    user.getId(),
                    status,
                    pageable
            );
        } else if (company != null && !company.isBlank()) {
            page = applicationRepository.findByUserIdAndCompanyContainingIgnoreCase(
                    user.getId(),
                    company,
                    pageable
            );
        } else {
            page = applicationRepository.findByUserId(user.getId(), pageable);
        }

        return page.map(JobApplicationResponse::from);
    }

    public JobApplicationResponse createApplication(CreateApplicationRequest request) {
        User user = getCurrentUser();

        JobApplication application = new JobApplication(
                user,
                request.company(),
                request.roleTitle(),
                request.status(),
                request.appliedDate(),
                request.location(),
                request.workplaceType(),
                request.salaryRange(),
                request.jobPostingUrl(),
                request.description(),
                request.applicantName()
        );

        return JobApplicationResponse.from(applicationRepository.save(application));
    }

    @Transactional(readOnly = true)
    public JobApplicationResponse getApplication(String id) {
        User user = getCurrentUser();

        JobApplication application = applicationRepository.findById(id)
                .filter(app -> app.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        return JobApplicationResponse.from(application);
    }

    public JobApplicationResponse updateApplication(
            String id,
            UpdateApplicationRequest request
    ) {
        User user = getCurrentUser();

        JobApplication application = applicationRepository.findById(id)
                .filter(app -> app.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        application.update(
                request.company(),
                request.roleTitle(),
                request.status(),
                request.appliedDate(),
                request.location(),
                request.workplaceType(),
                request.salaryRange(),
                request.jobPostingUrl(),
                request.description(),
                request.applicantName()
        );

        return JobApplicationResponse.from(applicationRepository.save(application));
    }

    public void deleteApplication(String id) {
        User user = getCurrentUser();

        JobApplication application = applicationRepository.findById(id)
                .filter(app -> app.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        applicationRepository.delete(application);
    }

    @Transactional(readOnly = true)
    public JobApplication getOwnedApplicationEntity(String applicationId) {
        User user = getCurrentUser();

        return applicationRepository.findById(applicationId)
                .filter(app -> app.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}