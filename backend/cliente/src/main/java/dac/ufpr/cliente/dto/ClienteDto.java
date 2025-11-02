package dac.ufpr.cliente.dto;

import java.math.BigDecimal;

import dac.ufpr.cliente.enums.EnStatusCliente;

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
  EnStatusCliente status, // #
  String motivoRejeicao) { } // #
