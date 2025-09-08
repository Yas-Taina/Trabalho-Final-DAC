package dac.ufpr.gerente.exception.custom;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import dac.ufpr.gerente.exception.CustomException;

@ResponseStatus(HttpStatus.BAD_REQUEST) // 400
public class BadRequestException extends CustomException{
    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST.value());
    }
}



