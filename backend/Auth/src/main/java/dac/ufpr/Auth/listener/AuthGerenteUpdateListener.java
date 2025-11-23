package dac.ufpr.Auth.listener;

import dac.ufpr.Auth.listener.dto.SagaMessage;
import dac.ufpr.Auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static dac.ufpr.Auth.config.RabbitMqConfig.AUTH_GERENTE_UPDATE_QUEUE;

@Component
@RequiredArgsConstructor
public class AuthGerenteUpdateListener {

    private final Logger log = LoggerFactory.getLogger(AuthGerenteUpdateListener.class);

    private final AuthService service;

    @RabbitListener(queues = AUTH_GERENTE_UPDATE_QUEUE)
    public void listen(SagaMessage<?> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", AUTH_GERENTE_UPDATE_QUEUE, message);

        try {
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> data = (java.util.Map<String, Object>) message.getData();
            String cpf = (String) data.get("cpf");
            String email = (String) data.get("email");
            String senha = (String) data.get("senha");

            service.updateGerenteCredentials(cpf, email, senha);

            log.info("Credenciais de gerente atualizadas com sucesso. CPF: {}", cpf);

            // No need to send response back - gerente already completed its saga
        } catch (Exception e) {
            log.error("Erro ao processar mensagem para tópico: {}. Erro: ", AUTH_GERENTE_UPDATE_QUEUE, e);
            // Log error but don't send response - this is a fire-and-forget operation
        }
    }
}
