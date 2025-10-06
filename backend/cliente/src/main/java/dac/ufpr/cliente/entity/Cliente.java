package dac.ufpr.cliente.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.processing.Pattern;

import java.math.BigDecimal;


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
}
