package dac.ufpr.conta.messaging;

import dac.ufpr.conta.dto.ClienteDto;
import dac.ufpr.conta.dto.ContaDto;
import dac.ufpr.conta.enums.EnStatusIntegracao;
import dac.ufpr.conta.exception.mapper.ExceptionMapper;
import dac.ufpr.conta.messaging.dto.SagaMessage;
import dac.ufpr.conta.service.ContaService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import static dac.ufpr.conta.config.RabbitMqConfig.*;
import static dac.ufpr.conta.config.RabbitMqConfig.CONTA_COMPENSATE_CREATE_QUEUE;

@Component
@RequiredArgsConstructor
public class ContaAlteracaoPerfilListener {

    private final Logger log = LoggerFactory.getLogger(ContaAlteracaoPerfilListener.class);

    private final RabbitTemplate rabbitTemplate;

    private final ContaService service;

    @RabbitListener(queues = CONTA_ALTERACAO_PERFIL_QUEUE)
    public void listener(SagaMessage<ClienteDto> sagaMessage) {
        log.info("Mensagem recebida para tópico: {}. Payload: {}", CONTA_ALTERACAO_PERFIL_QUEUE, sagaMessage);

        try {
            ContaDto contaDto = service.atualizar(sagaMessage.getData());

            log.info("Conta atualizada com sucesso: {}", contaDto);

            SagaMessage<ClienteDto> response = new SagaMessage<>(
                    sagaMessage.getSagaId(),
                    CONTA_ALTERACAO_PERFIL_QUEUE,
                    EnStatusIntegracao.SUCESSO,
                    null,
                    sagaMessage.getData()
            );

            rabbitTemplate.convertAndSend(SAGA_CLIENTE_ALTERACAO_PERFIL_QUEUE, response);
        } catch (Exception e) {
            log.error("Erro ao processar mensagem para tópico: {}. Erro: ", CONTA_CREATE_QUEUE, e);

            SagaMessage<?> response = ExceptionMapper.mapExceptionToSagaMessage(
                    sagaMessage.getSagaId(),
                    CONTA_ALTERACAO_PERFIL_QUEUE,
                    sagaMessage.getData(),
                    e
            );

            rabbitTemplate.convertAndSend(SAGA_CLIENTE_ALTERACAO_PERFIL_QUEUE, response);
        }
    }

//    @RabbitListener(queues = CONTA_COMPENSATE_CREATE_QUEUE)
//    public void compensate(SagaMessage<ClienteDto> sagaMessage) {
//        log.info("Mensagem de compensação recebida para tópico: {}. Payload: {}", CONTA_COMPENSATE_CREATE_QUEUE, sagaMessage);
//
//        try {
//            service.deletar(sagaMessage.getData());
//
//            log.info("Compensação da conta realizada com sucesso para o cliente: {}", sagaMessage.getData());
//        } catch (Exception e) {
//            log.error("Erro ao processar mensagem de compensação para tópico: {}. Erro: ", CONTA_COMPENSATE_CREATE_QUEUE, e);
//        }
//    }

}

