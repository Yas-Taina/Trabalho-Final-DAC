package dac.ufpr.cliente.mapper;

import dac.ufpr.cliente.dto.ClienteDto;
import dac.ufpr.cliente.entity.Cliente;
import dac.ufpr.cliente.enums.EnStatusCliente;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

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
                dto.cep(),
                dto.cidade(),
                dto.estado(),
                EnStatusCliente.PENDENTE,
                null,
                LocalDateTime.now(),
                -1L
        );
    }

    public static ClienteDto toDto(Cliente entity) {
        return new ClienteDto(
                entity.getId(),
                entity.getCpf(),
                entity.getEmail(),
                entity.getNome(),
                entity.getTelefone(),
                entity.getSalario(),
                entity.getEndereco(),
                entity.getCep(),
                entity.getCidade(),
                entity.getEstado(),
                entity.getStatus(),
                entity.getMotivoRejeicao()
        );
    }

    public static void updateEntityFromDto(ClienteDto dto, Cliente entity) {
        entity.setNome(dto.nome());
        entity.setEmail(dto.email());
        entity.setCpf(dto.cpf());
        entity.setTelefone(dto.telefone());
        entity.setSalario(dto.salario());
        entity.setEndereco(dto.endereco());
        entity.setCep(dto.cep());
        entity.setCidade(dto.cidade());
        entity.setEstado(dto.estado());
    }

}
