package dac.ufpr.Saga.listener;

import dac.ufpr.Saga.enums.EnStatusIntegracao;
import dac.ufpr.Saga.listener.dto.SagaMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static dac.ufpr.Saga.config.RabbitMqConfig.*;

@Component
@RequiredArgsConstructor
public class GerenteAssignListener {

    private final Logger log = LoggerFactory.getLogger(GerenteAssignListener.class);

    private final RabbitTemplate rabbitTemplate;

    private final RestTemplate restTemplate = new RestTemplate();

    @RabbitListener(queues = GERENTE_ASSIGN_QUEUE)
    public void listen(SagaMessage<?> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", GERENTE_ASSIGN_QUEUE, message);

        try {
            // Call Conta service endpoint that returns gerente with fewest clients
            ResponseEntity<?> resp = restTemplate.getForEntity("http://localhost:8083/contas/gerente/assign", Map.class);
            @SuppressWarnings("unchecked")
            Map<String, Object> body = (Map<String, Object>) resp.getBody();
            Long chosen = null;
            if (body != null && body.get("gerenteId") != null) {
                Object gidObj = body.get("gerenteId");
                if (gidObj instanceof Number) chosen = ((Number) gidObj).longValue();
                else chosen = Long.parseLong(gidObj.toString());
            }

            // If no contas or no gerente found in contas, leave chosen null

            // Create next message: attach gerenteId and forward to cliente.create.queue
            SagaMessage<?> next = new SagaMessage<>(
                    message.getSagaId(),
                    CLIENTE_CREATE_QUEUE,
                    EnStatusIntegracao.INICIADO,
                    null,
                    message.getData(),
                    message.getHttpStatus(),
                    chosen
            );

            rabbitTemplate.convertAndSend(CLIENTE_CREATE_QUEUE, next);

        } catch (Exception e) {
            log.error("Erro ao processar mensagem para o tópico: {}. Erro:", GERENTE_ASSIGN_QUEUE, e);
            SagaMessage<?> error = new SagaMessage<>(
                    message.getSagaId(),
                    GERENTE_ASSIGN_QUEUE,
                    EnStatusIntegracao.FALHA,
                    e.getMessage(),
                    message.getData(),
                    500,
                    null
            );
            rabbitTemplate.convertAndSend(SAGA_AUTOCADASTRO_QUEUE, error);
        }
    }

}
