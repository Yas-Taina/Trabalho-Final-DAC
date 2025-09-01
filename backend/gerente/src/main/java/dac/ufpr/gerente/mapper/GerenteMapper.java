package dac.ufpr.gerente.mapper;

import dac.ufpr.gerente.dto.GerenteDto;
import dac.ufpr.gerente.model.Gerente;

public class GerenteMapper {
    public static Gerente toEntity(GerenteDto dto) {
        return new Gerente(
                dto.id(),
                dto.cpf(),
                dto.nome(),
                dto.email(),
                dto.senha(),
                dto.tipo()
        );
    }

    public static GerenteDto toDto(Gerente entity) {
        return new GerenteDto(
                entity.getId(),
                entity.getCpf(),
                entity.getNome(),
                entity.getEmail(),
                entity.getSenha(),
                entity.getTipo()
        );
    }
}
