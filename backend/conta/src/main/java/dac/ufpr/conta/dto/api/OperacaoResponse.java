package dac.ufpr.conta.dto.api;

import java.math.BigDecimal;
import java.time.Instant;

public record OperacaoResponse(String conta, Instant data, BigDecimal saldo) { }
