package dac.ufpr.conta.dto.api;

import java.math.BigDecimal;

public record TransferenciaRequest(String destino, BigDecimal valor) { }
