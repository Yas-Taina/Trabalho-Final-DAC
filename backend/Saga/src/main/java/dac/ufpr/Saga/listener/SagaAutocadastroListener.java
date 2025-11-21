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

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static dac.ufpr.Saga.config.RabbitMqConfig.*;

@Component
@RequiredArgsConstructor
public class SagaAutocadastroListener {

  private final Logger log = LoggerFactory.getLogger(SagaAutocadastroListener.class);

  private final RabbitTemplate rabbitTemplate;

  private final EmailService emailService;

  private final ObjectMapper mapper;

  @RabbitListener(queues = SAGA_AUTOCADASTRO_QUEUE)
  public void onSagamessage(SagaMessage<ClienteDto> message) {
    log.info("Mensagem recebida para tópico: {}. Payload: {}", SAGA_AUTOCADASTRO_QUEUE, message);

    if (EnStatusIntegracao.SUCESSO.equals(message.getStatus())) {
      switch (message.getStep()) {
        case CONTA_GERENTE_ASSIGN_QUEUE -> enviarCliente2(message);
        case CLIENTE_CREATE_QUEUE -> enviarAuth(message);
        case AUTH_CREATE_QUEUE -> log.info("Saga finalizada!");
      }
    }

    if (EnStatusIntegracao.FALHA.equals(message.getStatus())) {
      log.error("Falha no autocadastro. Erro no step: {}", message.getStep());

      switch (message.getStep()) {
        case AUTH_CREATE_QUEUE -> compensarAuth(message);
        case CONTA_GERENTE_ASSIGN_QUEUE -> compensarConta(message);
      }

      String email = message.getData().email();
      String nome = message.getData().nome();
      if (Objects.nonNull(email)) {
        Map<String, Object> vars = new HashMap<>();
        vars.put("nome", nome);
        try {
          emailService.enviarEmailComTemplate(email, "Falha no Autocadastro BANTADS", "email-falha-autocadastro", vars);
        } catch (Exception e) {
          log.error("Erro ao enviar email de falha no autocadastro para {}: {}", email, e.getMessage());
        }
      }
    }
  }

  private void enviarAuth(SagaMessage<?> message) {
    SagaMessage<Object> next = new SagaMessage<>(
        message.getSagaId(),
        AUTH_CREATE_QUEUE,
        EnStatusIntegracao.INICIADO,
        null,
        message.getData());

    rabbitTemplate.convertAndSend(AUTH_CREATE_QUEUE, next);
  }

  private void enviarCliente2(SagaMessage<?> message) {

    SagaMessage<?> next = new SagaMessage<>(
        message.getSagaId(),
        CLIENTE_CREATE_QUEUE,
        EnStatusIntegracao.INICIADO,
        null,
        message.getData());

    rabbitTemplate.convertAndSend(CLIENTE_CREATE_QUEUE, next);
  }

  private void enviarCliente(SagaMessage<?> message) {

    SagaMessage<Object> next = new SagaMessage<>(
        message.getSagaId(),
        CONTA_GERENTE_ASSIGN_QUEUE,
        EnStatusIntegracao.INICIADO,
        null,
        message.getData());

    rabbitTemplate.convertAndSend(CONTA_GERENTE_ASSIGN_QUEUE, next);
  }

  private void compensarAuth(SagaMessage<?> message) {
    log.info("[sagaId={}] Compensando AUTH...", message.getSagaId());
    rabbitTemplate.convertAndSend(CLIENTE_DELETE_QUEUE, message);
  }

  private void compensarConta(SagaMessage<?> message) {
    log.info("[sagaId={}] Compensando CONTA...", message.getSagaId());
    rabbitTemplate.convertAndSend(AUTH_DELETE_QUEUE, message);
    rabbitTemplate.convertAndSend(CLIENTE_DELETE_QUEUE, message);
  }

}
