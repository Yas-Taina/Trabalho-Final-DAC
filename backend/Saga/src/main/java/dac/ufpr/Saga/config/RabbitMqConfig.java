package dac.ufpr.Saga.config;

import org.springframework.amqp.core.Declarable;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    public static final String SAGA_AUTOCADASTRO_QUEUE = "saga.autocadastro.queue";

    public static final String CLIENTE_CREATE_QUEUE = "cliente.create.queue";
    public static final String AUTH_CREATE_QUEUE = "auth.create.queue";
    public static final String CONTA_CREATE_QUEUE = "conta.create.queue";
    public static final String GERENTE_ASSIGN_QUEUE = "gerente.assign.queue";

    public static final String CLIENTE_DELETE_QUEUE = "cliente.delete.queue";
    public static final String AUTH_DELETE_QUEUE = "auth.delete.queue";
    public static final String CONTA_DELETE_QUEUE = "conta.delete.queue";

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public Declarable clienteQueue() {
        return new Queue(SAGA_AUTOCADASTRO_QUEUE);
    }
}
