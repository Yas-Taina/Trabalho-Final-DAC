package dac.ufpr.conta.exception.mapper;

import org.springframework.stereotype.Component;

import dac.ufpr.conta.enums.EnStatusIntegracao;
import dac.ufpr.conta.exception.CustomException;
import dac.ufpr.conta.listener.dto.SagaMessage;

@Component
public class ExceptionMapper {

        public static SagaMessage<?> mapExceptionToSagaMessage(String sagaId, String step, Object data, Exception e) {
        if (e instanceof CustomException ce) {
            return new SagaMessage<>(
                    sagaId,
                    step,
                    EnStatusIntegracao.FALHA,
                    ce.getMessage(),
                    data,
                    ce.getHttpStatus()
            );
        }

        return new SagaMessage<>(
                sagaId,
                step,
                EnStatusIntegracao.FALHA,
                "Erro: " + e.getMessage(),
                data,
                500
        );
    }
}
