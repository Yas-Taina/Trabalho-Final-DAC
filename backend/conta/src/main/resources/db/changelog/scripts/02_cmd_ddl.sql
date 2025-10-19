-- 02_cmd_ddl.sql  (schema conta)
CREATE TABLE conta.conta (
  id UUID PRIMARY KEY,
  numero_conta VARCHAR(10) UNIQUE NOT NULL,
  cliente_id UUID NOT NULL,        -- ID vindo do MS Cliente (sem FK cross-service)
  gerente_id  UUID NOT NULL,
  data_criacao TIMESTAMP NOT NULL,
  saldo NUMERIC(18,2) NOT NULL DEFAULT 0,
  limite NUMERIC(18,2) NOT NULL DEFAULT 0,
  versao BIGINT NOT NULL DEFAULT 0 -- otimista
);

CREATE TABLE conta.movimento (
  id UUID PRIMARY KEY,
  conta_id UUID NOT NULL,
  data_hora TIMESTAMP NOT NULL,
  tipo VARCHAR(20) NOT NULL,       -- DEPOSITO | SAQUE | TRANSFERENCIA
  origem_conta VARCHAR(10),
  destino_conta VARCHAR(10),
  valor NUMERIC(18,2) NOT NULL CHECK (valor > 0),
  CONSTRAINT fk_conta FOREIGN KEY(conta_id) REFERENCES conta.conta(id)
);

-- índice úteis
CREATE INDEX idx_conta_numero ON conta.conta (numero_conta);
CREATE INDEX idx_mov_conta_data ON conta.movimento (conta_id, data_hora);
