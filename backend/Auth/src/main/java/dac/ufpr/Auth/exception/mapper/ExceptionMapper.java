package dac.ufpr.Auth.exception.mapper;

import dac.ufpr.Auth.enums.EnStatusIntegracao;
import dac.ufpr.Auth.exception.CustomException;
import dac.ufpr.Auth.listener.dto.SagaMessage;
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
            data,
            ce.getHttpStatus(),
            null
        );
        }

    return new SagaMessage<>(
        sagaId,
        step,
        EnStatusIntegracao.FALHA,
        "Erro: " + e.getMessage(),
        data,
        500,
        null
    );
    }
}
