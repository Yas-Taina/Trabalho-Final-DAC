package dac.ufpr.Saga.dto;

public record GerenteDto(
        String cpf,
        String nome,
        String email,
        String senha,
        String tipo
) {}
