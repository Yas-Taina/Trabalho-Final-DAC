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
                .filter(gerente -> !gerente.getTipo().equalsIgnoreCase("administrador"))
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
        validarGerente(gerentedto, "");

        Gerente gerente = repository.save(GerenteMapper.toEntity(gerentedto));
        log.info("Gerente criado com sucesso: {}", gerente);
        return GerenteMapper.toDto(gerente);
    }

    // @Transactional
    // public GerenteDto atualizar(String cpf, GerenteDto gerentedto) {
    // log.info("Atualizando gerente com CPF :{}. Dados do cliente:{}", cpf,
    // gerentedto);

    // Gerente gerenteExistente = repository.findByCpf(cpf)
    // .orElseThrow(() -> new ResourceNotFoundException("Gerente"));

    // validarGerente(gerentedto, -1L);

    // gerenteExistente.setNome(gerentedto.nome());
    // gerenteExistente.setEmail(gerentedto.email());
    // gerenteExistente.setSenha(gerentedto.senha());
    // gerenteExistente.setTipo(gerentedto.tipo());
    // repository.save(gerenteExistente);
    // Gerente gerenteAtualizado = repository.save(gerenteExistente);
    // log.info("Gerente atualizado com sucesso: {}", gerenteAtualizado);

    // return GerenteMapper.toDto(gerenteAtualizado);

    // }

    @Transactional
    public GerenteDto atualizar(String cpf, GerenteDto gerentedto) {
        log.info("Atualizando gerente com CPF :{}. Dados do cliente:{}", cpf, gerentedto);

        Gerente gerenteExistente = repository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Gerente"));

        // Valida apenas se os dados são coerentes, mas não bloqueia por CPF

        validarGerente(gerentedto, gerenteExistente.getCpf());

        // Atualiza somente campos presentes (não nulos) no DTO
        if (gerentedto.nome() != null) {
            gerenteExistente.setNome(gerentedto.nome());
        }
        if (gerentedto.email() != null) {
            gerenteExistente.setEmail(gerentedto.email());
        }
        if (gerentedto.tipo() != null) {
            gerenteExistente.setTipo(gerentedto.tipo());
        }

        Gerente gerenteAtualizado = repository.save(gerenteExistente);
        log.info("Gerente atualizado com sucesso: {}", gerenteAtualizado);

        return GerenteMapper.toDto(gerenteAtualizado);
    }

    @Transactional
    public GerenteDto remover(String cpf) {
        Gerente gerente = repository.findByCpf(cpf)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Gerente não encontrado: " + cpf));
        
        repository.deleteByCpf(cpf);
        return GerenteMapper.toDto(gerente);
    }

    // private void validarGerente(GerenteDto gerenteDto, long id) {
    // System.out.println(gerenteDto);
    // System.out.println(validarDados(gerenteDto));
    // if (validarDados(gerenteDto)) {
    // throw new BadRequestException("Dados inválidos.");
    // }

    // System.out.println("existe pelo cpf: " +
    // repository.existsByCpf(gerenteDto.cpf()));
    // System.out.println(repository.existsByCpf(gerenteDto.cpf()));
    // if (repository.existsByCpf(gerenteDto.cpf())) {
    // throw new ResourceAlreadyExistsException("Cliente já existe ou aguardando
    // aprovação.");
    // //quero o log da ess=xceção
    // }
    // }

    private void validarGerente(GerenteDto gerenteDto, String cpf) {
        // cpf vazio ou nulo indica criação; caso contrário é atualização
        boolean isCreate = (cpf == null || cpf.isEmpty());

        if (isCreate) {
            // Para criação, exige todos os campos válidos
            if (validarDados(gerenteDto, true)) {
                throw new BadRequestException("Dados inválidos.");
            }

            if (repository.existsByCpf(gerenteDto.cpf())) {
                log.warn("Tentativa de criar gerente com CPF já existente: {}", gerenteDto.cpf());
                throw new ResourceAlreadyExistsException("Cliente já existe ou aguardando aprovação.");
            }
        } else {
            // Para atualização, valida apenas campos presentes no DTO (não nulos)
            if (validarDados(gerenteDto, false)) {
                throw new BadRequestException("Dados inválidos para atualização.");
            }
        }
    }

    private boolean validarDados(GerenteDto dto, boolean requireAll) {
        if (requireAll) {
            return !StringUtils.hasText(dto.nome())
                    || !StringUtils.hasText(dto.tipo())
                    || !StringUtils.hasText(dto.cpf())
                    || !StringUtils.hasText(dto.email())
                    || !CPF_PATTERN.matcher(dto.cpf()).matches()
                    || !EMAIL_PATTERN.matcher(dto.email()).matches();
        } else {
            // Atualização parcial: apenas campos fornecidos são validados
            if (dto.nome() != null && !StringUtils.hasText(dto.nome())) {
                return true;
            }
            if (dto.tipo() != null && !StringUtils.hasText(dto.tipo())) {
                return true;
            }
            if (dto.cpf() != null) {
                if (!StringUtils.hasText(dto.cpf()) || !CPF_PATTERN.matcher(dto.cpf()).matches()) {
                    return true;
                }
            }
            if (dto.email() != null) {
                if (!StringUtils.hasText(dto.email()) || !EMAIL_PATTERN.matcher(dto.email()).matches()) {
                    return true;
                }
            }
            return false;
        }
    }

}
