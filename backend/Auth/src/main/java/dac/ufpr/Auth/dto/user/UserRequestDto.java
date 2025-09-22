package dac.ufpr.Auth.dto.user;

import dac.ufpr.Auth.enums.EnRole;

public record UserRequestDto(String id, String email, String senha, String role, Long idUsuario) {
}
