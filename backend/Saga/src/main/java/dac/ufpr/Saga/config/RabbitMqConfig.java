package dac.ufpr.Saga.config;

import org.springframework.amqp.core.Declarable;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    // Rotina de autocadastro
    public static final String SAGA_AUTOCADASTRO_QUEUE = "saga.autocadastro.queue";

    //Topicos Sucesso
    public static final String CONTA_GERENTE_ASSIGN_QUEUE = "gerente.assign.queue";
    public static final String CLIENTE_CREATE_QUEUE = "cliente.create.queue";
    public static final String AUTH_CREATE_QUEUE = "auth.create.queue";

    //Topicos Compensação
    public static final String CLIENTE_COMPENSATE_CREATE_QUEUE = "cliente.compensate.create.queue";

    // -- // -- //

    // Rotina de aprovação de cliente

    //Saga
    public static final String SAGA_CLIENTE_APPROVAL_QUEUE = "saga.cliente.approval.queue";

    //Topicos Sucesso
    public static final String CLIENTE_APPROVAL_QUEUE = "cliente.approval.queue";
    public static final String CONTA_CREATE_QUEUE = "conta.create.queue";
    public static final String AUTH_UPDATE_QUEUE = "auth.update.queue";

    //Topicos Compensação
    public static final String CLIENTE_COMPENSATE_APPROVAL_QUEUE = "cliente.compensate.approval.queue";
    public static final String CONTA_COMPENSATE_CREATE_QUEUE = "conta.compensate.create.queue";
    public static final String AUTH_COMPENSATE_UPDATE_QUEUE = "auth.compensate.update.queue";

    // -- // -- //

    //Saga
    public static final String SAGA_GERENTE_CREATION_QUEUE = "saga.gerente.creation.queue";

    public static final String GERENTE_CREATE_QUEUE = "gerente.create.queue";
    public static final String CONTA_REASSIGN_QUEUE = "conta.reassign.queue";
    public static final String CLIENTE_REASSIGN_QUEUE = "cliente.reassign.queue";

    public static final String SAGA_GERENTE_DELETION_QUEUE = "saga.gerente.deletion.queue";
    public static final String GERENTE_DELETE_QUEUE = "gerente.delete.queue";
    public static final String CONTA_REASSIGN_ON_DELETE_QUEUE = "conta.reassign.on.delete.queue";
    public static final String CLIENTE_REASSIGN_ON_DELETE_QUEUE = "cliente.reassign.on.delete.queue";


    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public Declarable clienteQueue() {
        return new Queue(SAGA_AUTOCADASTRO_QUEUE);
    }

    @Bean
    public Declarable gerenteAssignQueue() {
        return new Queue(CONTA_GERENTE_ASSIGN_QUEUE);
    }

    @Bean
    public Declarable sagaClienteApprovalQueue() {
        return new Queue(SAGA_CLIENTE_APPROVAL_QUEUE);
    }

    @Bean
    public Declarable clienteApprovalQueue() {
        return new Queue(CLIENTE_APPROVAL_QUEUE);
    }

    @Bean
    public Declarable sagaGerenteCreationQueue() {
        return new Queue(SAGA_GERENTE_CREATION_QUEUE);
    }

    @Bean
    public Declarable gerenteCreateQueue() {
        return new Queue(GERENTE_CREATE_QUEUE);
    }

}
