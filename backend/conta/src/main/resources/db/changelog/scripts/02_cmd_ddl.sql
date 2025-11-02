-- 02_cmd_ddl.sql  (schema conta)
CREATE TABLE if not exists conta.conta (
  id serial PRIMARY KEY,
  numero_conta VARCHAR(10) UNIQUE NOT NULL,
  cliente_id int NOT NULL,        -- ID vindo do MS Cliente (sem FK cross-service)
  gerente_id  int NOT NULL,
  data_criacao TIMESTAMP NOT NULL,
  data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  saldo NUMERIC(18,2) NOT NULL DEFAULT 0,
  limite NUMERIC(18,2) NOT NULL DEFAULT 0,
  versao BIGINT NOT NULL DEFAULT 0 -- otimista
);

CREATE TABLE if not exists conta.movimento (
  id serial PRIMARY KEY,
  conta_id int NOT NULL,
  data_hora TIMESTAMP NOT NULL,
  tipo VARCHAR(20) NOT NULL,       -- DEPOSITO | SAQUE | TRANSFERENCIA
  origem_conta VARCHAR(10),
  destino_conta VARCHAR(10),
  valor NUMERIC(18,2) NOT NULL CHECK (valor > 0),
  CONSTRAINT fk_conta FOREIGN KEY(conta_id) REFERENCES conta.conta(id)
);

-- índice úteis
CREATE INDEX if not exists idx_conta_numero ON conta.conta (numero_conta);
CREATE INDEX if not exists idx_mov_conta_data ON conta.movimento (conta_id, data_hora);
