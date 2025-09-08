package dac.ufpr.gerente.exception.custom;

import org.springframework.http.HttpStatus;

import dac.ufpr.gerente.exception.CustomException;

public class ResourceNotFoundException extends CustomException {
    public ResourceNotFoundException(String entidade) {
        super(entidade + " Não encontrado", HttpStatus.NOT_FOUND.value());
    }

}
