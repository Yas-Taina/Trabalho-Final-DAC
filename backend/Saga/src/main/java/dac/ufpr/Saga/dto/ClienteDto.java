package dac.ufpr.Saga.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDto {
        private Long id;
        private String cpf;
        private String email;
        private String senha;
        private String nome;
        private String telefone;
        private BigDecimal salario;
        private String endereco;
        @JsonProperty("CEP")
        private String CEP;
        private String cidade;
        private String estado;
        private String status;
        private String motivoRejeicao;
        private String cpf_gerente;

}
