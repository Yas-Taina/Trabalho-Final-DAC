package dac.ufpr.gerente.service;

import dac.ufpr.gerente.dto.GerenteDto;
import dac.ufpr.gerente.mapper.GerenteMapper;
import dac.ufpr.gerente.model.Gerente;
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
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private final GerenteRepository repository;

    public List<GerenteDto> listar() {
        return repository.findAll().stream().map(GerenteMapper::toDto).toList();
    }

    public GerenteDto buscarPorCpf(String cpf) {
        Gerente g = repository.findByCpf(cpf)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Gerente não encontrado: " + cpf));
        return GerenteMapper.toDto(g);
    }

    @Transactional
    public GerenteDto criar(GerenteDto dto) {
        validar(dto);

        if (repository.existsByCpf(dto.cpf())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe um gerente com o CPF " + dto.cpf());
        }
        if (repository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe um gerente com o e-mail " + dto.email());
        }

        Gerente salvo = repository.save(GerenteMapper.toEntity(dto));
        return GerenteMapper.toDto(salvo);
    }

    @Transactional
    public GerenteDto atualizar(String cpf, GerenteDto dto) {
        validar(dto);

        Gerente g = repository.findByCpf(cpf)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Gerente não encontrado: " + cpf));

        // se for trocar email, garanta unicidade
        if (!g.getEmail().equals(dto.email()) && repository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe um gerente com o e-mail " + dto.email());
        }

        g.setNome(dto.nome());
        g.setEmail(dto.email());
        g.setSenha(dto.senha());
        g.setTipo(dto.tipo());

        // como está dentro de @Transactional, o flush acontece automático
        return GerenteMapper.toDto(g);
    }

    @Transactional
    public void remover(String cpf) {
        // opcionalmente busque primeiro para retornar 404 correto
        if (!repository.existsByCpf(cpf)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Gerente não encontrado: " + cpf);
        }
        repository.deleteByCpf(cpf);
    }

    // --- validação simples ---
    private void validar(GerenteDto dto) {
        if (!StringUtils.hasText(dto.nome())
                || !StringUtils.hasText(dto.senha())
                || !StringUtils.hasText(dto.tipo())
                || !StringUtils.hasText(dto.cpf())
                || !StringUtils.hasText(dto.email())
                || !CPF_PATTERN.matcher(dto.cpf()).matches()
                || !EMAIL_PATTERN.matcher(dto.email()).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados inválidos");
        }
    }
}
