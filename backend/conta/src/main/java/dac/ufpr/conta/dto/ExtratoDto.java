package dac.ufpr.conta.dto;

import java.math.BigDecimal;
import java.util.List;

public record ExtratoDto(
        String conta,
        BigDecimal saldo,
        List<ExtratoMovimentacaoDto> movimentacoes
) {}
