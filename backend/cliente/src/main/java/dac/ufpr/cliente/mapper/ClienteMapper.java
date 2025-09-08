package dac.ufpr.cliente.mapper;

import dac.ufpr.cliente.dto.ClienteDto;
import dac.ufpr.cliente.entity.Cliente;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public static Cliente toEntity(ClienteDto dto) {
        return new Cliente(
                dto.id(),
                dto.nome(),
                dto.cpf(),
                dto.email(),
                dto.telefone(),
                dto.salario(),
                dto.endereco(),
                dto.CEP(),
                dto.cidade(),
                dto.estado()
        );
    }

    public static ClienteDto toDto(Cliente entity) {
        return new ClienteDto(
                entity.getId(),
                entity.getNome(),
                entity.getCpf(),
                entity.getEmail(),
                entity.getTelefone(),
                entity.getSalario(),
                entity.getEndereco(),
                entity.getCEP(),
                entity.getCidade(),
                entity.getEstado()
        );
    }

    public static void updateEntityFromDto(ClienteDto dto, Cliente entity) {
        entity.setNome(dto.nome());
        entity.setEmail(dto.email());
        entity.setCpf(dto.cpf());
        entity.setTelefone(dto.telefone());
        entity.setSalario(dto.salario());
        entity.setEndereco(dto.endereco());
        entity.setCEP(dto.CEP());
        entity.setCidade(dto.cidade());
        entity.setEstado(dto.estado());
    }

}
