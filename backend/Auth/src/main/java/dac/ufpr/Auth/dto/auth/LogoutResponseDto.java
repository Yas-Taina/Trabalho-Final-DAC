package dac.ufpr.Auth.dto.auth;

public record LogoutResponseDto(
        String cpf,
        String nome,
        String email,
        String tipo
) {}
