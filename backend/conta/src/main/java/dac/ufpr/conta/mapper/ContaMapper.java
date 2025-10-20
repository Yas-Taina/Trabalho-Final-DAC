package dac.ufpr.conta.mapper;

import dac.ufpr.conta.dto.ContaDto;
import dac.ufpr.conta.entity.Conta;
import org.springframework.stereotype.Component;

@Component
public class ContaMapper {

    public static ContaDto toDto(Conta entity) {
        return new ContaDto(
                entity.getId(),
                entity.getNumeroConta(),
                entity.getClienteId(),
                entity.getGerenteId(),
                entity.getDataCriacao(),
                entity.getDataAtualizacao(),
                entity.getSaldo(),
                entity.getLimite(),
                entity.getVersao()
        );
    }
}
