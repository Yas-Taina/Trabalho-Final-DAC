package dac.ufpr.Auth.listener;


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

import static dac.ufpr.Auth.config.RabbitMqConfig.AUTH_ALTERACAO_PERFIL;
import static dac.ufpr.Auth.config.RabbitMqConfig.SAGA_CLIENTE_ALTERACAO_PERFIL_QUEUE;

@Component
@RequiredArgsConstructor
public class AuthAlteracaoPerfilListener {

    private final Logger log = LoggerFactory.getLogger(AuthAlteracaoPerfilListener.class);

    private final RabbitTemplate rabbitTemplate;

    private final AuthService service;

    @RabbitListener(queues = AUTH_ALTERACAO_PERFIL)
    public void listener(SagaMessage<ClienteDto> sagaMessage) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", AUTH_ALTERACAO_PERFIL, sagaMessage);

        try {
            service.atualizarEmail(sagaMessage.getData());

            SagaMessage<ClienteDto> response = new SagaMessage<>(
                    sagaMessage.getSagaId(),
                    AUTH_ALTERACAO_PERFIL,
                    EnStatusIntegracao.SUCESSO,
                    null,
                    sagaMessage.getData()
            );

            rabbitTemplate.convertAndSend(SAGA_CLIENTE_ALTERACAO_PERFIL_QUEUE, response);
        } catch (Exception e) {
            log.error("Erro ao processar mensagem para tópico: {}. Erro: ", AUTH_ALTERACAO_PERFIL, e);

            SagaMessage<?> response = ExceptionMapper.mapExceptionToSagaMessage(
                    sagaMessage.getSagaId(),
                    AUTH_ALTERACAO_PERFIL,
                    sagaMessage.getData(),
                    e
            );

            rabbitTemplate.convertAndSend(SAGA_CLIENTE_ALTERACAO_PERFIL_QUEUE, response);
        }
    }




}
