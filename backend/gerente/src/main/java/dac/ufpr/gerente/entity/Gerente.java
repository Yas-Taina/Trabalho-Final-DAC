package dac.ufpr.gerente.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "gerente", schema = "gerente") // sem schema
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Gerente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String cpf;

    String nome;

    String email;

    String senha;

    String tipo;
}
