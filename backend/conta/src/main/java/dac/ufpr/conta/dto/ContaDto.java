package dac.ufpr.conta.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record ContaDto(Long id, String numeroConta, Long clienteId, Long gerenteId, Instant dataCriacao,
                       Instant dataAtualizacao, BigDecimal saldo, BigDecimal limite, Long versao) {
}
