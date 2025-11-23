package dac.ufpr.conta.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = CONTA_REASSIGN_QUEUE)
    public void handleContaReassign(SagaMessage<?> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", CONTA_REASSIGN_QUEUE, message);

        try {
            ContaReassignDto reassignData = objectMapper.convertValue(message.getData(), ContaReassignDto.class);
            
            var conta = contaService.findContaToReassign();
            
            if (conta == null) {
                log.info("Nenhuma conta para reassign. Primeiro gerente ou único gerente com uma conta. SagaId: {}", 
                        message.getSagaId());
                
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
            
            contaService.reassignConta(conta.getId(), reassignData.getNovoGerenteCpf());
            
            Long clienteId = conta.getClienteId();
            
            log.info("Conta {} reassigned to gerente {}. SagaId: {}", 
                    conta.getId(), 
                    reassignData.getNovoGerenteCpf(), 
                    message.getSagaId());
            
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
