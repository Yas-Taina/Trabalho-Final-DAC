package dac.ufpr.cliente.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteReassignDto {
    private Long clienteId;
    private String novoGerenteCpf;
}
