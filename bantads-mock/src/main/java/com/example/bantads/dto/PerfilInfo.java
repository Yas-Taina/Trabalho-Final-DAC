package com.example.bantads.dto;
public class PerfilInfo {
    private String nome;
    private String email;
    private Double salario;
    private String endereco;
    private String CEP;
    private String cidade;
    private String estado;
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Double getSalario() { return salario; }
    public void setSalario(Double salario) { this.salario = salario; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public String getCEP() { return CEP; }
    public void setCEP(String CEP) { this.CEP = CEP; }
    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
