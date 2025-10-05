package dac.ufpr.Auth.service;

import dac.ufpr.Auth.dto.auth.AuthRequestDto;
import dac.ufpr.Auth.dto.auth.AuthResponseDto;
import dac.ufpr.Auth.dto.user.UserRequestDto;
import dac.ufpr.Auth.dto.user.UserResponseDto;
import dac.ufpr.Auth.entity.Autenticacao;
import dac.ufpr.Auth.enums.EnRole;
import dac.ufpr.Auth.exception.custom.BadRequestException;
import dac.ufpr.Auth.exception.custom.InvalidCredentialsException;
import dac.ufpr.Auth.exception.custom.ResourceAlreadyExistsException;
import dac.ufpr.Auth.exception.custom.ResourceNotFoundException;
import dac.ufpr.Auth.repository.AuthRepository;
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
import java.util.regex.Pattern;

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

    @Transactional
    public UserResponseDto register(UserRequestDto userRequestDto) {

        validarUsuario(userRequestDto);

        Autenticacao autenticacao = new Autenticacao();
        autenticacao.setEmail(userRequestDto.email());
        autenticacao.setSenha(passwordEncoder.encode(userRequestDto.senha()));
        autenticacao.setRole(EnRole.findByName(userRequestDto.role()));
        autenticacao.setIdUsuario(userRequestDto.idUsuario());

        repository.save(autenticacao);

        return new UserResponseDto(autenticacao.getId(), autenticacao.getEmail());
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

        String token = jwtUtil.generateToken(
                autenticacao.getEmail(),
                autenticacao.getRole().name(),
                null
        );

        return new AuthResponseDto(
                token,
                BEARER,
                autenticacao.getRole().name(),
                new UserResponseDto(autenticacao.getId(), autenticacao.getEmail())
        );
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
                || !StringUtils.hasText(userRequestDto.senha())
                || Objects.isNull(userRequestDto.role())
                || Objects.isNull(EnRole.findByName(userRequestDto.role()))
                || Objects.isNull(userRequestDto.idUsuario());
    }

}
