package com.example.bantads.dto;
import java.util.List;
public class DashboardResponse {
    private String gerente;
    private Integer totalClientes;
    private Double somaSaldos;
    private Double somaLimites;
    private List<ItemDashboardResponse> clientes;
    public String getGerente() { return gerente; }
    public void setGerente(String gerente) { this.gerente = gerente; }
    public Integer getTotalClientes() { return totalClientes; }
    public void setTotalClientes(Integer totalClientes) { this.totalClientes = totalClientes; }
    public Double getSomaSaldos() { return somaSaldos; }
    public void setSomaSaldos(Double somaSaldos) { this.somaSaldos = somaSaldos; }
    public Double getSomaLimites() { return somaLimites; }
    public void setSomaLimites(Double somaLimites) { this.somaLimites = somaLimites; }
    public List<ItemDashboardResponse> getClientes() { return clientes; }
    public void setClientes(List<ItemDashboardResponse> clientes) { this.clientes = clientes; }
}
