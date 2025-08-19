package dac.ufpr.cliente.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    public static final String CLIENTE_QUEUE = "cliente.queue";
}
