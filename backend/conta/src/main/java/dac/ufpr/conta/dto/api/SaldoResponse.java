package dac.ufpr.conta.dto.api;

import java.math.BigDecimal;

public record SaldoResponse(String cliente, String conta, BigDecimal saldo) { }
