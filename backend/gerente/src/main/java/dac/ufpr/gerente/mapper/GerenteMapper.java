package dac.ufpr.gerente.mapper;

import org.springframework.stereotype.Component;

import dac.ufpr.gerente.dto.GerenteDto;
import dac.ufpr.gerente.entity.Gerente;

@Component
public class GerenteMapper {
    public static Gerente toEntity(GerenteDto dto) {
        return new Gerente(
                dto.id(),
                dto.nome(),
                dto.cpf(),
                dto.email(),
                dto.senha(),
                dto.tipo());
    }

    public static GerenteDto toDto(Gerente entity) {
        return new GerenteDto(
                entity.getId(),
                entity.getNome(),
                entity.getCpf(),
                entity.getEmail(),
                entity.getSenha(),
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
        if (dto.senha() != null) {
            entity.setSenha(dto.senha());
        }
        if (dto.tipo() != null) {
            entity.setTipo(dto.tipo());
        }
    }
}
