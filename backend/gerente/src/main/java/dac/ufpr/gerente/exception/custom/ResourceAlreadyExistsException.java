package dac.ufpr.gerente.exception.custom;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT) // 409
public class ResourceAlreadyExistsException extends RuntimeException {}
