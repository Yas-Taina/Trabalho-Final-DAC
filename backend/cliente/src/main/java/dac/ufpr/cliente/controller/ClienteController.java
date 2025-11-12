package dac.ufpr.cliente.controller;

import dac.ufpr.cliente.dto.ClienteDto;
import dac.ufpr.cliente.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Collection;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('GERENTE', 'ADMINISTRADOR')")
    public ResponseEntity<List<ClienteDto>> listar(@RequestParam(required = false) String filter) {
        // Recupera os dados do usuário autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        // Recupera o ID do usuário
        Map<String, Object> details = (Map<String, Object>) authentication.getDetails();
        String userId = (String) details.get("userId");
        
        // Recupera as roles do usuário
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        boolean isGerente = authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_GERENTE"));
        
        // Log para demonstração
        System.out.println("Usuário autenticado: " + userEmail);
        System.out.println("ID do usuário: " + userId);
        System.out.println("Roles: " + authorities);
        
        // Você pode usar essas informações para filtrar os dados ou tomar decisões
        if (isGerente) {
            // Se for gerente, pode ter uma lógica específica
            System.out.println("Usuário é um gerente");
        }
        
        return ResponseEntity.ok(service.listar(filter));
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
