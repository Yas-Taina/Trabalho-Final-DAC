package dac.ufpr.gerente.model;

import java.io.Serializable;

// No changes needed, this class is well-defined.
public class Gerente implements Serializable {
    private String cpf;
    private String nome;
    private String email;
    private String senha;
    private String tipo;

    // 1. Construtor padrão (boa prática)
    public Gerente() {
    }

    // 2. Construtor parametrizado que você já está usando
    public Gerente(String cpf, String nome, String email, String senha, String tipo) {
        this.cpf = cpf;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
    }

    // 3. GETTERS PÚBLICOS PARA TODOS OS CAMPOS (ESSA É A PARTE CRÍTICA)
    public String getCpf() {
        return cpf;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getSenha() {
        return senha;
    }

    public String getTipo() {
        return tipo;
    }
    
    // 4. SETTERS PÚBLICOS (Necessários para o @PutMapping e @PostMapping)
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}