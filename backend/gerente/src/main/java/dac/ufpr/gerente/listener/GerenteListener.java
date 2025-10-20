package dac.ufpr.gerente.listener;

import dac.ufpr.gerente.dto.GerenteDto;
import dac.ufpr.gerente.enums.EnStatusIntegracao;
import dac.ufpr.gerente.exception.mapper.ExceptionMapper;
import dac.ufpr.gerente.listener.dto.SagaMessage;
import dac.ufpr.gerente.service.GerenteService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import static dac.ufpr.gerente.config.RabbitMqConfig.GERENTE_CREATE_QUEUE;
import static dac.ufpr.gerente.config.RabbitMqConfig.SAGA_RESPONSE_QUEUE;

@Component
@RequiredArgsConstructor
public class GerenteListener {

    private final Logger log = LoggerFactory.getLogger(GerenteListener.class);

    private final GerenteService service;
    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = GERENTE_CREATE_QUEUE)
    public void listen(SagaMessage<GerenteDto> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", GERENTE_CREATE_QUEUE, message);

        try{
            GerenteDto dto = service.criar(message.getData());
            
            SagaMessage<GerenteDto> response = new SagaMessage<>(
                    message.getSagaId(),
                    GERENTE_CREATE_QUEUE,
                    EnStatusIntegracao.SUCESSO,
                    null,
                    dto,
                    HttpStatus.CREATED.value()
            );

            rabbitTemplate.convertAndSend(SAGA_RESPONSE_QUEUE, response);
        } catch (Exception e) {
            log.error ("Erro ao processar a mensagem para o tópico: {}. Erro: ",GERENTE_CREATE_QUEUE, e);

            SagaMessage<?> errorResponse = ExceptionMapper.mapExceptionToSagaMessage(
                    message.getSagaId(),
                    GERENTE_CREATE_QUEUE,
                    message.getData(),
                    e
            );

            rabbitTemplate.convertAndSend(SAGA_RESPONSE_QUEUE, errorResponse);
        }
    }
}
