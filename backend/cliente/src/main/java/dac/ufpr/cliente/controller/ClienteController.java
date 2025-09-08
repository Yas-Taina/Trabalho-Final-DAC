package dac.ufpr.cliente.controller;

import dac.ufpr.cliente.dto.ClienteDto;
import dac.ufpr.cliente.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService service;

    @GetMapping
    public ResponseEntity<List<ClienteDto>> listar(@RequestParam(required = true) String filtro) {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<ClienteDto> consultarPorCpf(@PathVariable String cpf) {
        return ResponseEntity.ok(service.consultarPorCpf(cpf));
    }

    @PostMapping
    public ResponseEntity<ClienteDto> criar(@RequestBody ClienteDto clienteDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(clienteDto));
    }

    @PutMapping("/{cpf}")
    public ResponseEntity<ClienteDto> atualizar(@PathVariable String cpf, @RequestBody ClienteDto clienteDto) {
        return ResponseEntity.ok(service.atualizar(cpf, clienteDto));
    }

}
