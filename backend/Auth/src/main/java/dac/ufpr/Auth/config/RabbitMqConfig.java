package dac.ufpr.Auth.config;

import org.springframework.amqp.core.Declarable;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    // Filas Auth
    public static final String AUTH_CREATE_QUEUE = "auth.create.queue";

    // Fila Saga
    public static final String SAGA_AUTOCADASTRO_QUEUE = "saga.autocadastro.queue";

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public Declarable authQueue() {
        return new Queue(AUTH_CREATE_QUEUE);
    }
}
