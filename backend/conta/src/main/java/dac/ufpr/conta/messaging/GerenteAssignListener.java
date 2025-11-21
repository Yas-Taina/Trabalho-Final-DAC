package dac.ufpr.conta.messaging;

import dac.ufpr.conta.dto.ClienteDto;
import dac.ufpr.conta.enums.EnStatusIntegracao;
import dac.ufpr.conta.messaging.dto.SagaMessage;
import dac.ufpr.conta.service.ContaService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

import static dac.ufpr.conta.config.RabbitMqConfig.CONTA_GERENTE_ASSIGN_QUEUE;
import static dac.ufpr.conta.config.RabbitMqConfig.SAGA_AUTOCADASTRO_QUEUE;

@Component
@RequiredArgsConstructor
public class GerenteAssignListener {

    private final Logger log = LoggerFactory.getLogger(GerenteAssignListener.class);

    private final ContaService service;
    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = CONTA_GERENTE_ASSIGN_QUEUE)
    public void listen(SagaMessage<ClienteDto> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", CONTA_GERENTE_ASSIGN_QUEUE, message);

        try {
            String cpfGerente = service.recuperaCpfGerenteComMenosConta();

            message.getData().setCpf_gerente(cpfGerente);

            SagaMessage<?> next = new SagaMessage<>(
                    message.getSagaId(),
                    CONTA_GERENTE_ASSIGN_QUEUE,
                    EnStatusIntegracao.SUCESSO,
                    null,
                    message.getData()
            );

            rabbitTemplate.convertAndSend(SAGA_AUTOCADASTRO_QUEUE, next);

        } catch (Exception e) {
            log.error("Erro ao processar mensagem para o tópico: {}. Erro:", CONTA_GERENTE_ASSIGN_QUEUE, e);
            SagaMessage<?> error = new SagaMessage<>(
                    message.getSagaId(),
                    CONTA_GERENTE_ASSIGN_QUEUE,
                    EnStatusIntegracao.FALHA,
                    e.getMessage(),
                    message.getData()
            );
            rabbitTemplate.convertAndSend(SAGA_AUTOCADASTRO_QUEUE, error);
        }
    }

}
