package dac.ufpr.gerente.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import dac.ufpr.gerente.model.Gerente;

@CrossOrigin
@RestController
public class GerenteREST {

    public static List<Gerente> lista = new ArrayList<>();

    static {
        lista.add(new Gerente("11111111111", "Carlos Silva", "carlos@empresa.com", "123", "ADMINISTRADOR"));
        lista.add(new Gerente("22222222222", "Maria Souza", "maria@empresa.com", "456", "ADMINISTRADOR"));
        lista.add(new Gerente("33333333333", "João Lima", "joao@empresa.com", "789", "ADMINISTRADOR"));
    }

    @GetMapping("/gerentes")
    public ResponseEntity<List<Gerente>> getTodosGerentes() {
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/gerentes/{cpf}")
    public ResponseEntity<Gerente> obterGerenteByCpf(@PathVariable("cpf") String cpf) {
        return lista.stream()
                .filter(ger -> cpf.equals(ger.getCpf()))
                .findFirst()
                .map(gerenteEncontrado -> ResponseEntity.ok(gerenteEncontrado))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/gerentes")
    public ResponseEntity<?> inserirGerente(@RequestBody Gerente gerente) {
        boolean cpfJaExiste = lista.stream().anyMatch(g -> g.getCpf().equals(gerente.getCpf()));

        if (cpfJaExiste) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Erro: Já existe um gerente com o CPF " + gerente.getCpf());
        }
        lista.add(gerente);
        return new ResponseEntity<>(gerente, HttpStatus.CREATED);
    }

    @PutMapping("/gerentes/{cpf}")
    public ResponseEntity<Gerente> alterarGerente(@PathVariable("cpf") String cpf,
            @RequestBody Gerente gerenteAtualizado) {
        Optional<Gerente> gerenteExistenteOpt = lista.stream()
                .filter(ger -> ger.getCpf().equals(cpf))
                .findFirst();

        if (gerenteExistenteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Gerente gExistente = gerenteExistenteOpt.get();
        gExistente.setNome(gerenteAtualizado.getNome());
        gExistente.setEmail(gerenteAtualizado.getEmail());
        gExistente.setSenha(gerenteAtualizado.getSenha());
        gExistente.setTipo(gerenteAtualizado.getTipo());

        return ResponseEntity.ok(gExistente);
    }

    @DeleteMapping("/gerentes/{cpf}")
    public ResponseEntity<Void> removerGerente(@PathVariable("cpf") String cpf) {
        boolean foiRemovido = lista.removeIf(g -> g.getCpf().equals(cpf));

        if (foiRemovido) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}