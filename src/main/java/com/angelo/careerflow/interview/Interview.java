package com.angelo.careerflow.interview;

import com.angelo.careerflow.application.JobApplication;
import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private JobApplication application;

    @Column(nullable = false)
    private String interviewType;

    private LocalDateTime scheduledAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "interview_interviewers", joinColumns = @JoinColumn(name = "interview_id"))
    @Column(name = "name", nullable = false)
    private List<String> interviewerNames = new ArrayList<>();

    @Column(length = 3000)
    private String topics;

    private String outcome;

    @Column(length = 3000)
    private String notes;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected Interview() {
    }

    public Interview(
            JobApplication application,
            String interviewType,
            LocalDateTime scheduledAt,
            List<String> interviewerNames,
            String topics,
            String outcome,
            String notes
    ) {
        this.application = application;
        this.interviewType = interviewType;
        this.scheduledAt = scheduledAt;
        this.interviewerNames = interviewerNames != null ? interviewerNames : new ArrayList<>();
        this.topics = topics;
        this.outcome = outcome;
        this.notes = notes;
    }

    public String getId() {
        return id;
    }

    public String getApplicationId() {
        return application.getId();
    }

    public String getInterviewType() {
        return interviewType;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public List<String> getInterviewerNames() {
        return interviewerNames;
    }

    public String getTopics() {
        return topics;
    }

    public String getOutcome() {
        return outcome;
    }

    public String getNotes() {
        return notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}