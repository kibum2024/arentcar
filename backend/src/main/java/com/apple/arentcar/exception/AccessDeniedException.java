package com.apple.arentcar.exception;

/**
 * This exception is thrown when a user attempts to access a resource
 * without having the necessary permissions.
 */
public class AccessDeniedException extends RuntimeException {

    public AccessDeniedException(String message) {
        super(message);
    }

    public AccessDeniedException(String message, Throwable cause) {
        super(message, cause);
    }
}
