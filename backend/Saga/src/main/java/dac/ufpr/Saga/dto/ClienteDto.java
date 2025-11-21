package dac.ufpr.Saga.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

import java.math.BigDecimal;

public record ClienteDto(
        Long id, // #
        String cpf,
        String email,
        String nome,
        String telefone, //?
        BigDecimal salario,
        String endereco,
        @JsonAlias({"CEP", "cep"})
        String cep,
        String cidade,
        String estado,
        String status, // #
        String motivoRejeicao,
        String cpf_gerente) { } // #
