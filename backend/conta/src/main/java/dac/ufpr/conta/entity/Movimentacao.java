package dac.ufpr.conta.entity; 
import java.math.BigDecimal; 
import java.time.Instant;

import dac.ufpr.conta.enums.enTipoMovimento;
import jakarta.persistence.*; 
import lombok.AllArgsConstructor; 
import lombok.Getter; 
import lombok.NoArgsConstructor; 
import lombok.Setter; 
@Entity 
@Table(name = "movimento", schema = "conta_cmd",
       indexes = {
           @Index(name = "idx_mov_conta_id", columnList = "conta_id"),
           @Index(name = "idx_mov_data", columnList = "data_hora")
       })
@NoArgsConstructor @AllArgsConstructor 
@Getter @Setter 
public class Movimentacao { 
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id; 
    
    @ManyToOne(fetch=FetchType.LAZY) 
    @JoinColumn(name = "conta_id", nullable = false,
        foreignKey = @ForeignKey(name = "fk_mov_conta"))
    private Conta conta; 
    
    private Instant dataHora; 
    
    @Enumerated(EnumType.STRING)
    private enTipoMovimento tipo; // DEPOSITO | SAQUE | TRANSFERENCIA 
    
    private String origemConta; 
    
    private String destinoConta; 
    
    @Column(precision = 18, scale = 2, nullable = false) 
    private BigDecimal valor; // <-- campo que o service usa }

}