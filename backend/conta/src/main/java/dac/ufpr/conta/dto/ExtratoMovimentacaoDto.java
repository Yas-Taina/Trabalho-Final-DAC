package dac.ufpr.conta.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record ExtratoMovimentacaoDto(
        Instant data,
        String tipo,
        String origem,
        String destino,
        BigDecimal valor
) {}
