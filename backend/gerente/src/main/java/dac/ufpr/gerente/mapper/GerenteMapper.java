package dac.ufpr.gerente.mapper;

import dac.ufpr.gerente.dto.GerenteDto;
import dac.ufpr.gerente.entity.Gerente;

public class GerenteMapper {
    public static Gerente toEntity(GerenteDto dto) {
        return new Gerente(
                dto.cpf(),
                dto.nome(),
                dto.email(),
                dto.tipo()
        );
    }

    public static GerenteDto toDto(Gerente entity) {
        return new GerenteDto(
                entity.getCpf(),
                entity.getNome(),
                entity.getEmail(),
                null,
                entity.getTipo()
        );
    }
}
