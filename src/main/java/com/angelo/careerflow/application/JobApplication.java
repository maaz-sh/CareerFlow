package com.angelo.careerflow.application;

import com.angelo.careerflow.user.User;
import com.angelo.careerflow.contact.Contact;
import com.angelo.careerflow.interview.Interview;
import com.angelo.careerflow.note.Note;
import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User user;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String roleTitle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    private LocalDate appliedDate;

    private String location;

    @Enumerated(EnumType.STRING)
    private WorkplaceType workplaceType;

    private String salaryRange;

    @Column(columnDefinition = "TEXT")
    private String jobPostingUrl;

    @Column(length = 3000)
    private String description;

    private String applicantName;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Interview> interviews = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Note> notes = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contact> contacts = new ArrayList<>();

    protected JobApplication() {
    }

    public JobApplication(
            User user,
            String company,
            String roleTitle,
            ApplicationStatus status,
            LocalDate appliedDate,
            String location,
            WorkplaceType workplaceType,
            String salaryRange,
            String jobPostingUrl,
            String description,
            String applicantName
    ) {
        this.user = user;
        this.company = company;
        this.roleTitle = roleTitle;
        this.status = status == null ? ApplicationStatus.APPLIED : status;
        this.appliedDate = appliedDate;
        this.location = location;
        this.workplaceType = workplaceType;
        this.salaryRange = salaryRange;
        this.jobPostingUrl = jobPostingUrl;
        this.description = description;
        this.applicantName = applicantName;
    }

    public void update(
            String company,
            String roleTitle,
            ApplicationStatus status,
            LocalDate appliedDate,
            String location,
            WorkplaceType workplaceType,
            String salaryRange,
            String jobPostingUrl,
            String description,
            String applicantName
    ) {
        this.company = company;
        this.roleTitle = roleTitle;
        this.status = status;
        this.appliedDate = appliedDate;
        this.location = location;
        this.workplaceType = workplaceType;
        this.salaryRange = salaryRange;
        this.jobPostingUrl = jobPostingUrl;
        this.description = description;
        this.applicantName = applicantName;
        this.updatedAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getCompany() {
        return company;
    }

    public String getRoleTitle() {
        return roleTitle;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public LocalDate getAppliedDate() {
        return appliedDate;
    }

    public String getLocation() {
        return location;
    }

    public WorkplaceType getWorkplaceType() {
        return workplaceType;
    }

    public String getSalaryRange() {
        return salaryRange;
    }

    public String getJobPostingUrl() {
        return jobPostingUrl;
    }

    public String getDescription() {
        return description;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}