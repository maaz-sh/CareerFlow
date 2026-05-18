package com.angelo.careerflow.application;

import com.angelo.careerflow.user.User;
import com.angelo.careerflow.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

class JobApplicationServiceTest {

    @Test
    void createApplication_shouldSaveApplicationForCurrentUser() {
        JobApplicationRepository applicationRepository =
                Mockito.mock(JobApplicationRepository.class);

        UserRepository userRepository =
                Mockito.mock(UserRepository.class);

        User user = new User("angelo@example.com", "hashed-password");

        Mockito.when(userRepository.findByEmail("angelo@example.com"))
                .thenReturn(Optional.of(user));

        Mockito.when(applicationRepository.save(any(JobApplication.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "angelo@example.com",
                        null
                )
        );

        JobApplicationService service =
                new JobApplicationService(applicationRepository, userRepository);

        CreateApplicationRequest request = new CreateApplicationRequest(
                "Walmart",
                "Software Engineer II",
                ApplicationStatus.APPLIED,
                LocalDate.of(2026, 5, 3),
                "Bentonville, AR",
                WorkplaceType.HYBRID,
                "$95k-$130k",
                "https://careers.walmart.com/example",
                "Backend Java role",
                null
        );

        JobApplicationResponse response = service.createApplication(request);

        assertThat(response.company()).isEqualTo("Walmart");
        assertThat(response.roleTitle()).isEqualTo("Software Engineer II");
        assertThat(response.status()).isEqualTo(ApplicationStatus.APPLIED);

        Mockito.verify(applicationRepository).save(any(JobApplication.class));
    }
}
