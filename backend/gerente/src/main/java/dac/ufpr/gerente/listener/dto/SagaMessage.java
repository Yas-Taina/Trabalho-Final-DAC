package dac.ufpr.gerente.listener.dto;

import dac.ufpr.gerente.enums.EnStatusIntegracao;
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
