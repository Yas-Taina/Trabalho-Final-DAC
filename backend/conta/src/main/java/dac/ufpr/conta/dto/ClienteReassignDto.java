package dac.ufpr.conta.dto;

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
