package com.example.bantads.dto;
public class TransferenciaResponse {
    private String origem;
    private String destino;
    private Double valor;
    private String data;
    public String getOrigem() { return origem; }
    public void setOrigem(String origem) { this.origem = origem; }
    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
}
