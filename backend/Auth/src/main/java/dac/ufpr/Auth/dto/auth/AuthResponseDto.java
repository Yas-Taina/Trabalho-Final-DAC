package dac.ufpr.Auth.dto.auth;

import dac.ufpr.Auth.dto.user.UserResponseDto;

public record AuthResponseDto(String access_token, String token_type, String tipo, UserResponseDto usuario) {
}
