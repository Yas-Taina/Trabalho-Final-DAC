package com.example.bantads.dto;
public class SaldoResponse {
    private String cliente;
    private String conta;
    private Double saldo;
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    public String getConta() { return conta; }
    public void setConta(String conta) { this.conta = conta; }
    public Double getSaldo() { return saldo; }
    public void setSaldo(Double saldo) { this.saldo = saldo; }
}
