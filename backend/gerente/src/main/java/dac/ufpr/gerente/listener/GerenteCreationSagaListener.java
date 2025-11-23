package dac.ufpr.gerente.listener;

import dac.ufpr.gerente.dto.GerenteDto;
import dac.ufpr.gerente.enums.EnStatusIntegracao;
import dac.ufpr.gerente.listener.dto.ContaReassignDto;
import dac.ufpr.gerente.listener.dto.SagaMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import static dac.ufpr.gerente.config.RabbitMqConfig.SAGA_GERENTE_CREATION_QUEUE;
import static dac.ufpr.gerente.config.RabbitMqConfig.CONTA_REASSIGN_QUEUE;

/**
 * Listener for Gerente creation saga.
 * After gerente is created, initiates the reassignment process by sending message to conta service.
 */
@Component
@RequiredArgsConstructor
public class GerenteCreationSagaListener {

    private final Logger log = LoggerFactory.getLogger(GerenteCreationSagaListener.class);
    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = SAGA_GERENTE_CREATION_QUEUE)
    public void handleGerenteCreated(SagaMessage<GerenteDto> message) {
        log.info("Mensagem recebida para tópico: {}. Iniciando reassignment de conta/cliente. Payload: {}", 
                SAGA_GERENTE_CREATION_QUEUE, message);

        try {
            ContaReassignDto reassignRequest = new ContaReassignDto();
            reassignRequest.setNovoGerenteCpf(message.getData().cpf());

            SagaMessage<ContaReassignDto> contaMessage = new SagaMessage<>(
                    message.getSagaId(),
                    "GERENTE_CREATED",
                    EnStatusIntegracao.SUCESSO,
                    null,
                    reassignRequest
            );

            rabbitTemplate.convertAndSend(CONTA_REASSIGN_QUEUE, contaMessage);
            log.info("Mensagem enviada para reassignment de conta. SagaId: {}", message.getSagaId());

        } catch (Exception e) {
            log.error("Erro ao processar saga de criação de gerente. SagaId: {}. Erro:", message.getSagaId(), e);
            
            // TODO: Implement compensation logic if needed
            // For now, just log the error
        }
    }
}
