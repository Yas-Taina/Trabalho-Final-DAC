package dac.ufpr.cliente.exception.custom;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST) // 400
public class BadRequestException extends RuntimeException{}
