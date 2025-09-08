package dac.ufpr.gerente.exception.custom;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import dac.ufpr.gerente.exception.CustomException;

@ResponseStatus(HttpStatus.CONFLICT) 
public class ResourceAlreadyExistsException extends CustomException {
    public ResourceAlreadyExistsException(String entidade) {
        super(entidade + " Já existe", HttpStatus.CONFLICT.value());
    }
}
