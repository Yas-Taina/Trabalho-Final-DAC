package dac.ufpr.conta.dto;

public record ContaDto(Long id, String numeroConta, Long clienteId, Long gerenteId, java.time.Instant dataCriacao, java.time.Instant dataAtualizacao, java.math.BigDecimal saldo, java.math.BigDecimal limite, Long versao) {

}
