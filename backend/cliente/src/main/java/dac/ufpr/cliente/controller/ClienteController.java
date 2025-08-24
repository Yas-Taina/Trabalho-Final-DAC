package dac.ufpr.cliente.controller;

import dac.ufpr.cliente.dto.ClienteDto;
import dac.ufpr.cliente.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) //201
    public void criar(@RequestBody ClienteDto clienteDto) {
        service.criar(clienteDto);
    }


}
