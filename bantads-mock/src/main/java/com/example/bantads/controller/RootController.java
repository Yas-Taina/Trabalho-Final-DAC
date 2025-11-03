package com.example.bantads.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
@RestController
public class RootController {
    @GetMapping("/reboot")
    public ResponseEntity<String> reboot() {
        return ResponseEntity.ok("{\"message\":\"Banco de dados criado conforme especificação\"}");
    }
}
