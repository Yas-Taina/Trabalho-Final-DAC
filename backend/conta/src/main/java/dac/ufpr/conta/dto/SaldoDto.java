// package dac.ufpr.conta.dto;
package dac.ufpr.conta.dto;

import java.math.BigDecimal;

public record SaldoDto(String cliente, String conta, BigDecimal saldo) {}
