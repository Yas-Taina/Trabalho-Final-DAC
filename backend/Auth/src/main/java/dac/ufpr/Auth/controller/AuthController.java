package dac.ufpr.Auth.controller;

import dac.ufpr.Auth.dto.auth.AuthRequestDto;
import dac.ufpr.Auth.dto.auth.AuthResponseDto;
import dac.ufpr.Auth.dto.user.UserRequestDto;
import dac.ufpr.Auth.dto.user.UserResponseDto;
import dac.ufpr.Auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
