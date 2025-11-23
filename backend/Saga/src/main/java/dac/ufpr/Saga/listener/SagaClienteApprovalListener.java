package dac.ufpr.Saga.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import dac.ufpr.Saga.config.EmailService;
import dac.ufpr.Saga.dto.ClienteDto;
import dac.ufpr.Saga.enums.EnStatusIntegracao;
import dac.ufpr.Saga.listener.dto.SagaMessage;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static dac.ufpr.Saga.config.RabbitMqConfig.*;
import static dac.ufpr.Saga.config.RabbitMqConfig.CONTA_CREATE_QUEUE;

@Component
@RequiredArgsConstructor
public class SagaClienteApprovalListener {

  private final Logger log = LoggerFactory.getLogger(SagaClienteApprovalListener.class);

  private final RabbitTemplate rabbitTemplate;

  private final EmailService emailService;

  @RabbitListener(queues = SAGA_CLIENTE_APPROVAL_QUEUE)
  public void onSagamessage(SagaMessage<ClienteDto> message) {
    log.info("Mensagem recebida para tópico: {}. Payload: {}", SAGA_CLIENTE_APPROVAL_QUEUE, message);

    if (EnStatusIntegracao.SUCESSO.equals(message.getStatus())) {
      switch (message.getStep()) {
        case CLIENTE_APPROVAL_QUEUE -> enviarConta(message);
        case CONTA_CREATE_QUEUE -> enviarAuth(message);
        case AUTH_UPDATE_QUEUE -> {
          enviarSenha(message);
          log.info("Saga finalizada!");
        }
      }
    }

    if (EnStatusIntegracao.FALHA.equals(message.getStatus())) {
      log.error("Falha na aprovação do cliente. Erro no step: {}", message.getStep());

      switch (message.getStep()) {
        case CONTA_CREATE_QUEUE -> compensarConta(message);
        case AUTH_UPDATE_QUEUE -> compensarAuth(message);
      }
    }
  }

  private void enviarAuth(SagaMessage<?> message) {

    SagaMessage<?> next = new SagaMessage<>(
        message.getSagaId(),
        AUTH_UPDATE_QUEUE,
        EnStatusIntegracao.INICIADO,
        null,
        message.getData());

    rabbitTemplate.convertAndSend(AUTH_UPDATE_QUEUE, next);
  }

  private void enviarConta(SagaMessage<?> message) {

    SagaMessage<?> next = new SagaMessage<>(
        message.getSagaId(),
        CONTA_CREATE_QUEUE,
        EnStatusIntegracao.INICIADO,
        null,
        message.getData());

    rabbitTemplate.convertAndSend(CONTA_CREATE_QUEUE, next);
  }

  private void enviarSenha(SagaMessage<ClienteDto> message) {

    String email = message.getData().getEmail();
    String senha = message.getData().getSenha();
    if (StringUtils.hasText(email)) {
      Map<String, Object> vars = new HashMap<>();
      vars.put("senha", senha);
      try {
        emailService.enviarEmailComTemplate(email, "Senha autenticação BANTADS", "email-aprovacao-cliente", vars);
      } catch (Exception e) {
        log.error("Erro ao enviar email de senha para {}: {}", email, e.getMessage());
        compensarSaga(message);
      }
    }

  }

    private void compensarSaga(SagaMessage<ClienteDto> message) {
      log.info("[sagaId={}] Iniciando compensação da saga...", message.getSagaId());
      rabbitTemplate.convertAndSend(AUTH_COMPENSATE_UPDATE_QUEUE, message);
      rabbitTemplate.convertAndSend(CONTA_COMPENSATE_CREATE_QUEUE, message);
      rabbitTemplate.convertAndSend(CLIENTE_COMPENSATE_APPROVAL_QUEUE, message);
    }

  private void compensarAuth(SagaMessage<?> message) {
    log.info("[sagaId={}] Compensando AUTH...", message.getSagaId());
    rabbitTemplate.convertAndSend(CONTA_COMPENSATE_CREATE_QUEUE, message);
    rabbitTemplate.convertAndSend(CLIENTE_COMPENSATE_APPROVAL_QUEUE, message);
  }

  private void compensarConta(SagaMessage<?> message) {
    log.info("[sagaId={}] Compensando CONTA...", message.getSagaId());
    rabbitTemplate.convertAndSend(CLIENTE_COMPENSATE_APPROVAL_QUEUE, message);
  }
}
