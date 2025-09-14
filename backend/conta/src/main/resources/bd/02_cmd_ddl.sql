-- 02_cmd_ddl.sql  (schema conta_cmd)
CREATE TABLE conta_cmd.conta (
  id UUID PRIMARY KEY,
  numero_conta VARCHAR(10) UNIQUE NOT NULL,
  cliente_id UUID NOT NULL,        -- ID vindo do MS Cliente (sem FK cross-service)
  gerente_id  UUID NOT NULL,
  data_criacao TIMESTAMP NOT NULL,
  saldo NUMERIC(18,2) NOT NULL DEFAULT 0,
  limite NUMERIC(18,2) NOT NULL DEFAULT 0,
  versao BIGINT NOT NULL DEFAULT 0 -- otimista
);

CREATE TABLE conta_cmd.movimento (
  id UUID PRIMARY KEY,
  conta_id UUID NOT NULL,
  data_hora TIMESTAMP NOT NULL,
  tipo VARCHAR(20) NOT NULL,       -- DEPOSITO | SAQUE | TRANSFERENCIA
  origem_conta VARCHAR(10),
  destino_conta VARCHAR(10),
  valor NUMERIC(18,2) NOT NULL CHECK (valor > 0),
  CONSTRAINT fk_conta FOREIGN KEY(conta_id) REFERENCES conta_cmd.conta(id)
);

-- índice úteis
CREATE INDEX idx_conta_numero ON conta_cmd.conta (numero_conta);
CREATE INDEX idx_mov_conta_data ON conta_cmd.movimento (conta_id, data_hora);
