package dac.ufpr.cliente.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkReassignDto {
    private String oldGerenteCpf;
    private String newGerenteCpf;
}
