package dac.ufpr.Auth.dto.user;

public record UserRequestDto(String id, String cpf, String email, String senha, String role) {
}
