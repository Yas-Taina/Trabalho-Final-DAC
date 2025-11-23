package dac.ufpr.conta.config;

import org.springframework.amqp.core.Declarable;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    // Rotina de autocadastro
    public static final String SAGA_AUTOCADASTRO_QUEUE = "saga.autocadastro.queue";

    // Topicos Sucesso
    public static final String CONTA_GERENTE_ASSIGN_QUEUE = "gerente.assign.queue";
    public static final String GERENTE_CADASTRO_REDISTRIBUTION_QUEUE = "gerente.cadastro.redistribution.queue";

    public static final String CONTA_REASSIGN_QUEUE = "conta.reassign.queue";
    public static final String CLIENTE_REASSIGN_QUEUE = "cliente.reassign.queue";
    public static final String SAGA_GERENTE_CREATION_QUEUE = "saga.gerente.creation.queue";

    // -- // -- //

    // Rotina de aprovação de cliente
    public static final String SAGA_CLIENTE_APPROVAL_QUEUE = "saga.cliente.approval.queue";

    // Topicos Sucesso
    public static final String CONTA_CREATE_QUEUE = "conta.create.queue";

    // Topicos Compensação
    public static final String CONTA_COMPENSATE_CREATE_QUEUE = "conta.compensate.create.queue";

    public static final String CONTA_REASSIGN_ON_DELETE_QUEUE = "conta.reassign.on.delete.queue";
    public static final String CLIENTE_REASSIGN_ON_DELETE_QUEUE = "cliente.reassign.on.delete.queue";
    public static final String SAGA_GERENTE_DELETION_QUEUE = "saga.gerente.deletion.queue";


    @Bean
    public Declarable contaQueue() {
        return new Queue(CONTA_CREATE_QUEUE);
    }

    @Bean
    public Declarable gerenteAssignQueue() {
        return new Queue(CONTA_GERENTE_ASSIGN_QUEUE);
    }

    @Bean
    public Declarable sagaAutocadastroQueue() {
        return new Queue(SAGA_AUTOCADASTRO_QUEUE);
    }

    @Bean
    public Declarable contaReassignQueue() {
        return new Queue(CONTA_REASSIGN_QUEUE);
    }

    @Bean
    public Declarable contaReassignOnDeleteQueue() {
        return new Queue(CONTA_REASSIGN_ON_DELETE_QUEUE);
    }


    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                         Jackson2JsonMessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(converter);
        return template;
    }
}
