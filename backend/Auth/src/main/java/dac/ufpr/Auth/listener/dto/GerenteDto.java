package dac.ufpr.Auth.listener.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GerenteDto {
    private String cpf;
    private String nome;
    private String email;
    private String senha;
    private String tipo;
}
