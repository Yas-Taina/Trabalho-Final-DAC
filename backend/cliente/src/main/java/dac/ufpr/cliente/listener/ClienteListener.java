package dac.ufpr.cliente.listener;

import dac.ufpr.cliente.dto.ClienteDto;
import dac.ufpr.cliente.enums.EnStatusIntegracao;
import dac.ufpr.cliente.exception.mapper.ExceptionMapper;
import dac.ufpr.cliente.listener.dto.SagaMessage;
import dac.ufpr.cliente.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import static dac.ufpr.cliente.config.RabbitMqConfig.CLIENTE_CREATE_QUEUE;
import static dac.ufpr.cliente.config.RabbitMqConfig.SAGA_AUTOCADASTRO_QUEUE;

@Component
@RequiredArgsConstructor
public class ClienteListener {

    private final Logger log = LoggerFactory.getLogger(ClienteListener.class);

    private final ClienteService service;
    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = CLIENTE_CREATE_QUEUE)
    public void listen(SagaMessage<ClienteDto> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", CLIENTE_CREATE_QUEUE, message);

        try {
            ClienteDto dto = service.criar(message.getData());

            SagaMessage<ClienteDto> response = new SagaMessage<>(
                    message.getSagaId(),
                    CLIENTE_CREATE_QUEUE,
                    EnStatusIntegracao.SUCESSO,
                    null,
                    dto,
                    HttpStatus.CREATED.value()
            );

            rabbitTemplate.convertAndSend(SAGA_AUTOCADASTRO_QUEUE, response);
        } catch (Exception e) {
            log.error("Erro ao processar mensagem para tópico: {}. Erro: ", CLIENTE_CREATE_QUEUE, e);

            SagaMessage<?> response = ExceptionMapper.mapExceptionToSagaMessage(
                    message.getSagaId(),
                    CLIENTE_CREATE_QUEUE,
                    message.getData(),
                    e
            );

            rabbitTemplate.convertAndSend(SAGA_AUTOCADASTRO_QUEUE, response);
        }
    }

}
