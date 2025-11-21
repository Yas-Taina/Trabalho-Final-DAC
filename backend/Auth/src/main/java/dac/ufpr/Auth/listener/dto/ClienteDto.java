package dac.ufpr.Auth.listener.dto;

import java.math.BigDecimal;

public record ClienteDto(
  Long id, // #
  String cpf,
  String email,
  String nome, 
  String telefone, //?
  BigDecimal salario,
  String endereco,
  String cep,
  String cidade,
  String estado,
  String status, // #
  String motivoRejeicao,
  String cpf_gerente) { } // #
