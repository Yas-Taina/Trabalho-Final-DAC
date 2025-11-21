package dac.ufpr.conta.messaging.dto;

import dac.ufpr.conta.enums.EnStatusIntegracao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SagaMessage<T> {
    private String sagaId;
    private String step;
    private EnStatusIntegracao status;
    private String error;
    private T data;
}
