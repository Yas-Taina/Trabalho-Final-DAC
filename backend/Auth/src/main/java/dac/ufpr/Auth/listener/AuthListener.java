package dac.ufpr.Auth.listener;

import dac.ufpr.Auth.dto.user.UserRequestDto;
import dac.ufpr.Auth.dto.user.UserResponseDto;
import dac.ufpr.Auth.enums.EnRole;
import dac.ufpr.Auth.enums.EnStatusIntegracao;
import dac.ufpr.Auth.exception.mapper.ExceptionMapper;
import dac.ufpr.Auth.listener.dto.ClienteDto;
import dac.ufpr.Auth.listener.dto.SagaMessage;
import dac.ufpr.Auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import static dac.ufpr.Auth.config.RabbitMqConfig.AUTH_CREATE_QUEUE;
import static dac.ufpr.Auth.config.RabbitMqConfig.SAGA_AUTOCADASTRO_QUEUE;

@Component
@RequiredArgsConstructor
public class AuthListener {

    private final Logger log = LoggerFactory.getLogger(AuthListener.class);

    private final AuthService service;
    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = AUTH_CREATE_QUEUE)
    public void listen(SagaMessage<ClienteDto> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", AUTH_CREATE_QUEUE, message);

        try {
            UserRequestDto dtoRequest =
                    new UserRequestDto(
                            null,
                            message.getData().getCpf(),
                            message.getData().getEmail(),
                            null,
                            EnRole.CLIENTE.name()
                    );

            UserResponseDto dtoResponse = service.register(dtoRequest);

            SagaMessage<ClienteDto> response = new SagaMessage<>(
                    message.getSagaId(),
                    AUTH_CREATE_QUEUE,
                    EnStatusIntegracao.SUCESSO,
                    null,
                    message.getData()
            );

            rabbitTemplate.convertAndSend(SAGA_AUTOCADASTRO_QUEUE, response);
        } catch (Exception e) {
            log.error("Erro ao processar mensagem para tópico: {}. Erro: ", AUTH_CREATE_QUEUE, e);

        SagaMessage<?> response = ExceptionMapper.mapExceptionToSagaMessage(
            message.getSagaId(),
            AUTH_CREATE_QUEUE,
            message.getData(),
            e
        );

        rabbitTemplate.convertAndSend(SAGA_AUTOCADASTRO_QUEUE, response);
        }
    }
}
