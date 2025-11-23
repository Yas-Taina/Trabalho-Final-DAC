package dac.ufpr.conta.messaging;

import dac.ufpr.conta.dto.ClienteReassignDto;
import dac.ufpr.conta.dto.ContaReassignDto;
import dac.ufpr.conta.enums.EnStatusIntegracao;
import dac.ufpr.conta.messaging.dto.SagaMessage;
import dac.ufpr.conta.service.ContaService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import static dac.ufpr.conta.config.RabbitMqConfig.CONTA_REASSIGN_QUEUE;
import static dac.ufpr.conta.config.RabbitMqConfig.CLIENTE_REASSIGN_QUEUE;
import static dac.ufpr.conta.config.RabbitMqConfig.SAGA_GERENTE_CREATION_QUEUE;

/**
 * Listener for conta reassignment in gerente creation saga.
 * Finds a conta to be reassigned to the new gerente and forwards clienteId to cliente service.
 */
@Component
@RequiredArgsConstructor
public class ContaReassignListener {

    private final Logger log = LoggerFactory.getLogger(ContaReassignListener.class);
    private final ContaService contaService;
    private final RabbitTemplate rabbitTemplate;

    /**
     * Listens to conta reassignment queue.
     * 
     * Expected flow:
     * 1. Receives request with new gerente's CPF
     * 2. Finds a conta that needs to be reassigned
     * 3. Reassigns the conta to the new gerente
     * 4. Gets the clienteId from the conta
     * 5. Sends message to cliente service to reassign the cliente
     */
    @RabbitListener(queues = CONTA_REASSIGN_QUEUE)
    public void handleContaReassign(SagaMessage<ContaReassignDto> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", CONTA_REASSIGN_QUEUE, message);

        try {
            ContaReassignDto reassignData = message.getData();
            
            // Find a conta to reassign
            var conta = contaService.findContaToReassign();
            
            // If no conta should be reassigned (first gerente or only one gerente with one conta)
            if (conta == null) {
                log.info("Nenhuma conta para reassign. Primeiro gerente ou único gerente com uma conta. SagaId: {}", 
                        message.getSagaId());
                
                // Send success message but with null clienteId to indicate no reassignment needed
                ClienteReassignDto clienteReassignDto = new ClienteReassignDto();
                clienteReassignDto.setClienteId(null);
                clienteReassignDto.setNovoGerenteCpf(reassignData.getNovoGerenteCpf());

                SagaMessage<ClienteReassignDto> clienteMessage = new SagaMessage<>(
                        message.getSagaId(),
                        "NO_REASSIGNMENT_NEEDED",
                        EnStatusIntegracao.SUCESSO,
                        null,
                        clienteReassignDto
                );

                rabbitTemplate.convertAndSend(SAGA_GERENTE_CREATION_QUEUE, clienteMessage);
                return;
            }
            
            // Reassign the conta to the new gerente
            contaService.reassignConta(conta.getId(), reassignData.getNovoGerenteCpf());
            
            // Get clienteId from the conta
            Long clienteId = conta.getClienteId();
            
            log.info("Conta {} reassigned to gerente {}. SagaId: {}", 
                    conta.getId(), 
                    reassignData.getNovoGerenteCpf(), 
                    message.getSagaId());
            
            // Create message for cliente service
            ClienteReassignDto clienteReassignDto = new ClienteReassignDto();
            clienteReassignDto.setClienteId(clienteId);
            clienteReassignDto.setNovoGerenteCpf(reassignData.getNovoGerenteCpf());

            SagaMessage<ClienteReassignDto> clienteMessage = new SagaMessage<>(
                    message.getSagaId(),
                    "CONTA_REASSIGNED",
                    EnStatusIntegracao.SUCESSO,
                    null,
                    clienteReassignDto
            );

            rabbitTemplate.convertAndSend(CLIENTE_REASSIGN_QUEUE, clienteMessage);
            log.info("Mensagem enviada para reassignment de cliente. SagaId: {}, ContaId: {}, ClienteId: {}", 
                    message.getSagaId(), conta.getId(), clienteId);

        } catch (Exception e) {
            log.error("Erro ao processar reassignment de conta. SagaId: {}. Erro:", message.getSagaId(), e);
            
            // Send error back to saga
            SagaMessage<?> errorMessage = new SagaMessage<>(
                    message.getSagaId(),
                    "CONTA_REASSIGN",
                    EnStatusIntegracao.FALHA,
                    e.getMessage(),
                    message.getData()
            );
            
            rabbitTemplate.convertAndSend(SAGA_GERENTE_CREATION_QUEUE, errorMessage);
        }
    }
}
