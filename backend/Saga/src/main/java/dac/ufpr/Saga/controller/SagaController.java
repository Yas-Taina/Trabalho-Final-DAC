package dac.ufpr.Saga.controller;

import dac.ufpr.Saga.dto.ClienteDto;
import dac.ufpr.Saga.service.SagaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sagas")
@RequiredArgsConstructor
public class SagaController {

    private final SagaService service;

    @PostMapping
    public ResponseEntity<Void> iniciarSagaAutocadastro(@RequestBody ClienteDto dto) {
        service.iniciarSagaAutocadastro(dto);
        return ResponseEntity.ok().build();
    }
}
