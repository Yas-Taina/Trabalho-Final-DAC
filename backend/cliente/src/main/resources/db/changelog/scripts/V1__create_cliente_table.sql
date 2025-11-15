CREATE TABLE IF NOT EXISTS cliente.cliente (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    salario NUMERIC(15,2),
    endereco VARCHAR(100),
    cep VARCHAR(8),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    motivo_rejeicao VARCHAR(255),
    data_alteracao TIMESTAMP default now(), 
    status VARCHAR(20),
    cpf_gerente VARCHAR(15)
);