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

        if (EnStatusIntegracao.SUCESSO.equals(message.getStatus())) {
            switch (message.getStep()) {
                case CLIENTE_CREATE_QUEUE -> enviarAuth(message);
                case AUTH_CREATE_QUEUE -> enviarConta(message);
                case CONTA_CREATE_QUEUE -> log.info("Saga finalizada!");
            }
        }

        if (EnStatusIntegracao.FALHA.equals(message.getStatus())) {
            switch (message.getStep()) {
                case AUTH_CREATE_QUEUE -> compensarAuth(message);
                case CONTA_CREATE_QUEUE -> compensarConta(message);
            }
        }
    }

    private void enviarAuth(SagaMessage<?> message) {


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

    private void enviarConta(SagaMessage<?> message) {

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

    private void compensarAuth(SagaMessage<?> message) {
        log.info("[sagaId={}] Compensando AUTH...", message.getSagaId());
        rabbitTemplate.convertAndSend(CLIENTE_DELETE_QUEUE, message);
    }

    private void compensarConta(SagaMessage<?> message) {
        log.info("[sagaId={}] Compensando CONTA...", message.getSagaId());
        rabbitTemplate.convertAndSend(AUTH_DELETE_QUEUE, message);
        rabbitTemplate.convertAndSend(CLIENTE_DELETE_QUEUE, message);
    }

}
