package dac.ufpr.Saga.service;

import dac.ufpr.Saga.dto.ClienteDto;
import dac.ufpr.Saga.enums.EnStatusIntegracao;
import dac.ufpr.Saga.listener.dto.SagaMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import static dac.ufpr.Saga.config.RabbitMqConfig.CLIENTE_CREATE_QUEUE;

@Service
@RequiredArgsConstructor
public class SagaService {

    private final RabbitTemplate rabbitTemplate;

    public void iniciarSagaAutocadastro(ClienteDto dto) {

        SagaMessage<ClienteDto> message = new SagaMessage<>(
                java.util.UUID.randomUUID().toString(),
                CLIENTE_CREATE_QUEUE,
                EnStatusIntegracao.INICIADO,
                null,
                dto,
                null
        );

        rabbitTemplate.convertAndSend(CLIENTE_CREATE_QUEUE, message);
    }
}
