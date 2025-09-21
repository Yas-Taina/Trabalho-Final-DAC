package dac.ufpr.Saga.listener;

import dac.ufpr.Saga.enums.EnStatusIntegracao;
import dac.ufpr.Saga.listener.dto.SagaMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import static dac.ufpr.Saga.config.RabbitMqConfig.*;

@Component
@RequiredArgsConstructor
public class SagaAutocadastroListener {

    private final Logger log = LoggerFactory.getLogger(SagaAutocadastroListener.class);

    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = SAGA_AUTOCADASTRO_QUEUE)
    public void onSagamessage(SagaMessage<?> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", SAGA_AUTOCADASTRO_QUEUE, message);


        if (CLIENTE_CREATE_QUEUE.equals(message.getStep()) && EnStatusIntegracao.SUCESSO.equals(message.getStatus())) {
            SagaMessage<?> next = new SagaMessage<>(
                    message.getSagaId(),
                    AUTH_CREATE_QUEUE,
                    EnStatusIntegracao.INICIADO,
                    null,
                    message.getData(),
                    null
            );
            rabbitTemplate.convertAndSend(AUTH_CREATE_QUEUE, next);
        }

        else if (AUTH_CREATE_QUEUE.equals(message.getStep()) && EnStatusIntegracao.SUCESSO.equals(message.getStatus())) {
            SagaMessage<?> next = new SagaMessage<>(
                    message.getSagaId(),
                    CONTA_CREATE_QUEUE,
                    EnStatusIntegracao.INICIADO,
                    null,
                    message.getData(),
                    null
            );
            rabbitTemplate.convertAndSend(CONTA_CREATE_QUEUE, next);
        }

        else if (CONTA_CREATE_QUEUE.equals(message.getStep()) && EnStatusIntegracao.SUCESSO.equals(message.getStatus())) {
            SagaMessage<?> next = new SagaMessage<>(
                    message.getSagaId(),
                    GERENTE_ASSIGN_QUEUE,
                    EnStatusIntegracao.INICIADO,
                    null,
                    message.getData(),
                    null
            );
            rabbitTemplate.convertAndSend(GERENTE_ASSIGN_QUEUE, next);
        }

        else if (GERENTE_ASSIGN_QUEUE.equals(message.getStep()) && EnStatusIntegracao.SUCESSO.equals(message.getStatus())) {
            log.info("[sagaId={}] SAGA concluída com sucesso", message.getSagaId());
        }

        else if (AUTH_CREATE_QUEUE.equals(message.getStep()) && EnStatusIntegracao.FALHA.equals(message.getStatus())) {
            log.error("[sagaId={}] Falha ao criar autenticação. Compensando CLIENTE...", message.getSagaId());
            SagaMessage<?> compensation = new SagaMessage<>(
                    message.getSagaId(),
                    CLIENTE_DELETE_QUEUE,
                    EnStatusIntegracao.INICIADO,
                    null,
                    message.getData(),
                    null
            );
            rabbitTemplate.convertAndSend(CLIENTE_DELETE_QUEUE, compensation);
        }

        else if (CONTA_CREATE_QUEUE.equals(message.getStep()) && EnStatusIntegracao.FALHA.equals(message.getStatus())) {
            log.error("[sagaId={}] Falha ao criar conta. Compensando AUTH + CLIENTE...", message.getSagaId());

            rabbitTemplate.convertAndSend(AUTH_DELETE_QUEUE, message);
            rabbitTemplate.convertAndSend(CLIENTE_DELETE_QUEUE, message);
        }

        else if (GERENTE_ASSIGN_QUEUE.equals(message.getStep()) && EnStatusIntegracao.FALHA.equals(message.getStatus())) {
            log.error("[sagaId={}] Falha ao atribuir gerente. Compensando CONTA + AUTH + CLIENTE...", message.getSagaId());

            rabbitTemplate.convertAndSend(CONTA_DELETE_QUEUE, message);
            rabbitTemplate.convertAndSend(AUTH_DELETE_QUEUE, message);
            rabbitTemplate.convertAndSend(CLIENTE_DELETE_QUEUE, message);
        }
    }

}
