package dac.ufpr.gerente.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import dac.ufpr.gerente.dto.GerenteDto;
import dac.ufpr.gerente.service.GerenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/gerentes")
@RequiredArgsConstructor
public class GerenteController {

    private final GerenteService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) //201
    public void criar(@RequestBody GerenteDto gerenteDto) {
        service.criar(gerenteDto);
    }
    
}
