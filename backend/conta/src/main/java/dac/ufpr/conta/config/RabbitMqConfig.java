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

    public static final String CONTA_CREATE_QUEUE = "conta.create.queue";
    public static final String SAGA_AUTOCADASTRO_QUEUE = "saga.autocadastro.queue";
    public static final String CONTA_GERENTE_ASSIGN_QUEUE = "gerente.assign.queue";


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
