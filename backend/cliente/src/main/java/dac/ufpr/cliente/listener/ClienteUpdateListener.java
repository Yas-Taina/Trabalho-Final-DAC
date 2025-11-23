package dac.ufpr.cliente.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.stereotype.Component;

import static dac.ufpr.cliente.config.RabbitMqConfig.*;
import static dac.ufpr.cliente.config.RabbitMqConfig.CLIENTE_COMPENSATE_CREATE_QUEUE;

@Component
@RequiredArgsConstructor
public class ClienteUpdateListener {

    private final Logger log = LoggerFactory.getLogger(ClienteListener.class);

    private final ClienteService service;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = CLIENTE_ALTERACAO_PERFIL_QUEUE)
    public void listenCreate(SagaMessage<ClienteDto> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", CLIENTE_ALTERACAO_PERFIL_QUEUE, message);

        try {
            ClienteDto dto = service.atualizar(message.getData().cpf(), message.getData());

            SagaMessage<ClienteDto> response = new SagaMessage<>(
                    message.getSagaId(),
                    CLIENTE_ALTERACAO_PERFIL_QUEUE,
                    EnStatusIntegracao.SUCESSO,
                    null,
                    dto
            );

            rabbitTemplate.convertAndSend(SAGA_CLIENTE_ALTERACAO_PERFIL_QUEUE, response);
        } catch (Exception e) {
            log.error("Erro ao processar mensagem para tópico: {}. Erro: ", CLIENTE_ALTERACAO_PERFIL_QUEUE, e);

            SagaMessage<?> response = ExceptionMapper.mapExceptionToSagaMessage(
                    message.getSagaId(),
                    CLIENTE_ALTERACAO_PERFIL_QUEUE,
                    message.getData(),
                    e
            );

            rabbitTemplate.convertAndSend(SAGA_CLIENTE_ALTERACAO_PERFIL_QUEUE, response);
        }
    }

//    @RabbitListener(queues = CLIENTE_COMPENSATE_CREATE_QUEUE)
//    public void listenCompensateCreate(SagaMessage<ClienteDto> message) {
//        log.info("Mensagem recebida para tópico: {}. Payload: {}", CLIENTE_COMPENSATE_CREATE_QUEUE, message);
//
//        try {
//            service.deletar(message.getData().cpf());
//
//            log.info("Compensação da criação do cliente realizada com sucesso para o cliente: {}", message.getData());
//        } catch (Exception e) {
//            log.error("Erro ao processar mensagem para tópico: {}. Erro: ", CLIENTE_COMPENSATE_CREATE_QUEUE, e);
//        }
//    }
}
