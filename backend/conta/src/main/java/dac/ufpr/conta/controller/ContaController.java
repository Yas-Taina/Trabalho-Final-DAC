package dac.ufpr.conta.controller;

import dac.ufpr.conta.dto.ContaDto;
import dac.ufpr.conta.service.ContaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;


@RestController
@RequestMapping("/contas")
@RequiredArgsConstructor
public class ContaController {

    private final ContaService service;

    @GetMapping
    // @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ContaDto>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/gerente/assign")
    public ResponseEntity<Map<String, Long>> getGerenteWithFewestClientes() {
        Long gerenteId = service.findGerenteWithFewestClientes();
        Map<String, Long> resp = new HashMap<>();
        resp.put("gerenteId", gerenteId);
        return ResponseEntity.ok(resp);
    }

}
