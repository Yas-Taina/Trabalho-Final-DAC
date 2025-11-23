package dac.ufpr.Saga.service;

import dac.ufpr.Saga.dto.ClienteDto;
import dac.ufpr.Saga.dto.GerenteDto;
import dac.ufpr.Saga.dto.GerenteDeleteDto;
import dac.ufpr.Saga.enums.EnStatusIntegracao;
import dac.ufpr.Saga.listener.dto.SagaMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import static dac.ufpr.Saga.config.RabbitMqConfig.*;

@Service
@RequiredArgsConstructor
public class SagaService {

    private static final Logger log = LoggerFactory.getLogger(SagaService.class);
    private final RabbitTemplate rabbitTemplate;

    public void iniciarSagaAutocadastro(ClienteDto dto) {

        SagaMessage<ClienteDto> message = new SagaMessage<>(
                java.util.UUID.randomUUID().toString(),
                CONTA_GERENTE_ASSIGN_QUEUE,
                EnStatusIntegracao.INICIADO,
                null,
                dto
        );

        rabbitTemplate.convertAndSend(CONTA_GERENTE_ASSIGN_QUEUE, message);
    }

    public void aprovarCliente(String cpf) {

        SagaMessage<String> message = new SagaMessage<String>(
                java.util.UUID.randomUUID().toString(),
                CLIENTE_APPROVAL_QUEUE,
                EnStatusIntegracao.INICIADO,
                null,
                cpf
        );

        rabbitTemplate.convertAndSend(CLIENTE_APPROVAL_QUEUE, message);
    }

    public String iniciarSagaGerenteCreation(GerenteDto gerenteDto) {
        log.info("Iniciando saga de criação de gerente. CPF: {}, Nome: {}", gerenteDto.cpf(), gerenteDto.nome());
        String sagaId = java.util.UUID.randomUUID().toString();

        SagaMessage<GerenteDto> message = new SagaMessage<>(
                sagaId,
                "CREATE_GERENTE",
                EnStatusIntegracao.INICIADO,
                null,
                gerenteDto
        );

        log.info("Enviando mensagem para fila: {}. SagaId: {}", GERENTE_CREATE_QUEUE, sagaId);
        rabbitTemplate.convertAndSend(GERENTE_CREATE_QUEUE, message);
        log.info("Mensagem enviada com sucesso para fila: {}. SagaId: {}", GERENTE_CREATE_QUEUE, sagaId);
        return sagaId;
    }

    public String iniciarSagaGerenteDeletion(String cpf) {
        log.info("Iniciando saga de deleção de gerente. CPF: {}", cpf);
        String sagaId = java.util.UUID.randomUUID().toString();

        GerenteDeleteDto deleteDto = new GerenteDeleteDto(cpf);
        
        SagaMessage<GerenteDeleteDto> message = new SagaMessage<>(
                sagaId,
                "DELETE_GERENTE",
                EnStatusIntegracao.INICIADO,
                null,
                deleteDto
        );

        log.info("Enviando mensagem para fila: {}. SagaId: {}", GERENTE_DELETE_QUEUE, sagaId);
        rabbitTemplate.convertAndSend(GERENTE_DELETE_QUEUE, message);
        log.info("Mensagem enviada com sucesso para fila: {}. SagaId: {}", GERENTE_DELETE_QUEUE, sagaId);
        return sagaId;
    }
  
    public void iniciarSagaAlteracaoPerfilCliente(String cpf, ClienteDto dto) {

        dto.setCpf(cpf);

        SagaMessage<ClienteDto> message = new SagaMessage<>(
                java.util.UUID.randomUUID().toString(),
                CLIENTE_ALTERACAO_PERFIL_QUEUE,
                EnStatusIntegracao.INICIADO,
                null,
                dto
        );

        rabbitTemplate.convertAndSend(CLIENTE_ALTERACAO_PERFIL_QUEUE, message);

      }

    public String iniciarSagaGerenteUpdate(GerenteDto gerenteDto) {
        log.info("Iniciando saga de atualização de gerente. CPF: {}, Nome: {}", gerenteDto.cpf(), gerenteDto.nome());
        String sagaId = java.util.UUID.randomUUID().toString();

        SagaMessage<GerenteDto> message = new SagaMessage<>(
                sagaId,
                "UPDATE_GERENTE",
                EnStatusIntegracao.INICIADO,
                null,
                gerenteDto
        );

        log.info("Enviando mensagem para fila: {}. SagaId: {}", GERENTE_UPDATE_QUEUE, sagaId);
        rabbitTemplate.convertAndSend(GERENTE_UPDATE_QUEUE, message);
        log.info("Mensagem enviada com sucesso para fila: {}. SagaId: {}", GERENTE_UPDATE_QUEUE, sagaId);
        return sagaId;
    }
}
