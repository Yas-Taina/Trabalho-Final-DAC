package dac.ufpr.Saga.listener;

import dac.ufpr.Saga.enums.EnStatusIntegracao;
import dac.ufpr.Saga.listener.dto.SagaMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static dac.ufpr.Saga.config.RabbitMqConfig.SAGA_GERENTE_DELETION_QUEUE;


@Component
@RequiredArgsConstructor
public class SagaGerenteDeletionListener {

    private final Logger log = LoggerFactory.getLogger(SagaGerenteDeletionListener.class);

    @RabbitListener(queues = SAGA_GERENTE_DELETION_QUEUE)
    public void handleSagaStatus(SagaMessage<?> message) {
        log.info("Saga Gerente Deletion - Status recebido. SagaId: {}, Step: {}, Status: {}", 
                message.getSagaId(), 
                message.getStep(), 
                message.getStatus());

        if (message.getStatus() == EnStatusIntegracao.FALHA) {
            log.error("Saga Gerente Deletion - Falha detectada. SagaId: {}, Step: {}, Error: {}", 
                    message.getSagaId(), 
                    message.getStep(), 
                    message.getError());
            
            handleSagaFailure(message);
            return;
        }

        if (message.getStatus() == EnStatusIntegracao.SUCESSO) {
            switch (message.getStep()) {
                case "GERENTE_DELETED":
                    log.info("Saga Gerente Deletion - Gerente deletado com sucesso. SagaId: {}", message.getSagaId());
                    break;
                    
                case "CONTAS_REASSIGNED":
                    log.info("Saga Gerente Deletion - Contas redistribuídas. SagaId: {}", message.getSagaId());
                    break;
                    
                case "CLIENTES_REASSIGNED":
                    log.info("Saga Gerente Deletion - Clientes reassigned com sucesso. SagaId: {}", message.getSagaId());
                    handleSagaSuccess(message);
                    break;
                    
                default:
                    log.warn("Saga Gerente Deletion - Step desconhecido: {}. SagaId: {}", 
                            message.getStep(), 
                            message.getSagaId());
            }
        }
    }

    private void handleSagaSuccess(SagaMessage<?> message) {
        log.info("Saga Gerente Deletion finalizada com sucesso. SagaId: {}", message.getSagaId());
    }

    private void handleSagaFailure(SagaMessage<?> message) {
        log.error("Saga Gerente Deletion falhou. SagaId: {}, Step: {}", 
                message.getSagaId(), 
                message.getStep());
        
        switch (message.getStep()) {
            case "GERENTE_DELETE_QUEUE":
                log.error("Falha na deleção do gerente. Gerente pode não existir ou já estar deletado.");
                break;
                
            case "CONTA_BULK_REASSIGN":
                log.error("Falha no reassignment de contas. Gerente foi deletado mas contas não foram redistribuídas.");
                log.error("AÇÃO NECESSÁRIA: Verificar contas órfãs e reassign manualmente.");
                break;
                
            case "CLIENTE_BULK_REASSIGN":
                log.error("Falha no reassignment de clientes. Contas foram redistribuídas mas clientes não foram atualizados.");
                log.error("AÇÃO NECESSÁRIA: Verificar clientes e atualizar referências de gerente.");
                break;
                
            default:
                log.error("Falha em step desconhecido: {}", message.getStep());
        }
    }
}
