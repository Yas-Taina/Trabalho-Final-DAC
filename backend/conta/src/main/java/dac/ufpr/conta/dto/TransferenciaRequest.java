package dac.ufpr.conta.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class TransferenciaRequest {
    @NotNull
    private String destino;

    @NotNull
    private BigDecimal valor;

    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
}
