package dac.ufpr.conta.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
  @JsonProperty("CEP")
  String CEP;
  String cidade;
  String estado;
  String status;
  String motivoRejeicao;
  String cpf_gerente;
}
