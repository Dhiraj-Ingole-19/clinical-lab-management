package com.chopadelab.core.exception;

public class CustomAccessDeniedException extends RuntimeException {
    public CustomAccessDeniedException(String message) {
        super(message);
    }
}
