package dac.ufpr.Saga.service;

import dac.ufpr.Saga.dto.ClienteDto;
import dac.ufpr.Saga.enums.EnStatusIntegracao;
import dac.ufpr.Saga.listener.dto.SagaMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import static dac.ufpr.Saga.config.RabbitMqConfig.*;

@Service
@RequiredArgsConstructor
public class SagaService {

    private final RabbitTemplate rabbitTemplate;

    public void iniciarSagaAutocadastro(ClienteDto dto) {

        SagaMessage<ClienteDto> message = new SagaMessage<>(
                java.util.UUID.randomUUID().toString(),
                CONTA_GERENTE_ASSIGN_QUEUE,
                EnStatusIntegracao.INICIADO,
                null,
                dto,
                null
        );

        rabbitTemplate.convertAndSend(CONTA_GERENTE_ASSIGN_QUEUE, message);
    }

    public void aprovarCliente(String cpf) {

        SagaMessage<String> message = new SagaMessage<>(
                java.util.UUID.randomUUID().toString(),
                CLIENTE_APPROVAL_QUEUE,
                EnStatusIntegracao.INICIADO,
                null,
                cpf,
                null
        );

        rabbitTemplate.convertAndSend(CLIENTE_APPROVAL_QUEUE, message);
    }
}
