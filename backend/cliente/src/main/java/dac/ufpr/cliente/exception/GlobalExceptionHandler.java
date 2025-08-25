package dac.ufpr.cliente.exception;

import dac.ufpr.cliente.exception.custom.BadRequestException;
import dac.ufpr.cliente.exception.custom.ResourceAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT) // 409
    public ResponseEntity<String> handleResourceAlreadyExistsException(ResourceAlreadyExistsException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400
    public ResponseEntity<String> handleBadRequestException(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

}
