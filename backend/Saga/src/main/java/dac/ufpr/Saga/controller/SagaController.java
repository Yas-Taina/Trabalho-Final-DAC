package dac.ufpr.Saga.controller;

import dac.ufpr.Saga.dto.ClienteDto;
import dac.ufpr.Saga.dto.GerenteDto;
import dac.ufpr.Saga.service.SagaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    @PreAuthorize("hasAnyRole('GERENTE', 'ADMINISTRADOR')")
    @PostMapping("/clientes/{cpf}/aprovar")
    public ResponseEntity<Void> aprovarCliente(@PathVariable String cpf) {
        service.aprovarCliente(cpf);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/gerentes")
    public ResponseEntity<Void> iniciarSagaGerenteCreation(@RequestBody GerenteDto dto) {
        service.iniciarSagaGerenteCreation(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/gerentes/{cpf}")
    public ResponseEntity<Void> iniciarSagaGerenteDeletion(@PathVariable String cpf) {
        service.iniciarSagaGerenteDeletion(cpf);
        return ResponseEntity.ok().build();
    }
  
    @PreAuthorize("hasAnyRole('CLIENTE', 'ADMINISTRADOR')")
    @PutMapping("/clientes/{cpf}")
    public ResponseEntity<Void> iniciarSagaAlteracaoPerfilCliente(@PathVariable String cpf, @RequestBody ClienteDto dto) {
        service.iniciarSagaAlteracaoPerfilCliente(cpf, dto);
        return ResponseEntity.ok().build();
    }

}
