-- 03_query_ddl.sql (schema conta_query)
CREATE TABLE conta_query.conta_view (
  numero_conta VARCHAR(10) PRIMARY KEY,
  cliente_id UUID NOT NULL,
  gerente_id UUID NOT NULL,
  saldo NUMERIC(18,2) NOT NULL,
  limite NUMERIC(18,2) NOT NULL,
  nome_cliente TEXT,   -- opcional: preenchido por composição via gateway, pode ficar null aqui
  cidade TEXT, estado TEXT
);

CREATE TABLE conta_query.movimento_view (
  id UUID PRIMARY KEY,
  numero_conta VARCHAR(10) NOT NULL,
  data_hora TIMESTAMP NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  origem_conta VARCHAR(10),
  destino_conta VARCHAR(10),
  valor NUMERIC(18,2) NOT NULL,
  sinal CHAR(1) NOT NULL  -- '+' ou '-' para facilitar o front
);

-- Resumo por gerente para tela do admin
CREATE TABLE conta_query.gerente_resumo (
  gerente_id UUID PRIMARY KEY,
  qtde_clientes INT NOT NULL,
  soma_saldos_positivos NUMERIC(18,2) NOT NULL,
  soma_saldos_negativos NUMERIC(18,2) NOT NULL
);

CREATE INDEX idx_mv_conta_data ON conta_query.movimento_view (numero_conta, data_hora);


/*
WITH dias AS (
  SELECT generate_series(:data_inicio::date, :data_fim::date, interval '1 day') AS dia
),
movs AS (
  SELECT data_hora::date AS dia,
         CASE WHEN sinal='-' THEN -valor ELSE valor END AS delta
  FROM conta_query.movimento_view
  WHERE numero_conta = :numero
    AND data_hora::date BETWEEN :data_inicio AND :data_fim
),
acum AS (
  SELECT d.dia,
         COALESCE((SELECT SUM(delta) FROM movs m WHERE m.dia <= d.dia), 0) AS movimento_acumulado
  FROM dias d
)
SELECT a.dia,
       (cv.saldo - (SELECT COALESCE(SUM(delta),0)
                    FROM movs m
                    WHERE m.dia > a.dia)) AS saldo_do_dia
FROM acum a
CROSS JOIN conta_query.conta_view cv
WHERE cv.numero_conta = :numero
ORDER BY a.dia;

*/