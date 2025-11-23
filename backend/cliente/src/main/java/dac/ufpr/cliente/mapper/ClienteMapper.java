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
                dto.CEP(),
                dto.cidade(),
                dto.estado(),
                EnStatusCliente.PENDENTE,
                null,
                LocalDateTime.now(),
                dto.cpf_gerente()
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
                entity.getCEP(),
                entity.getCidade(),
                entity.getEstado(),
                entity.getStatus(),
                entity.getMotivoRejeicao(),
                entity.getCpf_gerente()
        );
    }

    public static void updateEntityFromDto(ClienteDto dto, Cliente entity) {
        if (dto.nome() != null) {
            entity.setNome(dto.nome());
        }
        if (dto.email() != null) {
            entity.setEmail(dto.email());
        }
        // Somente atualiza CPF se enviado no payload
        if (dto.cpf() != null) {
            entity.setCpf(dto.cpf());
        }
        // Somente atualiza telefone se enviado no payload
        if (dto.telefone() != null) {
            entity.setTelefone(dto.telefone());
        }
        if (dto.salario() != null) {
            entity.setSalario(dto.salario());
        }
        if (dto.endereco() != null) {
            entity.setEndereco(dto.endereco());
        }
        if (dto.CEP() != null) {
            entity.setCEP(dto.CEP());
        }
        if (dto.cidade() != null) {
            entity.setCidade(dto.cidade());
        }
        if (dto.estado() != null) {
            entity.setEstado(dto.estado());
        }
    }

}
