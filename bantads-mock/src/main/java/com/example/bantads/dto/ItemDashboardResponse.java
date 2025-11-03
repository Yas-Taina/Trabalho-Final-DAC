package com.example.bantads.dto;
public class ItemDashboardResponse {
    private String nome;
    private Double saldo;
    private Double limite;
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Double getSaldo() { return saldo; }
    public void setSaldo(Double saldo) { this.saldo = saldo; }
    public Double getLimite() { return limite; }
    public void setLimite(Double limite) { this.limite = limite; }
}
