package com.example.bantads.dto;
public class ContaResponse {
    private String cliente;
    private String numero;
    private Double saldo;
    private Double limite;
    private String gerente;
    private String criacao;
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public Double getSaldo() { return saldo; }
    public void setSaldo(Double saldo) { this.saldo = saldo; }
    public Double getLimite() { return limite; }
    public void setLimite(Double limite) { this.limite = limite; }
    public String getGerente() { return gerente; }
    public void setGerente(String gerente) { this.gerente = gerente; }
    public String getCriacao() { return criacao; }
    public void setCriacao(String criacao) { this.criacao = criacao; }
}
