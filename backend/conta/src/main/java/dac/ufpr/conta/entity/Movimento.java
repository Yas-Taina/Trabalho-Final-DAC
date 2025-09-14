package dac.ufpr.conta.entity; 
import java.math.BigDecimal; 
import java.time.Instant; 
import jakarta.persistence.*; 
import lombok.AllArgsConstructor; 
import lombok.Getter; 
import lombok.NoArgsConstructor; 
import lombok.Setter; 
@Entity 
@Table(name="movimento", schema="conta_cmd") 
@NoArgsConstructor 
@AllArgsConstructor 
@Getter 
@Setter public class Movimento { 
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id; 
    @ManyToOne(fetch=FetchType.LAZY) 
    @JoinColumn(name="conta_id", nullable=false) 
    private Conta conta; private Instant dataHora; 
    private String tipo; // DEPOSITO | SAQUE | TRANSFERENCIA 
    private String origemConta; 
    private String destinoConta; 
    @Column(precision = 18, scale = 2, nullable = false) 
    private BigDecimal valor; // <-- campo que o service usa }

}