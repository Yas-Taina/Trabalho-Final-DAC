package dac.ufpr.conta.exception.mapper;

import dac.ufpr.conta.enums.EnStatusIntegracao;
import dac.ufpr.conta.exception.CustomException;
import dac.ufpr.conta.messaging.dto.SagaMessage;
import org.springframework.stereotype.Component;

@Component
public class ExceptionMapper {

    public static SagaMessage<?> mapExceptionToSagaMessage(String sagaId, String step, Object data, Exception e) {
        if (e instanceof CustomException ce) {
        return new SagaMessage<>(
            sagaId,
            step,
            EnStatusIntegracao.FALHA,
            ce.getMessage(),
            data
        );
        }

    return new SagaMessage<>(
        sagaId,
        step,
        EnStatusIntegracao.FALHA,
        "Erro: " + e.getMessage(),
        data
    );
    }
}
