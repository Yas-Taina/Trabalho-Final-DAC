package dac.ufpr.cliente.entity;

import dac.ufpr.cliente.enums.EnStatusCliente;
import dac.ufpr.cliente.enums.EnStatusIntegracao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name = "cliente", schema = "cliente")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String nome;

    String cpf;

    String email;

    String telefone;

    BigDecimal salario;

    String endereco;

    String CEP;

    String cidade;

    String estado;

    @Enumerated(EnumType.STRING)
    EnStatusCliente status;

    String motivoRejeicao;

    LocalDateTime data_alteracao;

    long gerente_id;

}
