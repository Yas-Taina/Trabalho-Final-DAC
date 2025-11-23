package dac.ufpr.conta.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import dac.ufpr.conta.dto.BulkReassignDto;
import dac.ufpr.conta.enums.EnStatusIntegracao;
import dac.ufpr.conta.messaging.dto.SagaMessage;
import dac.ufpr.conta.service.ContaService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

import static dac.ufpr.conta.config.RabbitMqConfig.*;

@Component
@RequiredArgsConstructor
public class ContaDeletionReassignListener {

    private final Logger log = LoggerFactory.getLogger(ContaDeletionReassignListener.class);
    private final ContaService contaService;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = CONTA_REASSIGN_ON_DELETE_QUEUE)
    public void handleBulkReassign(SagaMessage<?> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", CONTA_REASSIGN_ON_DELETE_QUEUE, message);

        try {
            BulkReassignDto reassignData = objectMapper.convertValue(message.getData(), BulkReassignDto.class);
            String oldGerenteCpf = reassignData.getOldGerenteCpf();
            
            log.info("Iniciando redistribuição de contas do gerente deletado: {}. SagaId: {}", 
                    oldGerenteCpf, message.getSagaId());
            
            Map<String, Object> result = contaService.reassignAllContasOnDelete(oldGerenteCpf);
            
            List<Long> contaIds = (List<Long>) result.get("contaIds");
            List<Long> clienteIds = (List<Long>) result.get("clienteIds");
            String newGerenteCpf = (String) result.get("newGerenteCpf");
            
            log.info("Contas redistribuídas: {}. Clientes a serem reassigned: {}. Novo gerente: {}. SagaId: {}", 
                    contaIds.size(), clienteIds.size(), newGerenteCpf, message.getSagaId());
            
            BulkReassignDto clienteReassignDto = new BulkReassignDto();
            clienteReassignDto.setOldGerenteCpf(oldGerenteCpf);
            clienteReassignDto.setNewGerenteCpf(newGerenteCpf);

            SagaMessage<BulkReassignDto> clienteMessage = new SagaMessage<>(
                    message.getSagaId(),
                    "CONTAS_REASSIGNED",
                    EnStatusIntegracao.SUCESSO,
                    null,
                    clienteReassignDto
            );

            rabbitTemplate.convertAndSend(CLIENTE_REASSIGN_ON_DELETE_QUEUE, clienteMessage);
            log.info("Mensagem enviada para reassignment de clientes. SagaId: {}", message.getSagaId());

        } catch (Exception e) {
            log.error("Erro ao processar bulk reassignment de contas. SagaId: {}. Erro:", message.getSagaId(), e);
            
            SagaMessage<?> errorMessage = new SagaMessage<>(
                    message.getSagaId(),
                    "CONTA_BULK_REASSIGN",
                    EnStatusIntegracao.FALHA,
                    e.getMessage(),
                    message.getData()
            );
            
            rabbitTemplate.convertAndSend(SAGA_GERENTE_DELETION_QUEUE, errorMessage);
        }
    }
}
