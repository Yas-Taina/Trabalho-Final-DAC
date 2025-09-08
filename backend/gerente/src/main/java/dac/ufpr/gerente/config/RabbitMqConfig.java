package dac.ufpr.gerente.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.Declarable;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;

@Configuration
public class RabbitMqConfig {
    
    //Fila do Gerente
    public static final String GERENTE_CREATE_QUEUE = "gerente.create.queue";

    //Fila Saga
    public static final String SAGA_RESPONSE_QUEUE = "saga.response.queue";

    @Bean
    public Declarable gerenteQueue() {
        return new Queue(GERENTE_CREATE_QUEUE);
    }
    
}
