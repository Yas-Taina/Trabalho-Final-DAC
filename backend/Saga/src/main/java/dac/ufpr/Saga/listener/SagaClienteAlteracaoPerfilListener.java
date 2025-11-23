package dac.ufpr.Saga.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import dac.ufpr.Saga.config.EmailService;
import dac.ufpr.Saga.dto.ClienteDto;
import dac.ufpr.Saga.enums.EnStatusIntegracao;
import dac.ufpr.Saga.listener.dto.SagaMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static dac.ufpr.Saga.config.RabbitMqConfig.*;
import static dac.ufpr.Saga.config.RabbitMqConfig.AUTH_CREATE_QUEUE;

@Component
@RequiredArgsConstructor
public class SagaClienteAlteracaoPerfilListener {

    private final Logger log = LoggerFactory.getLogger(SagaAutocadastroListener.class);

    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = SAGA_CLIENTE_ALTERACAO_PERFIL_QUEUE)
    public void onSagamessage(SagaMessage<ClienteDto> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", SAGA_CLIENTE_ALTERACAO_PERFIL_QUEUE, message);

        if (EnStatusIntegracao.SUCESSO.equals(message.getStatus())) {
            switch (message.getStep()) {
                case CLIENTE_ALTERACAO_PERFIL_QUEUE -> enviarConta(message);
                case CONTA_ALTERACAO_PERFIL_QUEUE -> enviarAuth(message);
                case AUTH_ALTERACAO_PERFIL -> log.info("Saga finalizada!");
            }
        }

        if (EnStatusIntegracao.FALHA.equals(message.getStatus())) {
            log.error("Falha na alteração de perfil. Erro no step: {}", message.getStep());

            switch (message.getStep()) {
                case CONTA_ALTERACAO_PERFIL_QUEUE -> compensarConta(message);
                case AUTH_ALTERACAO_PERFIL -> compensarAuth(message);
            }

        }
    }

    private void enviarConta(SagaMessage<?> message) {

        SagaMessage<?> next = new SagaMessage<>(
                message.getSagaId(),
                CONTA_ALTERACAO_PERFIL_QUEUE,
                EnStatusIntegracao.INICIADO,
                null,
                message.getData());

        rabbitTemplate.convertAndSend(CONTA_ALTERACAO_PERFIL_QUEUE, next);
    }

    private void enviarAuth(SagaMessage<?> message) {
        SagaMessage<Object> next = new SagaMessage<>(
                message.getSagaId(),
                AUTH_ALTERACAO_PERFIL,
                EnStatusIntegracao.INICIADO,
                null,
                message.getData());

        rabbitTemplate.convertAndSend(AUTH_ALTERACAO_PERFIL, next);
    }

    private void compensarConta(SagaMessage<?> message) {
        log.info("[sagaId={}] Compensando CONTA...", message.getSagaId());
//        rabbitTemplate.convertAndSend(CLIENTE_COMPENSATE_APPROVAL_QUEUE, message);
    }

    private void compensarAuth(SagaMessage<?> message) {
        log.info("[sagaId={}] Compensando AUTH...", message.getSagaId());
//        rabbitTemplate.convertAndSend(CONTA_COMPENSATE_CREATE_QUEUE, message);
//        rabbitTemplate.convertAndSend(CLIENTE_COMPENSATE_APPROVAL_QUEUE, message);
    }
}
