package dac.ufpr.cliente.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import dac.ufpr.cliente.dto.BulkReassignDto;
import dac.ufpr.cliente.enums.EnStatusIntegracao;
import dac.ufpr.cliente.listener.dto.SagaMessage;
import dac.ufpr.cliente.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import static dac.ufpr.cliente.config.RabbitMqConfig.CLIENTE_REASSIGN_ON_DELETE_QUEUE;
import static dac.ufpr.cliente.config.RabbitMqConfig.SAGA_GERENTE_DELETION_QUEUE;

@Component
@RequiredArgsConstructor
public class ClienteDeletionReassignListener {

    private final Logger log = LoggerFactory.getLogger(ClienteDeletionReassignListener.class);
    private final ClienteService clienteService;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = CLIENTE_REASSIGN_ON_DELETE_QUEUE)
    public void handleBulkClienteReassign(SagaMessage<?> message) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", CLIENTE_REASSIGN_ON_DELETE_QUEUE, message);

        try {
            BulkReassignDto reassignData = objectMapper.convertValue(message.getData(), BulkReassignDto.class);
            
            String oldGerenteCpf = reassignData.getOldGerenteCpf();
            String newGerenteCpf = reassignData.getNewGerenteCpf();
            
            log.info("Iniciando bulk reassignment de clientes do gerente {} para gerente {}. SagaId: {}", 
                    oldGerenteCpf,
                    newGerenteCpf,
                    message.getSagaId());
            
            clienteService.reassignMultipleClientesToGerente(oldGerenteCpf, newGerenteCpf);
            
            log.info("Bulk cliente reassignment concluído. SagaId: {}", message.getSagaId());

            SagaMessage<BulkReassignDto> successMessage = new SagaMessage<>(
                    message.getSagaId(),
                    "CLIENTES_REASSIGNED",
                    EnStatusIntegracao.SUCESSO,
                    null,
                    reassignData
            );

            rabbitTemplate.convertAndSend(SAGA_GERENTE_DELETION_QUEUE, successMessage);

        } catch (Exception e) {
            log.error("Erro ao fazer bulk reassignment de clientes. SagaId: {}. Erro:", message.getSagaId(), e);
            
            SagaMessage<?> errorMessage = new SagaMessage<>(
                    message.getSagaId(),
                    "CLIENTE_BULK_REASSIGN",
                    EnStatusIntegracao.FALHA,
                    e.getMessage(),
                    message.getData()
            );
            
            rabbitTemplate.convertAndSend(SAGA_GERENTE_DELETION_QUEUE, errorMessage);
        }
    }
}
