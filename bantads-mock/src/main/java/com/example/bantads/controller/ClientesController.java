package com.example.bantads.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;
import com.example.bantads.dto.*;
@RestController
@RequestMapping("/clientes")
public class ClientesController {
    @GetMapping
    public ResponseEntity<Object> getClientes(@RequestParam(required=false) String filtro) {
        if ("para_aprovar".equals(filtro)) {
            ClienteParaAprovarResponse item = new ClienteParaAprovarResponse();
            item.setCpf("12912861012");
            item.setNome("Catharyna");
            item.setEmail("cli1@bantads.com.br");
            item.setEndereco("Rua X, nr 10");
            item.setCidade("Curitiba");
            item.setEstado("PR");
            return ResponseEntity.ok(List.of(item));
        } else if ("adm_relatorio_clientes".equals(filtro)) {
            DadosClienteResponse d = new DadosClienteResponse();
            d.setCpf("12912861012");
            d.setNome("Catharyna");
            d.setEmail("cli1@bantads.com.br");
            d.setTelefone("(41) 9 9999-8989");
            d.setEndereco("Rua X, nr 10");
            d.setCidade("Curitiba");
            d.setEstado("PR");
            d.setSalario(800.0);
            d.setConta("1291");
            d.setSaldo("1291");
            d.setLimite(5000.0);
            d.setGerente("98574307084");
            d.setGerente_nome("Geniéve");
            d.setGerente_email("ger1@bantads.com.br");
            return ResponseEntity.ok(List.of(d));
        } else {
            ClienteResponse c = new ClienteResponse();
            c.setCpf("12912861012");
            c.setNome("Catharyna");
            c.setEmail("cli1@bantads.com.br");
            c.setTelefone("(41) 9 9999-8989");
            c.setEndereco("Rua X, nr 10");
            c.setCidade("Curitiba");
            c.setEstado("PR");
            c.setConta("1291");
            c.setSaldo(800.0);
            c.setLimite(5000.0);
            return ResponseEntity.ok(List.of(c));
        }
    }
    @PostMapping
    public ResponseEntity<String> autocadastro(@RequestBody AutocadastroInfo body){
        return ResponseEntity.status(201).body("{\"message\":\"Cliente autocadastrado\"}");
    }
    @GetMapping("/{cpf}")
    public ResponseEntity<DadosClienteResponse> getCliente(@PathVariable String cpf) {
        DadosClienteResponse d = new DadosClienteResponse();
        d.setCpf(cpf);
        d.setNome("Catharyna");
        d.setTelefone("(41) 9 9999-8989");
        d.setEmail("cli1@bantads.com.br");
        d.setEndereco("Rua X, nr 10");
        d.setCidade("Curitiba");
        d.setEstado("PR");
        d.setSalario(800.0);
        d.setConta("1291");
        d.setSaldo("1291");
        d.setLimite(5000.0);
        d.setGerente("98574307084");
        d.setGerente_nome("Geniéve");
        d.setGerente_email("ger1@bantads.com.br");
        return ResponseEntity.ok(d);
    }
    @PutMapping("/{cpf}")
    public ResponseEntity<String> atualizaPerfil(@PathVariable String cpf, @RequestBody PerfilInfo perfil) {
        return ResponseEntity.ok("{\"message\":\"Perfil do cliente alterado com sucesso\"}");
    }
    @PostMapping("/{cpf}/aprovar")
    public ResponseEntity<ContaResponse> aprovar(@PathVariable String cpf) {
        ContaResponse c = new ContaResponse();
        c.setCliente(cpf);
        c.setNumero("0114");
        c.setSaldo(2000.0);
        c.setLimite(1000.0);
        c.setGerente("98574307084");
        c.setCriacao("2025-08-01T10:22:45-03:00");
        return ResponseEntity.ok(c);
    }
    @PostMapping("/{cpf}/rejeitar")
    public ResponseEntity<String> rejeitar(@PathVariable String cpf, @RequestBody Map<String,String> body) {
        return ResponseEntity.ok("{\"message\":\"Cliente rejeitado com sucesso\"}");
    }
}
