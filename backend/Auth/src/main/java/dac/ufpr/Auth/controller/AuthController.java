package dac.ufpr.Auth.controller;

import dac.ufpr.Auth.dto.auth.AuthRequestDto;
import dac.ufpr.Auth.dto.auth.AuthResponseDto;
import dac.ufpr.Auth.dto.auth.LogoutResponseDto;
import dac.ufpr.Auth.dto.user.UserRequestDto;
import dac.ufpr.Auth.dto.user.UserResponseDto;
import dac.ufpr.Auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@RequestBody UserRequestDto user) {
        return ResponseEntity.ok(service.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody AuthRequestDto authRequest) {
        return ResponseEntity.ok(service.login(authRequest));
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponseDto> logout(@RequestHeader("Authorization") String authorizationHeader) {
        LogoutResponseDto response = service.logout(authorizationHeader);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/token/validate")
    public ResponseEntity<Boolean> isTokenValid(@RequestParam("token") String token) {
        boolean isValid = service.isTokenValid(token);
        return ResponseEntity.ok(isValid);
    }

}
