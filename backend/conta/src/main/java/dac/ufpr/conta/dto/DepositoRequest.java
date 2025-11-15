package dac.ufpr.conta.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class DepositoRequest {
    @NotNull
    private BigDecimal valor;

    public DepositoRequest() {}

    public DepositoRequest(BigDecimal valor) {
        this.valor = valor;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}
