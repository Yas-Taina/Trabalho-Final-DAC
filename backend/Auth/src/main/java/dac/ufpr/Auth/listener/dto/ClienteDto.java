package dac.ufpr.Auth.listener.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDto {
    private Long id; // #
    private String cpf;
    private String email;
    private String senha;
    private String nome;
    private String telefone; //?
    private BigDecimal salario;
    private String endereco;
    private String CEP;
    private String cidade;
    private String estado;
    private String status; // #
    private String motivoRejeicao;
    private String cpf_gerente; // #
}
