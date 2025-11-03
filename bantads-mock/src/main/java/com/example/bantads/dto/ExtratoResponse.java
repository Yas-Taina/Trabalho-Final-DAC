package com.example.bantads.dto;
import java.util.List;
public class ExtratoResponse {
    private String conta;
    private Double saldo;
    private List<ItemExtratoResponse> operacoes;
    public String getConta() { return conta; }
    public void setConta(String conta) { this.conta = conta; }
    public Double getSaldo() { return saldo; }
    public void setSaldo(Double saldo) { this.saldo = saldo; }
    public List<ItemExtratoResponse> getOperacoes() { return operacoes; }
    public void setOperacoes(List<ItemExtratoResponse> operacoes) { this.operacoes = operacoes; }
}
