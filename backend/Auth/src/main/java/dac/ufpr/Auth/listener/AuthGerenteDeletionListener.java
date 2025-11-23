package dac.ufpr.Auth.listener;

import dac.ufpr.Auth.enums.EnStatusIntegracao;
import dac.ufpr.Auth.exception.mapper.ExceptionMapper;
import dac.ufpr.Auth.listener.dto.SagaMessage;
import dac.ufpr.Auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import static dac.ufpr.Auth.config.RabbitMqConfig.AUTH_GERENTE_DELETE_QUEUE;
import static dac.ufpr.Auth.config.RabbitMqConfig.SAGA_GERENTE_DELETION_QUEUE;

@Component
@RequiredArgsConstructor
public class AuthGerenteDeletionListener {

    private final Logger log = LoggerFactory.getLogger(AuthGerenteDeletionListener.class);

    private final AuthService service;
    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = AUTH_GERENTE_DELETE_QUEUE)
    public void listen(SagaMessage<?> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", AUTH_GERENTE_DELETE_QUEUE, message);

        try {
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> data = (java.util.Map<String, Object>) message.getData();
            String cpf = (String) data.get("cpf");

            service.deleteUserByCpf(cpf);

            log.info("Credenciais de gerente deletadas com sucesso. CPF: {}", cpf);

            SagaMessage<String> response = new SagaMessage<>(
                    message.getSagaId(),
                    AUTH_GERENTE_DELETE_QUEUE,
                    EnStatusIntegracao.SUCESSO,
                    null,
                    cpf
            );

            rabbitTemplate.convertAndSend(SAGA_GERENTE_DELETION_QUEUE, response);
        } catch (Exception e) {
            log.error("Erro ao processar mensagem para tópico: {}. Erro: ", AUTH_GERENTE_DELETE_QUEUE, e);

            SagaMessage<?> response = ExceptionMapper.mapExceptionToSagaMessage(
                message.getSagaId(),
                AUTH_GERENTE_DELETE_QUEUE,
                message.getData(),
                e
            );

            rabbitTemplate.convertAndSend(SAGA_GERENTE_DELETION_QUEUE, response);
        }
    }
}
