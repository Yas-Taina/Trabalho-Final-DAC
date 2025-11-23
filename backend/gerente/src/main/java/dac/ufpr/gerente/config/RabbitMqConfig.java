package dac.ufpr.gerente.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.Declarable;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.DefaultClassMapper;
import org.springframework.context.annotation.Bean;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RabbitMqConfig {
    
    //Fila do Gerente
    public static final String GERENTE_CREATE_QUEUE = "gerente.create.queue";
    public static final String GERENTE_DELETE_QUEUE = "gerente.delete.queue";

    //Filas Auth
    public static final String AUTH_CREATE_QUEUE = "auth.gerente.create.queue";
    public static final String AUTH_DELETE_QUEUE = "auth.gerente.delete.queue";

    //Fila Saga
    public static final String SAGA_RESPONSE_QUEUE = "saga.response.queue";
    public static final String SAGA_GERENTE_CREATION_QUEUE = "saga.gerente.creation.queue";
    public static final String SAGA_GERENTE_DELETION_QUEUE = "saga.gerente.deletion.queue";
    public static final String CONTA_REASSIGN_QUEUE = "conta.reassign.queue";
    
    //Fila Auth
    public static final String AUTH_CREATE_QUEUE = "auth.gerente.create.queue";
    public static final String CONTA_REASSIGN_ON_DELETE_QUEUE = "conta.reassign.on.delete.queue";

    @Bean
    public Declarable gerenteCreateQueue() {
        return new Queue(GERENTE_CREATE_QUEUE);
    }

    @Bean
    public Declarable gerenteDeleteQueue() {
        return new Queue(GERENTE_DELETE_QUEUE);
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
    public Jackson2JsonMessageConverter messageConverter(ObjectMapper objectMapper) {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter(objectMapper);
        
        DefaultClassMapper classMapper = new DefaultClassMapper();
        Map<String, Class<?>> idClassMapping = new HashMap<>();
        idClassMapping.put("dac.ufpr.Saga.listener.dto.SagaMessage", dac.ufpr.gerente.listener.dto.SagaMessage.class);
        classMapper.setIdClassMapping(idClassMapping);
        classMapper.setTrustedPackages("dac.ufpr.*");
        
        converter.setClassMapper(classMapper);
        return converter;
    }
    
}
