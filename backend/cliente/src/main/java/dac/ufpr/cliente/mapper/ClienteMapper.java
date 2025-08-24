package dac.ufpr.cliente.mapper;

import dac.ufpr.cliente.dto.ClienteDto;
import dac.ufpr.cliente.entity.Cliente;
import org.springframework.context.annotation.Configuration;

@Configuration
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

}
