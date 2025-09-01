package dac.ufpr.cliente.service;

import dac.ufpr.cliente.dto.ClienteDto;
import dac.ufpr.cliente.enums.EnClienteFiltro;
import dac.ufpr.cliente.exception.custom.BadRequestException;
import dac.ufpr.cliente.exception.custom.ResourceAlreadyExistsException;
import dac.ufpr.cliente.mapper.ClienteMapper;
import dac.ufpr.cliente.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Objects;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClienteService {

    private static final Logger log = LoggerFactory.getLogger(ClienteService.class);

    private static final Pattern CPF_PATTERN = Pattern.compile("\\d{11}");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final Pattern TELEFONE_PATTERN = Pattern.compile("\\d{10,11}");
    private static final Pattern CEP_PATTERN = Pattern.compile("\\d{8}");

    private ClienteRepository repository;

    public String listar(String filtro) {
        log.info("Listando clientes com filtro: {}", filtro);

        switch (EnClienteFiltro.findBy(filtro)) {
            case PARA_APROVAR:
                break;
            case ADM_RELATORIO_CLIENTES:
                break;
            case MELHORES_CLIENTES:
                break;
            default:
                return null;
        }



        return "Lista de clientes com filtro: " + filtro;
    }

    public void criar(ClienteDto clienteDto) {
        log.info("Criando cliente: {}", clienteDto);

        if (validarDados(clienteDto)) {
            throw new BadRequestException("Dados inválidos.");
        }

        if (repository.existsByCpf(clienteDto.cpf())) {
            throw new ResourceAlreadyExistsException("Cliente já existe ou aguardando aprovação.");
        }

        repository.save(ClienteMapper.toEntity(clienteDto));
        log.info("Cliente criado com sucesso: {}", clienteDto);
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
