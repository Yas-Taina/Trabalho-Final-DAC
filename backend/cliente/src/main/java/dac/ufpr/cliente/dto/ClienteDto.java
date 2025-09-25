package dac.ufpr.cliente.dto;

import java.math.BigDecimal;

public record ClienteDto(
    Long id, 
    String cpf, 
    String email, 
    String nome, 
    String telefone, 
    BigDecimal salario,
    String endereco, 
    String CEP, 
    String cidade, 
    String estado
) {
}
