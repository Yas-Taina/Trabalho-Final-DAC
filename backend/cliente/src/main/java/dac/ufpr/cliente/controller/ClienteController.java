package dac.ufpr.cliente.controller;

import dac.ufpr.cliente.dto.ClienteDto;
import dac.ufpr.cliente.dto.ClienteRejeicaoDto;
import dac.ufpr.cliente.security.utils.JwtExtractor;
import dac.ufpr.cliente.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService service;
    private final JwtExtractor jwtExtractor;

    @GetMapping
    public ResponseEntity<List<ClienteDto>> listar(@RequestParam(required = false) String filtro) {
        return ResponseEntity.ok(service.listar(filtro));
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

    @PostMapping("/{cpf}/rejeitar")
    public ResponseEntity<String> rejeitarCliente(@PathVariable String cpf, @RequestBody ClienteRejeicaoDto rejeicaoDto) {
        return ResponseEntity.ok(service.rejeitarCliente(cpf, rejeicaoDto.motivo()));
    }

    @GetMapping("/my-data")
    public ResponseEntity<String> getMyData() {
        String cpf = jwtExtractor.getAuthenticatedCpf().orElse("Unknown CPF");
        
        return ResponseEntity.ok(cpf);
    }

    @PostMapping("/reboot")
    public ResponseEntity<?> reboot() {
        service.reboot();
        return ResponseEntity.ok(
                Map.of("message", "Banco de dados reiniciado com sucesso"));
    }

    @GetMapping("/{cpf}/exists")
    public ResponseEntity<Boolean> checkIfClienteExists(@PathVariable String cpf) {
        boolean exists = service.existsByCpf(cpf);
        return ResponseEntity.ok(exists);
    }

}
