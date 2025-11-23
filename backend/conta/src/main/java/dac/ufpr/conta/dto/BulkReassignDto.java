package dac.ufpr.conta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BulkReassignDto {
    private String oldGerenteCpf;
    private String newGerenteCpf;
}
