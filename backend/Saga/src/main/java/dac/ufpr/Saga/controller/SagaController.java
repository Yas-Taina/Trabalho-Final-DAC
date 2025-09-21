package dac.ufpr.Saga.controller;

import dac.ufpr.Saga.SagaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sagas")
@RequiredArgsConstructor
public class SagaController {

    private final SagaService service;

    @PostMapping
    public ResponseEntity<Void> iniciarSagaAutocadastro() {
        service.iniciarSagaAutocadastro();
        return ResponseEntity.ok().build();
    }
}
