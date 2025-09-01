package dac.ufpr.gerente.model;

import jakarta.persistence.*;         // JPA (Jakarta Persistence)
import lombok.AllArgsConstructor;     // Lombok
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "gerente")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Gerente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cpf;
    private String nome;
    private String email;
    private String senha;
    private String tipo;
}
