package com.example.bantads.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.bantads.dto.*;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
@RestController
@RequestMapping("/contas")
public class ContasController {
    @PostMapping("/{numero}/saldo")
    public ResponseEntity<SaldoResponse> saldo(@PathVariable String numero) {
        SaldoResponse s = new SaldoResponse();
        s.setCliente("76179646090");
        s.setConta(numero);
        s.setSaldo(1506.88);
        return ResponseEntity.ok(s);
    }
    @PostMapping("/{numero}/depositar")
    public ResponseEntity<OperacaoResponse> depositar(@PathVariable String numero, @RequestBody Map<String,Double> body) {
        OperacaoResponse o = new OperacaoResponse();
        o.setTipo("deposito");
        o.setValor(body.getOrDefault("valor",0.0));
        o.setData(OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        o.setDescricao("Depósito mock");
        return ResponseEntity.ok(o);
    }
    @PostMapping("/{numero}/sacar")
    public ResponseEntity<OperacaoResponse> sacar(@PathVariable String numero, @RequestBody Map<String,Double> body) {
        OperacaoResponse o = new OperacaoResponse();
        o.setTipo("saque");
        o.setValor(body.getOrDefault("valor",0.0));
        o.setData(OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        o.setDescricao("Saque mock");
        return ResponseEntity.ok(o);
    }
    @PostMapping("/{numero}/transferir")
    public ResponseEntity<TransferenciaResponse> transferir(@PathVariable String numero, @RequestBody Map<String,Object> body) {
        TransferenciaResponse t = new TransferenciaResponse();
        t.setOrigem(numero);
        t.setDestino((String)body.get("destino"));
        Object v = body.get("valor");
        t.setValor(v instanceof Number ? ((Number)v).doubleValue() : 0.0);
        t.setData(OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        return ResponseEntity.ok(t);
    }
    @PostMapping("/{numero}/extrato")
    public ResponseEntity<ExtratoResponse> extrato(@PathVariable String numero) {
        ExtratoResponse e = new ExtratoResponse();
        e.setConta(numero);
        e.setSaldo(1933.32);
        ItemExtratoResponse item = new ItemExtratoResponse();
        item.setData("2025-08-01T10:22:45-03:00");
        item.setDescricao("Transferência recebida");
        item.setTipo("transferência");
        item.setValor(972.22);
        e.setOperacoes(List.of(item));
        return ResponseEntity.ok(e);
    }
}
