package dac.ufpr.gerente.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import dac.ufpr.gerente.dto.GerenteDto;
import dac.ufpr.gerente.exception.custom.ResourceAlreadyExistsException;
import dac.ufpr.gerente.mapper.GerenteMapper;
import dac.ufpr.gerente.repository.GerenteRepository;

import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class GerenteService {

    private static final Pattern CPF_PATTERN = Pattern.compile("\\d{11}");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    // Torne final para o Lombok gerar o construtor e o Spring injetar
    private final GerenteRepository repository;

    public void criar(GerenteDto gerenteDto) {
        log.info("Criando gerente: {}", gerenteDto);

        if (dadosInvalidos(gerenteDto)) {
            // Evite usar org.apache.coyote.BadRequestException
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados inválidos");
        }

        if (repository.existsByCpf(gerenteDto.cpf())) {
            throw new ResourceAlreadyExistsException();
        }

        repository.save(GerenteMapper.toEntity(gerenteDto));
        log.info("Gerente criado com sucesso: {}", gerenteDto);
    }

    private boolean dadosInvalidos(GerenteDto dto) {
        return !StringUtils.hasText(dto.nome())
                || !CPF_PATTERN.matcher(dto.cpf()).matches()
                || !EMAIL_PATTERN.matcher(dto.email()).matches()
                || !StringUtils.hasText(dto.senha())
                || !StringUtils.hasText(dto.tipo());
    }
}
