package dac.ufpr.Auth.listener;

import dac.ufpr.Auth.dto.user.UserRequestDto;
import dac.ufpr.Auth.dto.user.UserResponseDto;
import dac.ufpr.Auth.enums.EnRole;
import dac.ufpr.Auth.enums.EnStatusIntegracao;
import dac.ufpr.Auth.exception.mapper.ExceptionMapper;
import dac.ufpr.Auth.listener.dto.GerenteDto;
import dac.ufpr.Auth.listener.dto.SagaMessage;
import dac.ufpr.Auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import static dac.ufpr.Auth.config.RabbitMqConfig.AUTH_GERENTE_CREATE_QUEUE;
import static dac.ufpr.Auth.config.RabbitMqConfig.SAGA_RESPONSE_QUEUE;

@Component
@RequiredArgsConstructor
public class AuthGerenteListener {

    private final Logger log = LoggerFactory.getLogger(AuthGerenteListener.class);

    private final AuthService service;
    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = AUTH_GERENTE_CREATE_QUEUE)
    public void listen(SagaMessage<GerenteDto> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", AUTH_GERENTE_CREATE_QUEUE, message);

        try {
            GerenteDto gerenteDto = message.getData();
            
            UserRequestDto dtoRequest = new UserRequestDto(
                    null,
                    gerenteDto.getCpf(),
                    gerenteDto.getEmail(),
                    gerenteDto.getSenha(),
                    EnRole.GERENTE.name()
            );

            UserResponseDto dtoResponse = service.register(dtoRequest);

            log.info("Credenciais de gerente criadas com sucesso. CPF: {}", gerenteDto.getCpf());

            SagaMessage<GerenteDto> response = new SagaMessage<>(
                    message.getSagaId(),
                    AUTH_GERENTE_CREATE_QUEUE,
                    EnStatusIntegracao.SUCESSO,
                    null,
                    message.getData()
            );

            rabbitTemplate.convertAndSend(SAGA_RESPONSE_QUEUE, response);
        } catch (Exception e) {
            log.error("Erro ao processar mensagem para tópico: {}. Erro: ", AUTH_GERENTE_CREATE_QUEUE, e);

            SagaMessage<?> response = ExceptionMapper.mapExceptionToSagaMessage(
                message.getSagaId(),
                AUTH_GERENTE_CREATE_QUEUE,
                message.getData(),
                e
            );

            rabbitTemplate.convertAndSend(SAGA_RESPONSE_QUEUE, response);
        }
    }
}
