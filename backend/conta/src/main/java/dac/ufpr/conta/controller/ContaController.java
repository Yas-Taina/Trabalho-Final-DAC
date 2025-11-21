package dac.ufpr.conta.controller;

import dac.ufpr.conta.dto.ContaDto;
import dac.ufpr.conta.dto.DepositoRequest;
import dac.ufpr.conta.dto.ExtratoDto;
import dac.ufpr.conta.dto.MovimentacaoDto;
import dac.ufpr.conta.service.ContaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// em dac.ufpr.conta.controller.ContaController
import dac.ufpr.conta.dto.SaldoDto;
import dac.ufpr.conta.dto.TransferenciaRequest;
import dac.ufpr.conta.security.utils.JwtExtractor;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/contas")
@RequiredArgsConstructor
public class ContaController {

    private final ContaService service;

    private final JwtExtractor jwtExtractor;

    @GetMapping
    // @PreAuthorize("hasRole('ROLE_ADMINISTRADOR')")
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

    @GetMapping("/{numero}/saldo")
    public ResponseEntity<SaldoDto> consultarSaldo(@PathVariable("numero") String numero) {
        SaldoDto dto = service.consultarSaldo(numero);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{numero}/depositar")
    public ResponseEntity<?> depositar(
            @PathVariable("numero") String numero,
            // @RequestHeader("X-Usuario-Id") Long usuarioId, // cabeçalho com id do dono
            // (obrigatório)
            @Valid @RequestBody DepositoRequest req) {

        SaldoDto saldo = service.depositarAndGetSaldo(numero, req.getValor());

        // retorno com mensagem e o saldoDto
        return ResponseEntity.ok(saldo);

    }

    @PostMapping("/{numero}/sacar")
    public ResponseEntity<?> sacar(
            @PathVariable("numero") String numero,
            @Valid @RequestBody DepositoRequest req) {

        SaldoDto saldo = service.sacarAndGetSaldo(numero, req.getValor());

        // retorno com o SaldoDto atualizado
        return ResponseEntity.ok(saldo);

    }

    @PostMapping("/{numero}/transferir")
    public ResponseEntity<?> transferir(
            @PathVariable("numero") String origem,
            @Valid @RequestBody TransferenciaRequest req) {

        service.transferirGenerica(origem, req.getDestino(), req.getValor());

        return ResponseEntity.ok(
                Map.of("message", "Transferência efetuada com sucesso"));
    }

    // @GetMapping("/{numero}/extrato")
    // public ResponseEntity<List<MovimentacaoDto>> extrato(@PathVariable("numero") String numero) {
    //     List<MovimentacaoDto> extrato = service.extrato(numero);
    //     return ResponseEntity.ok(extrato);
    // }

    @GetMapping("/{numero}/extrato")
    public ResponseEntity<ExtratoDto> extrato(@PathVariable("numero") String numero) {
        ExtratoDto dto = service.extrato(numero);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<ContaDto> getByClienteId(@PathVariable Long clienteId) {
        return ResponseEntity.ok(service.getByClienteId(clienteId));
    }

    @PostMapping("/reboot")
    public ResponseEntity<?> reboot() {
        service.reboot();
        return ResponseEntity.ok(
                Map.of("message", "Banco de dados reiniciado com sucesso"));
    }

}
