package dac.ufpr.Auth.exception.custom;

import dac.ufpr.Auth.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED) // 401
public class InvalidCredentialsException extends CustomException {
    public InvalidCredentialsException(String message) {
        super(message, HttpStatus.UNAUTHORIZED.value());
    }
}
