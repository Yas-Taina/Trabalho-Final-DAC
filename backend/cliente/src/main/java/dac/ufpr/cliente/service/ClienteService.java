package dac.ufpr.cliente.service;

import dac.ufpr.cliente.dto.ClienteDto;
import dac.ufpr.cliente.entity.Cliente;
import dac.ufpr.cliente.exception.custom.BadRequestException;
import dac.ufpr.cliente.exception.custom.ResourceAlreadyExistsException;
import dac.ufpr.cliente.exception.custom.ResourceNotFoundException;
import dac.ufpr.cliente.mapper.ClienteMapper;
import dac.ufpr.cliente.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private static final Logger log = LoggerFactory.getLogger(ClienteService.class);

    private static final Pattern CPF_PATTERN = Pattern.compile("\\d{11}");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final Pattern TELEFONE_PATTERN = Pattern.compile("\\d{10,11}");
    private static final Pattern CEP_PATTERN = Pattern.compile("\\d{8}");

    private ClienteRepository repository;

    public List<ClienteDto> listar() {
        return repository.findAll().stream()
                .map(ClienteMapper::toDto)
                .toList();
    }

    public ClienteDto consultarPorCpf(String cpf) {
        return repository.findByCpf(cpf)
                .map(ClienteMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário"));
    }

    public ClienteDto criar(ClienteDto clienteDto) {
        log.info("Criando cliente: {}", clienteDto);

        validarCliente(clienteDto, -1L);

        Cliente cliente = repository.save(ClienteMapper.toEntity(clienteDto));
        log.info("Cliente criado com sucesso: {}", cliente);

        return ClienteMapper.toDto(cliente);
    }

    public ClienteDto atualizar(String cpf, ClienteDto clienteDto) {
        log.info("Atualizando cliente com cpf: {}. Dados do cliente: {}", cpf, clienteDto);

        Cliente clienteExistente = repository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário"));

        validarCliente(clienteDto, clienteExistente.getId());

        ClienteMapper.updateEntityFromDto(clienteDto, clienteExistente);

        Cliente clienteAtualizado = repository.save(clienteExistente);
        log.info("Cliente atualizado com sucesso: {}", clienteAtualizado);

        return ClienteMapper.toDto(clienteAtualizado);
    }

    private void validarCliente(ClienteDto clienteDto, long id) {
        if (validarDados(clienteDto)) {
            throw new BadRequestException("Dados inválidos.");
        }

        if (repository.existsByCpfAndIdNot(clienteDto.cpf(), id)) {
            throw new ResourceAlreadyExistsException("Cliente já existe ou aguardando aprovação.");
        }
    }

    private boolean validarDados(ClienteDto clienteDto) {
        return !StringUtils.hasText(clienteDto.nome())
                || !CPF_PATTERN.matcher(clienteDto.cpf()).matches()
                || !EMAIL_PATTERN.matcher(clienteDto.email()).matches()
                || !TELEFONE_PATTERN.matcher(clienteDto.telefone()).matches()
                || Objects.isNull(clienteDto.salario())
                || !StringUtils.hasText(clienteDto.endereco())
                || !CEP_PATTERN.matcher(clienteDto.CEP()).matches()
                || !StringUtils.hasText(clienteDto.cidade())
                || Objects.isNull(clienteDto.estado());
    }

}
