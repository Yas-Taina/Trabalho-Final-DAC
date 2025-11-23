package dac.ufpr.cliente.config;

import org.springframework.amqp.core.Declarable;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    // Filas Cliente
    public static final String CLIENTE_CREATE_QUEUE = "cliente.create.queue";
    public static final String CLIENTE_APPROVAL_QUEUE = "cliente.approval.queue";

    // Filas de Compensação
    public static final String CLIENTE_COMPENSATE_APPROVAL_QUEUE = "cliente.compensate.approval.queue";
    public static final String CLIENTE_COMPENSATE_CREATE_QUEUE = "cliente.compensate.create.queue";

    // Fila Saga
    public static final String SAGA_AUTOCADASTRO_QUEUE = "saga.autocadastro.queue";
    public static final String SAGA_CLIENTE_APPROVAL_QUEUE = "saga.cliente.approval.queue";

    // Fila Saga Gerente
    public static final String CLIENTE_REASSIGN_QUEUE = "cliente.reassign.queue";
    public static final String SAGA_GERENTE_CREATION_QUEUE = "saga.gerente.creation.queue";
    public static final String CLIENTE_REASSIGN_ON_DELETE_QUEUE = "cliente.reassign.on.delete.queue";
    public static final String SAGA_GERENTE_DELETION_QUEUE = "saga.gerente.deletion.queue";

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public Declarable clienteQueue() {
        return new Queue(CLIENTE_CREATE_QUEUE);
    }

    @Bean
    public Declarable clienteApprovalQueue() {
        return new Queue(CLIENTE_APPROVAL_QUEUE);
    }

    @Bean
    public Declarable clienteReassignQueue() {
        return new Queue(CLIENTE_REASSIGN_QUEUE);
    }
  
    @Bean
    public Declarable clienteCompensateApprovalQueue() {
        return new Queue(CLIENTE_COMPENSATE_APPROVAL_QUEUE);
    }

    @Bean
    public Declarable clienteReassignOnDeleteQueue() {
        return new Queue(CLIENTE_REASSIGN_ON_DELETE_QUEUE);
    }

    @Bean
    public Declarable clienteCompensateCreateQueue() {
        return new Queue(CLIENTE_COMPENSATE_CREATE_QUEUE);
    }


}
