package com.angelo.careerflow.exception;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public Map<String, Object> handleNotFound(ResourceNotFoundException exception) {
        return Map.of(
                "timestamp", Instant.now(),
                "status", 404,
                "error", "Not Found",
                "message", exception.getMessage()
        );
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({
            IllegalArgumentException.class,
            MethodArgumentNotValidException.class
    })
    public Map<String, Object> handleBadRequest(Exception exception) {
        return Map.of(
                "timestamp", Instant.now(),
                "status", 400,
                "error", "Bad Request",
                "message", exception.getMessage()
        );
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler({BadCredentialsException.class, LockedException.class, DisabledException.class})
    public Map<String, Object> handleAuthFailure(Exception exception) {
        String message = exception instanceof BadCredentialsException
                ? "Invalid email or password."
                : exception.getMessage();
        return Map.of(
                "timestamp", Instant.now(),
                "status", 401,
                "error", "Unauthorized",
                "message", message
        );
    }
}