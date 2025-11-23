package dac.ufpr.Saga.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record ClienteDto(
        Long id, // #
        String cpf,
        String email,
        String senha,
        String nome,
        String telefone, //?
        BigDecimal salario,
        String endereco,
        @JsonProperty("CEP")
        String CEP,
        String cidade,
        String estado,
        String status, // #
        String motivoRejeicao,
        String cpf_gerente) { } // #
