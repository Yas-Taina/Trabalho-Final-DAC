package dac.ufpr.Saga.listener;

import dac.ufpr.Saga.dto.ClienteDto;
import dac.ufpr.Saga.enums.EnStatusIntegracao;
import dac.ufpr.Saga.listener.dto.SagaMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static dac.ufpr.Saga.config.RabbitMqConfig.SAGA_GERENTE_CREATION_QUEUE;

/**
 * Listener for Gerente Creation Saga orchestration.
 * Receives status updates from conta and cliente services.
 */
@Component
@RequiredArgsConstructor
public class SagaGerenteCreationListener {

    private final Logger log = LoggerFactory.getLogger(SagaGerenteCreationListener.class);

    /**
     * Listens to saga gerente creation queue for status updates.
     * 
     * Expected messages:
     * - CONTA_REASSIGNED: Conta was reassigned and clienteId sent to cliente service
     * - CLIENTE_REASSIGNED: Cliente was successfully reassigned
     * - Errors from conta or cliente services
     */
    @RabbitListener(queues = SAGA_GERENTE_CREATION_QUEUE)
    public void handleSagaStatus(SagaMessage<?> message) {
        log.info("Saga Gerente Creation - Status recebido. SagaId: {}, Step: {}, Status: {}", 
                message.getSagaId(), 
                message.getStep(), 
                message.getStatus());

        if (message.getStatus() == EnStatusIntegracao.FALHA) {
            log.error("Saga Gerente Creation - Falha detectada. SagaId: {}, Step: {}, Error: {}", 
                    message.getSagaId(), 
                    message.getStep(), 
                    message.getError());
            
            // TODO: Implement compensation logic
            // Depending on which step failed, you may need to:
            // 1. Rollback conta reassignment
            // 2. Rollback cliente reassignment
            // 3. Possibly delete the created gerente
            
            handleSagaFailure(message);
            return;
        }

        if (message.getStatus() == EnStatusIntegracao.SUCESSO) {
            switch (message.getStep()) {
                case "NO_REASSIGNMENT_NEEDED":
                    log.info("Saga Gerente Creation - Nenhuma conta para reassign. SagaId: {}", message.getSagaId());
                    // First gerente or only one gerente with one conta - saga completes successfully without reassignment
                    handleSagaSuccess(message);
                    break;
                    
                case "CONTA_REASSIGNED":
                    log.info("Saga Gerente Creation - Conta reassigned. SagaId: {}", message.getSagaId());
                    // Conta service reassigned the conta and sent clienteId to cliente service
                    // Waiting for cliente service response
                    break;
                    
                case "CLIENTE_REASSIGNED":
                    log.info("Saga Gerente Creation - Cliente reassigned com sucesso. SagaId: {}", message.getSagaId());
                    // Saga completed successfully
                    handleSagaSuccess(message);
                    break;
                    
                default:
                    log.warn("Saga Gerente Creation - Step desconhecido: {}. SagaId: {}", 
                            message.getStep(), 
                            message.getSagaId());
            }
        }
    }

    /**
     * Handles successful saga completion.
     */
    private void handleSagaSuccess(SagaMessage<?> message) {
        log.info("Saga Gerente Creation finalizada com sucesso. SagaId: {}", message.getSagaId());
        
        // TODO: Optional - Send notification, update status, etc.
        // Example: Send email to gerente with assigned clientes
        // Example: Update gerente status to ACTIVE
    }

    /**
     * Handles saga failure and implements compensation logic.
     */
    private void handleSagaFailure(SagaMessage<?> message) {
        log.error("Saga Gerente Creation falhou. SagaId: {}, Step: {}", 
                message.getSagaId(), 
                message.getStep());
        
        // TODO: Implement compensation based on the step that failed
        switch (message.getStep()) {
            case "CONTA_REASSIGN":
                // Failed to find conta or get clienteId
                log.error("Falha no reassignment de conta. Não há ações de compensação necessárias.");
                break;
                
            case "CLIENTE_REASSIGN":
                // Failed to reassign cliente
                // May need to rollback conta reassignment if it was done
                log.error("Falha no reassignment de cliente. Considerar rollback de conta.");
                // TODO: Implement rollback logic
                break;
                
            default:
                log.error("Falha em step desconhecido: {}", message.getStep());
        }
        
        // TODO: Optional - Send failure notification
        // Example: Send email to admin about failed gerente creation saga
    }
}
