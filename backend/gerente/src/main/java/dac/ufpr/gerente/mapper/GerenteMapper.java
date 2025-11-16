package dac.ufpr.gerente.mapper;

import dac.ufpr.gerente.dto.GerenteDto;
import dac.ufpr.gerente.entity.Gerente;

public class GerenteMapper {
    public static Gerente toEntity(GerenteDto dto) {
        return new Gerente(
                // dto.id(),
                dto.cpf(),
                dto.nome(),
                dto.email(),
                dto.tipo()
        );
    }

    public static GerenteDto toDto(Gerente entity) {
        return new GerenteDto(
                // entity.getId(),
                entity.getCpf(),
                entity.getNome(),
                entity.getEmail(),
                entity.getTipo()
        );
    }

    public static void updateEntityFromDto(GerenteDto dto, Gerente entity) {
        if (dto.nome() != null) {
            entity.setNome(dto.nome());
        }
        if (dto.cpf() != null) {
            entity.setCpf(dto.cpf());
        }
        if (dto.email() != null) {
            entity.setEmail(dto.email());
        }
        if (dto.tipo() != null) {
            entity.setTipo(dto.tipo());
        }
    }
}
