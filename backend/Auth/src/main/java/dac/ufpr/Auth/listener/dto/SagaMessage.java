package dac.ufpr.Auth.listener.dto;

import dac.ufpr.Auth.enums.EnStatusIntegracao;
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
        private Integer httpStatus;
        private Long gerenteId;
}
