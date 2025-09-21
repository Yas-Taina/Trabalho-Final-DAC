package dac.ufpr.conta.entity;

import java.math.BigDecimal;
import java.time.Instant;

import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "conta",
    schema = "conta_cmd",
    uniqueConstraints = @UniqueConstraint(name = "uk_conta_numero", columnNames = "numero_conta"),
    indexes = {
        @Index(name = "idx_conta_numero", columnList = "numero_conta")
    }
)
@AllArgsConstructor @NoArgsConstructor
@Getter @Setter
public class Conta {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroConta;

    private Long clienteId;   // mantém Long (não UUID)

    private Long gerenteId;

    private Instant dataCriacao;

    @UpdateTimestamp
    private Instant dataAtualizacao;

    @Column(precision = 18, scale = 2)
    private BigDecimal saldo;

    @Column(precision = 18, scale = 2)
    private BigDecimal limite;

    private Long versao;
}
