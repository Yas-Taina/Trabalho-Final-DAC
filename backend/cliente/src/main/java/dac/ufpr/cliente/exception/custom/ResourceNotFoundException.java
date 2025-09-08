package dac.ufpr.cliente.exception.custom;

import dac.ufpr.cliente.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // 404
public class ResourceNotFoundException extends CustomException {
    public ResourceNotFoundException(String entidade) {
        super(entidade + " não encontrado", HttpStatus.NOT_FOUND.value());
    }
}
