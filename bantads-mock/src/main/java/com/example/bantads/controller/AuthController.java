package com.example.bantads.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.bantads.dto.*;
@RestController
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginInfo info) {
        return ResponseEntity.ok("{\"message\":\"Login efetuado com sucesso\"}");
    }
    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout() {
        LogoutResponse r = new LogoutResponse();
        r.setCpf("76179646090");
        r.setNome("Usuário Mock");
        r.setEmail("mock@bantads.com.br");
        r.setTipo("CLIENTE");
        return ResponseEntity.ok(r);
    }
}
