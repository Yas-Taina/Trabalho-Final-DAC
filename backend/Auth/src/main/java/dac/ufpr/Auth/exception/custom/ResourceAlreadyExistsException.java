package dac.ufpr.Auth.exception.custom;

import dac.ufpr.Auth.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT) // 409
public class ResourceAlreadyExistsException extends CustomException {
    public ResourceAlreadyExistsException(String message) {
        super(message, HttpStatus.CONFLICT.value());
    }
}
