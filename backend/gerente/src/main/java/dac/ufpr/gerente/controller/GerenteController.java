package dac.ufpr.gerente.controller;

import dac.ufpr.gerente.dto.GerenteDto;
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

    @GetMapping
    public ResponseEntity<List<GerenteDto>> getTodosGerentes() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<GerenteDto> obterGerenteByCpf(@PathVariable String cpf) {
        return ResponseEntity.ok(service.buscarPorCpf(cpf));
    }

    @PostMapping
    public ResponseEntity<GerenteDto> inserirGerente(@RequestBody @Valid GerenteDto dto,
                                                     UriComponentsBuilder uriBuilder) {
        GerenteDto criado = service.criar(dto);
        var location = uriBuilder.path("/gerentes/{cpf}").buildAndExpand(criado.cpf()).toUri();
        return ResponseEntity.created(location).body(criado);
    }

    @PutMapping("/{cpf}")
    public ResponseEntity<GerenteDto> alterarGerente(@PathVariable String cpf,
                                                     @RequestBody @Valid GerenteDto dto) {
        return ResponseEntity.ok(service.atualizar(cpf, dto));
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> removerGerente(@PathVariable String cpf) {
        service.remover(cpf);
        return ResponseEntity.noContent().build();
    }
}
