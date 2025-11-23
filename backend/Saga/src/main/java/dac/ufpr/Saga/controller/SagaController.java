package dac.ufpr.Saga.controller;

import dac.ufpr.Saga.dto.ClienteDto;
import dac.ufpr.Saga.dto.GerenteDto;
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

    @PostMapping("/clientes")
    public ResponseEntity<Void> iniciarSagaAutocadastro(@RequestBody ClienteDto dto) {
        service.iniciarSagaAutocadastro(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/clientes/{cpf}/aprovar")
    public ResponseEntity<Void> aprovarCliente(@RequestBody String cpf) {
        service.aprovarCliente(cpf);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/gerentes")
    public ResponseEntity<Void> iniciarSagaGerenteCreation(@RequestBody GerenteDto dto) {
        service.iniciarSagaGerenteCreation(dto);
        return ResponseEntity.ok().build();
    }
}
