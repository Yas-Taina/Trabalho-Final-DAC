package dac.ufpr.cliente.listener.dto;

import dac.ufpr.cliente.dto.ClienteDto;
import dac.ufpr.cliente.enums.EnStatusIntegracao;
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
