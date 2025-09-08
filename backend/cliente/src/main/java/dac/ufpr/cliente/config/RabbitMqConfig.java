package dac.ufpr.cliente.config;

import org.springframework.amqp.core.Declarable;
import org.springframework.amqp.core.Declarables;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    // Filas Cliente
    public static final String CLIENTE_CREATE_QUEUE = "cliente.create.queue";

    // Fila Saga
    public static final String SAGA_RESPONSE_QUEUE = "saga.response.queue";

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public Declarable clienteQueue() {
        return new Queue(CLIENTE_CREATE_QUEUE);
    }


}
