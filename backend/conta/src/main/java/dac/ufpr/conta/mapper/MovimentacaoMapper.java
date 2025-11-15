package dac.ufpr.conta.mapper;

import dac.ufpr.conta.dto.MovimentacaoDto;
import dac.ufpr.conta.entity.Movimentacao;
import org.springframework.stereotype.Component;

@Component
public class MovimentacaoMapper {

    public static MovimentacaoDto toDto(Movimentacao m) {
        return new MovimentacaoDto(
                m.getId(),
                m.getDataHora(),
                m.getTipo() == null ? null : m.getTipo().name(),
                m.getOrigemConta(),
                m.getDestinoConta(),
                m.getValor()
        );
    }
}
