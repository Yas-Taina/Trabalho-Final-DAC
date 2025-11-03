package com.example.bantads.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.bantads.dto.*;
import java.util.*;
@RestController
@RequestMapping("/gerentes")
public class GerentesController {
    @GetMapping
    public ResponseEntity<Object> getGerentes(@RequestParam(required=false) String numero) {
        if ("dashboard".equals(numero)) {
            ItemDashboardResponse item = new ItemDashboardResponse();
            item.setNome("Geniéve");
            item.setSaldo(1099.21);
            item.setLimite(5000.0);
            return ResponseEntity.ok(List.of(item));
        } else {
            DadoGerente g = new DadoGerente();
            g.setCpf("40501740066");
            g.setNome("Geniéve");
            g.setEmail("ger1@bantads.com.br");
            return ResponseEntity.ok(List.of(g));
        }
    }
    @PostMapping
    public ResponseEntity<DadoGerente> inserir(@RequestBody DadoGerenteInsercao body) {
        DadoGerente g = new DadoGerente();
        g.setCpf(body.getCpf());
        g.setNome(body.getNome());
        g.setEmail(body.getEmail());
        return ResponseEntity.ok(g);
    }
    @GetMapping("/{cpf}")
    public ResponseEntity<DadoGerente> buscar(@PathVariable String cpf) {
        DadoGerente g = new DadoGerente();
        g.setCpf(cpf);
        g.setNome("Geniéve");
        g.setEmail("ger1@bantads.com.br");
        return ResponseEntity.ok(g);
    }
    @DeleteMapping("/{cpf}")
    public ResponseEntity<DadoGerente> deletar(@PathVariable String cpf) {
        DadoGerente g = new DadoGerente();
        g.setCpf(cpf);
        g.setNome("Geniéve");
        g.setEmail("ger1@bantads.com.br");
        return ResponseEntity.ok(g);
    }
    @PutMapping("/{cpf}")
    public ResponseEntity<DadoGerente> atualizar(@PathVariable String cpf, @RequestBody DadoGerenteAtualizacao body) {
        DadoGerente g = new DadoGerente();
        g.setCpf(cpf);
        g.setNome(body.getNome());
        g.setEmail(body.getEmail());
        return ResponseEntity.ok(g);
    }
}
