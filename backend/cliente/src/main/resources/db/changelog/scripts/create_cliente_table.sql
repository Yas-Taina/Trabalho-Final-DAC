CREATE TABLE IF NOT EXISTS cliente.cliente (
                                               id BIGSERIAL PRIMARY KEY,
                                               nome VARCHAR(255) NOT NULL,
                                               cpf VARCHAR(11) UNIQUE NOT NULL,
                                               email VARCHAR(255) UNIQUE NOT NULL,
                                               telefone VARCHAR(20),
                                               salario NUMERIC(15,2),
                                               endereco VARCHAR(255),
                                               cep VARCHAR(8),
                                               cidade VARCHAR(100),
                                               estado VARCHAR(2)
);