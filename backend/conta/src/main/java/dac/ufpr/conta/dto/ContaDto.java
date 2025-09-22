package dac.ufpr.conta.dto;

public record ContaDto (
    Long id,
    String numeroConta,
    Long clienteId,
    Long gerenteId,
    String dataCriacao,
    String dataAtualizacao,
    String saldo,
    String limite,
    Long versao
){

}
