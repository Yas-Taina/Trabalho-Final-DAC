package dac.ufpr.conta.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ClienteDto{
  Long id;
  String cpf;
  String email;
  String nome; 
  String telefone; //?
  BigDecimal salario;
  String endereco;
  String cep;
  String cidade;
  String estado;
  String status;
  String motivoRejeicao;
  String cpf_gerente;
}
