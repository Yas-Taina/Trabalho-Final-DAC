package dac.ufpr.gerente.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import dac.ufpr.gerente.dto.BulkReassignDto;
import dac.ufpr.gerente.enums.EnStatusIntegracao;
import dac.ufpr.gerente.exception.mapper.ExceptionMapper;
import dac.ufpr.gerente.listener.dto.SagaMessage;
import dac.ufpr.gerente.repository.GerenteRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import static dac.ufpr.gerente.config.RabbitMqConfig.*;

@Component
@RequiredArgsConstructor
public class GerenteDeletionListener {

    private final Logger log = LoggerFactory.getLogger(GerenteDeletionListener.class);

    private final GerenteRepository repository;
    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = GERENTE_DELETE_QUEUE)
    public void listen(SagaMessage<?> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", GERENTE_DELETE_QUEUE, message);

        try {
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> data = (java.util.Map<String, Object>) message.getData();
            String cpf = (String) data.get("cpf");
            
            log.info("Deletando gerente com CPF: {}", cpf);
            
            if (!repository.existsByCpf(cpf)) {
                throw new RuntimeException("Gerente não encontrado: " + cpf);
            }

            repository.deleteByCpf(cpf);
            log.info("Gerente deletado com sucesso. CPF: {}", cpf);

            SagaMessage<String> response = new SagaMessage<>(
                    message.getSagaId(),
                    GERENTE_DELETE_QUEUE,
                    EnStatusIntegracao.SUCESSO,
                    null,
                    cpf);

            rabbitTemplate.convertAndSend(SAGA_GERENTE_DELETION_QUEUE, response);

            log.info("Iniciando saga de redistribuição de contas/clientes após deleção. CPF: {}", cpf);
            BulkReassignDto reassignDto = new BulkReassignDto();
            reassignDto.setOldGerenteCpf(cpf);
            
            SagaMessage<BulkReassignDto> reassignMessage = new SagaMessage<>(
                    message.getSagaId(),
                    "GERENTE_DELETED",
                    EnStatusIntegracao.SUCESSO,
                    null,
                    reassignDto);
            
            rabbitTemplate.convertAndSend(CONTA_REASSIGN_ON_DELETE_QUEUE, reassignMessage);

        } catch (Exception e) {
            log.error("Erro ao processar a mensagem para o tópico: {}. Erro: ", GERENTE_DELETE_QUEUE, e);

            SagaMessage<?> errorResponse = ExceptionMapper.mapExceptionToSagaMessage(
                    message.getSagaId(),
                    GERENTE_DELETE_QUEUE,
                    message.getData(),
                    e);

            rabbitTemplate.convertAndSend(SAGA_GERENTE_DELETION_QUEUE, errorResponse);
        }
    }
}
