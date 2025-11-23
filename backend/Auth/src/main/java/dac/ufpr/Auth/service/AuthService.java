package dac.ufpr.Auth.service;

import dac.ufpr.Auth.dto.auth.AuthRequestDto;
import dac.ufpr.Auth.dto.auth.AuthResponseDto;
import dac.ufpr.Auth.dto.auth.LogoutResponseDto;
import dac.ufpr.Auth.dto.user.UserRequestDto;
import dac.ufpr.Auth.dto.user.UserResponseDto;
import dac.ufpr.Auth.entity.Autenticacao;
import dac.ufpr.Auth.enums.EnRole;
import dac.ufpr.Auth.exception.custom.BadRequestException;
import dac.ufpr.Auth.exception.custom.InvalidCredentialsException;
import dac.ufpr.Auth.exception.custom.ResourceAlreadyExistsException;
import dac.ufpr.Auth.exception.custom.ResourceNotFoundException;
import dac.ufpr.Auth.repository.AuthRepository;
import dac.ufpr.Auth.security.TokenService;
import dac.ufpr.Auth.security.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");


    private static final String BEARER = "bearer";

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final AuthRepository repository;
    private final JwtUtils jwtUtil;
    private final TokenService tokenService;

    @Transactional
    public UserResponseDto register(UserRequestDto userRequestDto) {

        validarUsuario(userRequestDto);

        Autenticacao autenticacao = new Autenticacao();
        autenticacao.setEmail(userRequestDto.email());
        autenticacao.setCpf(userRequestDto.cpf());
        autenticacao.setRole(EnRole.findByName(userRequestDto.role()));

        repository.save(autenticacao);

        return new UserResponseDto(autenticacao.getCpf(), autenticacao.getEmail());
    }

    public AuthResponseDto login(AuthRequestDto request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.senha())
            );
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Usuário/Senha incorretos");
        }

        Autenticacao autenticacao = repository.findByEmail(request.email()).orElseThrow(() -> new ResourceNotFoundException("Usuário"));
        log.info("Autenticacao encontrada: email={}, cpf={}", autenticacao.getEmail(), autenticacao.getCpf());

        Map<String, Object> customClaims = Map.of(
                "cpf", autenticacao.getCpf()
        );

        String token = jwtUtil.generateToken(
                autenticacao.getEmail(),
                autenticacao.getRole().name(),
                customClaims
        );

        return new AuthResponseDto(
                token,
                BEARER,
                autenticacao.getRole().name(),
                new UserResponseDto(autenticacao.getCpf(), autenticacao.getEmail())
        );
    }

    public LogoutResponseDto logout(String authorizationHeader) {
        String token = authorizationHeader.replaceAll("(?i)^bearer\\s+", "");
        
        String email = tokenService.extractEmail(token);
        Autenticacao autenticacao = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        
        tokenService.invalidateToken(token);
        
        return new LogoutResponseDto(
                autenticacao.getCpf(),
                "",
                autenticacao.getEmail(),
                autenticacao.getRole().name()
        );
    }

    public boolean isTokenValid(String token) {
        try {
            if (tokenService.isTokenRevoked(token)) {
                return false;
            }
            jwtUtil.validateToken(token);
            return true;
        } catch (Exception e) {
            log.error("Validação do token falhou: {}", e.getMessage());
            return false;
        }
    }

    public String atualizarUsuarioComSenha(String email) {
        Autenticacao autenticacao = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário"));

        String novaSenha = gerarSenhaAleatoria();
        autenticacao.setSenha(passwordEncoder.encode(novaSenha));
        repository.save(autenticacao);

        return novaSenha;
    }

    public void apagarSenha(String email) {
        Autenticacao autenticacao = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário"));

        autenticacao.setSenha(null);
        repository.save(autenticacao);
    }

    private String gerarSenhaAleatoria() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    private void validarUsuario(UserRequestDto userRequestDto) {
        if (validarDados(userRequestDto)) {
            throw new BadRequestException("Dados inválidos.");
        }

        if (repository.findByEmail(userRequestDto.email()).isPresent()) {
            throw new ResourceAlreadyExistsException("Email já cadastrado");
        }
    }

    private boolean validarDados(UserRequestDto userRequestDto) {
        return !StringUtils.hasText(userRequestDto.email())
                || !EMAIL_PATTERN.matcher(userRequestDto.email()).matches()
                //|| !StringUtils.hasText(userRequestDto.senha())
                || Objects.isNull(userRequestDto.role())
                || Objects.isNull(EnRole.findByName(userRequestDto.role()))
                || Objects.isNull(userRequestDto.cpf());
    }

    @Transactional
    public void reboot() {
        final String SENHA = "tads";
        
        // Limpa todos os registros do MongoDB
        repository.deleteAll();
        
        // Reinicializa com dados padrão
        // CLIENTES (CPFs exigidos pelo testador)
        upsert("cli1@bantads.com.br", "12912861012", EnRole.CLIENTE, SENHA);
        upsert("cli2@bantads.com.br", "09506382000", EnRole.CLIENTE, SENHA);
        upsert("cli3@bantads.com.br", "85733854057", EnRole.CLIENTE, SENHA);
        upsert("cli4@bantads.com.br", "58872160006", EnRole.CLIENTE, SENHA);
        upsert("cli5@bantads.com.br", "76179646090", EnRole.CLIENTE, SENHA);

        // GERENTES
        upsert("ger1@bantads.com.br", "98574307084", EnRole.GERENTE, SENHA);
        upsert("ger2@bantads.com.br", "64065268052", EnRole.GERENTE, SENHA);
        upsert("ger3@bantads.com.br", "23862179060", EnRole.GERENTE, SENHA);

        // ADMIN
        upsert("adm1@bantads.com.br", "40501740066", EnRole.ADMINISTRADOR, SENHA);
    }

    private void upsert(String email, String cpf, EnRole role, String senha) {
        repository.findByEmail(email).ifPresentOrElse(u -> {
            u.setCpf(cpf);
            u.setRole(role);
            u.setSenha(passwordEncoder.encode(senha));
            repository.save(u);
        }, () -> {
            Autenticacao novo = new Autenticacao();
            novo.setEmail(email);
            novo.setSenha(passwordEncoder.encode(senha));
            novo.setRole(role);
            novo.setCpf(cpf);
            repository.save(novo);
        });
    }

}
