package dac.ufpr.conta.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record MovimentacaoDto(
        Long id,
        Instant dataHora,
        String tipo,
        String origemConta,
        String destinoConta,
        BigDecimal valor
) {}
