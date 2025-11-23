package dac.ufpr.gerente.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "gerente", schema = "gerente")
public class Gerente {

    @Id
    private String cpf;

    private String nome;

    private String email;

    private String tipo;

    // No-args constructor for JPA
    public Gerente() {
    }

    // All-args constructor
    public Gerente(String cpf, String nome, String email, String tipo) {
        this.cpf = cpf;
        this.nome = nome;
        this.email = email;
        this.tipo = tipo;
    }

    // Manual getters and setters
    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}
