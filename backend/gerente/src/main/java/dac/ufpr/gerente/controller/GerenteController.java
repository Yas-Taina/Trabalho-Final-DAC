package dac.ufpr.gerente.controller;

import dac.ufpr.gerente.dto.GerenteDto;
import dac.ufpr.gerente.security.utils.JwtExtractor;
import dac.ufpr.gerente.service.GerenteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/gerentes")
@RequiredArgsConstructor
public class GerenteController {

    private final GerenteService service;
    private final JwtExtractor jwtExtractor;

    @GetMapping
    public ResponseEntity<List<GerenteDto>> getTodosGerentes() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<GerenteDto> buscarPorCpf(@PathVariable String cpf) {
        return ResponseEntity.ok(service.buscarPorCpf(cpf));
    }

    @PostMapping
    public ResponseEntity<GerenteDto> criar(@RequestBody @Valid GerenteDto dto,
                                                     UriComponentsBuilder uriBuilder) {
        GerenteDto criado = service.criar(dto);
        var location = uriBuilder.path("/gerentes/{cpf}").buildAndExpand(criado.cpf()).toUri();
        return ResponseEntity.created(location).body(criado);
    }

    @PutMapping("/{cpf}")
    public ResponseEntity<GerenteDto> atualizar(@PathVariable String cpf,
                                                     @RequestBody(required = false) GerenteDto dto) {
        // Permite body nulo ou parcial. Mantém CPF da path e usa campos do body quando presentes.
        if (dto == null) {
            dto = new GerenteDto(null, null, null, null);
        }
        GerenteDto dtoComCpf = new GerenteDto(cpf, dto.nome(), dto.email(), dto.tipo());
        return ResponseEntity.ok(service.atualizar(cpf, dtoComCpf));
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<GerenteDto> remover(@PathVariable String cpf) {
        GerenteDto dto = service.remover(cpf);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/my-data")
    public ResponseEntity<String> getMyData() {
        String cpf = jwtExtractor.getAuthenticatedCpf().orElse("Unknown CPF");
        
        return ResponseEntity.ok(cpf);
    }
}
