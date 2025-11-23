package dac.ufpr.Saga.service;

import dac.ufpr.Saga.dto.ClienteDto;
import dac.ufpr.Saga.dto.GerenteDto;
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
                dto
        );

        rabbitTemplate.convertAndSend(CONTA_GERENTE_ASSIGN_QUEUE, message);
    }

    public void aprovarCliente(String cpf) {

        SagaMessage<String> message = new SagaMessage<String>(
                java.util.UUID.randomUUID().toString(),
                CLIENTE_APPROVAL_QUEUE,
                EnStatusIntegracao.INICIADO,
                null,
                cpf
        );

        rabbitTemplate.convertAndSend(CLIENTE_APPROVAL_QUEUE, message);
    }

    /**
     * Initiates the Gerente Creation Saga.
     * After gerente is created, this saga will:
     * 1. Find a conta to reassign to the new gerente
     * 2. Get the clienteId from that conta
     * 3. Reassign the cliente to the new gerente
     * 
     * @param gerenteDto The created gerente data (must include cpf)
     * @return The saga ID for tracking
     */
    public String iniciarSagaGerenteCreation(GerenteDto gerenteDto) {
        String sagaId = java.util.UUID.randomUUID().toString();

        SagaMessage<GerenteDto> message = new SagaMessage<>(
                sagaId,
                "GERENTE_CREATE_INITIATED",
                EnStatusIntegracao.INICIADO,
                null,
                gerenteDto
        );

        rabbitTemplate.convertAndSend(SAGA_GERENTE_CREATION_QUEUE, message);
        return sagaId;
    }
}
