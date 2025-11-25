package com.chopadelab.core.exception;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException; // Spring Security
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // =====================
    // Spring Security Errors
    // =====================
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleSpringAccessDenied(AccessDeniedException ex) {
        log.warn("Spring Security access denied", ex);
        return buildResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    // =====================
    // JWT Errors
    // =====================
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<Map<String, Object>> handleExpiredJwt(ExpiredJwtException ex) {
        log.warn("Expired JWT", ex);
        return buildResponse("JWT expired: " + ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Map<String, Object>> handleJwt(JwtException ex) {
        log.warn("Invalid JWT", ex);
        return buildResponse("Invalid JWT: " + ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    // =====================
    // Custom Domain Errors
    // =====================
    @ExceptionHandler(CustomAccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleCustomAccessDenied(CustomAccessDeniedException ex) {
        log.warn("Custom access denied", ex);
        return buildResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleUserExists(UserAlreadyExistsException ex) {
        log.warn("User already exists", ex);
        return buildResponse(ex.getMessage(), HttpStatus.CONFLICT); // 409
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCreds(InvalidCredentialsException ex) {
        log.warn("Invalid credentials", ex);
        return buildResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<Map<String, Object>> handleFunds(InsufficientFundsException ex) {
        log.warn("Insufficient funds", ex);
        return buildResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleRoleNotFound(RoleNotFoundException ex) {
        log.warn("Role not found", ex);
        return buildResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // =====================
    // Fallback
    // =====================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAll(Exception ex) {
        log.error("Unhandled error", ex);
        return buildResponse("Unexpected error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // =====================
    // Utility method
    // =====================
    private ResponseEntity<Map<String, Object>> buildResponse(String message, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return new ResponseEntity<>(body, status);
    }
}
