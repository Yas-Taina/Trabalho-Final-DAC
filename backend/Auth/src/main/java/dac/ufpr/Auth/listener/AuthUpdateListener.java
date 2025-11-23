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
import org.springframework.stereotype.Component;

import static dac.ufpr.Auth.config.RabbitMqConfig.*;

@Component
@RequiredArgsConstructor
public class AuthUpdateListener {

    private final Logger log = LoggerFactory.getLogger(AuthUpdateListener.class);

    private final AuthService service;

    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = AUTH_UPDATE_QUEUE)
    public void listen(SagaMessage<ClienteDto> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", AUTH_UPDATE_QUEUE, message);

        try {
            String senha = service.atualizarUsuarioComSenha(message.getData().getEmail());

            message.getData().setSenha(senha);

            SagaMessage<ClienteDto> response = new SagaMessage<>(
                    message.getSagaId(),
                    AUTH_UPDATE_QUEUE,
                    EnStatusIntegracao.SUCESSO,
                    null,
                    message.getData()
            );

            rabbitTemplate.convertAndSend(SAGA_CLIENTE_APPROVAL_QUEUE, response);
        } catch (Exception e) {
            log.error("Erro ao processar mensagem para tópico: {}. Erro: ", AUTH_UPDATE_QUEUE, e);

            SagaMessage<?> response = ExceptionMapper.mapExceptionToSagaMessage(
                    message.getSagaId(),
                    AUTH_UPDATE_QUEUE,
                    message.getData(),
                    e
            );

            rabbitTemplate.convertAndSend(SAGA_CLIENTE_APPROVAL_QUEUE, response);
        }
    }

    @RabbitListener(queues = AUTH_COMPENSATE_UPDATE_QUEUE)
    public void listenCompensateApproval(SagaMessage<ClienteDto> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", AUTH_COMPENSATE_UPDATE_QUEUE, message);

        try {
            service.apagarSenha(message.getData().getEmail());

            log.info("Compensação realizada com sucesso para usuário: {}", message.getData().getEmail());
        } catch (Exception e) {
            log.error("Erro ao processar mensagem para tópico: {}. Erro: ", AUTH_COMPENSATE_UPDATE_QUEUE, e);
        }
    }


}
