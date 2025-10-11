package dac.ufpr.conta.config;

import org.springframework.amqp.core.Declarable;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    // Fila conta
    public static final String CONTA_CREATE_QUEUE = "conta.create.queue";

    // Fila Saga
    public static final String SAGA_RESPONSE_QUEUE = "saga.response.queue";

    @Bean
    public Declarable contaQueue() {
    return new Queue(CONTA_CREATE_QUEUE);
    }
}
