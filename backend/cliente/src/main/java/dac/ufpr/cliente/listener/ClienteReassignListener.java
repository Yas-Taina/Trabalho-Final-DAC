package dac.ufpr.cliente.listener;

import dac.ufpr.cliente.dto.ClienteReassignDto;
import dac.ufpr.cliente.enums.EnStatusIntegracao;
import dac.ufpr.cliente.listener.dto.SagaMessage;
import dac.ufpr.cliente.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import static dac.ufpr.cliente.config.RabbitMqConfig.CLIENTE_REASSIGN_QUEUE;
import static dac.ufpr.cliente.config.RabbitMqConfig.SAGA_GERENTE_CREATION_QUEUE;

/**
 * Listener for cliente reassignment in gerente creation saga.
 * Reassigns a cliente to a new gerente.
 */
@Component
@RequiredArgsConstructor
public class ClienteReassignListener {

    private final Logger log = LoggerFactory.getLogger(ClienteReassignListener.class);
    private final ClienteService clienteService;
    private final RabbitTemplate rabbitTemplate;

    /**
     * Listens to cliente reassignment queue.
     * 
     * Expected flow:
     * 1. Receives clienteId and new gerente's CPF
     * 2. Reassigns the cliente to the new gerente
     * 3. Sends success/failure message back to saga
     */
    @RabbitListener(queues = CLIENTE_REASSIGN_QUEUE)
    public void handleClienteReassign(SagaMessage<ClienteReassignDto> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", CLIENTE_REASSIGN_QUEUE, message);

        try {
            ClienteReassignDto reassignData = message.getData();
            
            // Reassign the cliente to the new gerente
            clienteService.reassignClienteToGerente(
                    reassignData.getClienteId(), 
                    reassignData.getNovoGerenteCpf()
            );
            
            log.info("Cliente {} reassigned to gerente {}. SagaId: {}", 
                    reassignData.getClienteId(), 
                    reassignData.getNovoGerenteCpf(), 
                    message.getSagaId());

            // Send success message back to saga
            SagaMessage<ClienteReassignDto> successMessage = new SagaMessage<>(
                    message.getSagaId(),
                    "CLIENTE_REASSIGNED",
                    EnStatusIntegracao.SUCESSO,
                    null,
                    reassignData
            );

            rabbitTemplate.convertAndSend(SAGA_GERENTE_CREATION_QUEUE, successMessage);

        } catch (Exception e) {
            log.error("Erro ao reassign cliente. SagaId: {}. Erro:", message.getSagaId(), e);
            
            // Send error back to saga
            SagaMessage<?> errorMessage = new SagaMessage<>(
                    message.getSagaId(),
                    "CLIENTE_REASSIGN",
                    EnStatusIntegracao.FALHA,
                    e.getMessage(),
                    message.getData()
            );
            
            rabbitTemplate.convertAndSend(SAGA_GERENTE_CREATION_QUEUE, errorMessage);
        }
    }
}
