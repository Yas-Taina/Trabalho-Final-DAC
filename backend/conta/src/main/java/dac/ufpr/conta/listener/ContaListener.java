package dac.ufpr.conta.listener;

import dac.ufpr.conta.dto.ContaDto;
import dac.ufpr.conta.enums.EnStatusIntegracao;
import dac.ufpr.conta.exception.mapper.ExceptionMapper;
import dac.ufpr.conta.listener.dto.SagaMessage;
import dac.ufpr.conta.service.ContaService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import static dac.ufpr.conta.config.RabbitMqConfig.CONTA_CREATE_QUEUE;
import static dac.ufpr.conta.config.RabbitMqConfig.SAGA_RESPONSE_QUEUE;

@Component
@RequiredArgsConstructor
public class ContaListener {

    private final Logger log = LoggerFactory.getLogger(ContaListener.class);

    private final ContaService service;
    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = CONTA_CREATE_QUEUE)
    public void listen(SagaMessage<ContaDto> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", CONTA_CREATE_QUEUE, message);

        try {
            ContaDto dto = service.criar(message.getData());

            SagaMessage<ContaDto> response = new SagaMessage<>(
                    message.getSagaId(),
                    CONTA_CREATE_QUEUE,
                    EnStatusIntegracao.SUCESSO,
                    null,
                    dto,
                    HttpStatus.CREATED.value()
            );

            rabbitTemplate.convertAndSend(SAGA_RESPONSE_QUEUE, response);
        } catch (Exception e) {
            log.error("Erro ao processar mensagem para tópico: {}. Erro: ", CONTA_CREATE_QUEUE, e);

            SagaMessage<?> response = ExceptionMapper.mapExceptionToSagaMessage(
                    message.getSagaId(),
                    CONTA_CREATE_QUEUE,
                    message.getData(),
                    e
            );

            rabbitTemplate.convertAndSend(SAGA_RESPONSE_QUEUE, response);
        }
    }

}
