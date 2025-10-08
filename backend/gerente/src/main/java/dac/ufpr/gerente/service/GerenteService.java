package dac.ufpr.gerente.service;

import dac.ufpr.gerente.dto.GerenteDto;
import dac.ufpr.gerente.exception.custom.BadRequestException;
import dac.ufpr.gerente.exception.custom.ResourceAlreadyExistsException;
import dac.ufpr.gerente.exception.custom.ResourceNotFoundException;
import dac.ufpr.gerente.mapper.GerenteMapper;
import dac.ufpr.gerente.entity.Gerente;
import dac.ufpr.gerente.repository.GerenteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class GerenteService {

    private static final Pattern CPF_PATTERN = Pattern.compile("\\d{11}");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private final GerenteRepository repository;

    public List<GerenteDto> listar() {
        return repository.findAll().stream()
                .map(GerenteMapper::toDto)
                .toList();
    }

    public GerenteDto buscarPorCpf(String cpf) {
        return repository.findByCpf(cpf)
                .map(GerenteMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Gerente"));
    }

    @Transactional
    public GerenteDto criar(GerenteDto gerentedto) {
        log.info("Criando gerente: {}", gerentedto);
        validarGerente(gerentedto, -1L);

        Gerente gerente = repository.save(GerenteMapper.toEntity(gerentedto));
        log.info("Gerente criado com sucesso: {}", gerente);
        return GerenteMapper.toDto(gerente);
    }

    @Transactional
    public GerenteDto atualizar(String cpf, GerenteDto gerentedto) {
        log.info("Atualizando gerente com CPF :{}. Dados do cliente:{}", cpf, gerentedto);

        Gerente gerenteExistente = repository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Gerente"));

        validarGerente(gerentedto, -1L);

        Gerente gerenteAtualizado = repository.save(gerenteExistente);
        log.info("Gerente atualizado com sucesso: {}", gerenteAtualizado);

        return GerenteMapper.toDto(gerenteAtualizado);

    }

    @Transactional
    public void remover(String cpf) {
        if (!repository.existsByCpf(cpf)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Gerente não encontrado: " + cpf);
        }
        repository.deleteByCpf(cpf);
    }

    private void validarGerente(GerenteDto gerenteDto, long id) {
        if (validarDados(gerenteDto)) {
            throw new BadRequestException("Dados inválidos.");
        }

        if (repository.existsByCpf(gerenteDto.cpf())) {
            throw new ResourceAlreadyExistsException("Cliente já existe ou aguardando aprovação.");
        }
    }

    private boolean validarDados(GerenteDto dto) {
        return !StringUtils.hasText(dto.nome())
                || !StringUtils.hasText(dto.senha())
                || !StringUtils.hasText(dto.tipo())
                || !StringUtils.hasText(dto.cpf())
                || !StringUtils.hasText(dto.email())
                || !CPF_PATTERN.matcher(dto.cpf()).matches()
                || !EMAIL_PATTERN.matcher(dto.email()).matches();
    }

}
