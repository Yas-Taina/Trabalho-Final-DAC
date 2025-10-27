package dac.ufpr.gerente.exception.mapper;

import org.springframework.stereotype.Component;

import dac.ufpr.gerente.enums.EnStatusIntegracao;
import dac.ufpr.gerente.exception.CustomException;
import dac.ufpr.gerente.listener.dto.SagaMessage;

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
