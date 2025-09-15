package dac.ufpr.conta.entity;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@Table(name="conta", schema="conta_cmd")
@AllArgsConstructor @NoArgsConstructor
@Getter @Setter
public class Conta {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroConta;

    private Long clienteId;   // mantém Long (não UUID)

    private Long gerenteId;

    private Instant dataCriacao;

    @Column(precision = 18, scale = 2)
    private BigDecimal saldo;

    @Column(precision = 18, scale = 2)
    private BigDecimal limite;

    private Long versao;
}
