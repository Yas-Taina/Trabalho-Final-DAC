package dac.ufpr.gerente.listener;

import dac.ufpr.gerente.listener.dto.SagaMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static dac.ufpr.gerente.config.RabbitMqConfig.SAGA_GERENTE_UPDATE_QUEUE;

/**
 * Listener for Gerente update saga completion from Auth service.
 * Receives notification after password has been updated in Auth.
 */
@Component
@RequiredArgsConstructor
public class GerenteUpdateSagaListener {

    private final Logger log = LoggerFactory.getLogger(GerenteUpdateSagaListener.class);

    @RabbitListener(queues = SAGA_GERENTE_UPDATE_QUEUE)
    public void handleGerentePasswordUpdated(SagaMessage<?> message) {
        log.info("Mensagem recebida para tópico: {}. Atualização de senha concluída. Payload: {}", 
                SAGA_GERENTE_UPDATE_QUEUE, message);

        try {
            if ("SUCESSO".equals(message.getStatus().name())) {
                log.info("Senha de gerente atualizada com sucesso no Auth. SagaId: {}", message.getSagaId());
            } else {
                log.error("Erro na atualização de senha no Auth. SagaId: {}, Erro: {}", 
                        message.getSagaId(), message.getError());
                // TODO: Implement compensation logic if needed
            }
        } catch (Exception e) {
            log.error("Erro ao processar resposta de atualização de senha. SagaId: {}. Erro:", 
                    message.getSagaId(), e);
        }
    }
}
