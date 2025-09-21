-- 04_seed.sql  —  Seeds do MS Conta (schema: conta_cmd)

BEGIN;

-- Limpa tabelas e reinicia IDENTITY
TRUNCATE TABLE conta_cmd.movimento RESTART IDENTITY CASCADE;
TRUNCATE TABLE conta_cmd.conta     RESTART IDENTITY CASCADE;

-- =========================================
-- Contas (clienteId e gerenteId são IDs "externos" fictícios)
-- Mapas usados:
--   Clientes  -> IDs: 1=Catharyna, 2=Cleuddônio, 3=Catianna, 4=Cutardo, 5=Coândrya
--   Gerentes  -> IDs: 101=Geniéve, 102=Godophredo, 103=Gyândula
-- =========================================
INSERT INTO conta_cmd.conta
  (numero_conta, cliente_id, gerente_id, data_criacao, saldo, limite, versao)
VALUES
  ('1291', 1, 101, '2000-01-01 00:00:00',    800.00,   5000.00, 0),  -- Catharyna / Geniéve
  ('0950', 2, 102, '1990-10-10 00:00:00', -10000.00,  10000.00, 0),  -- Cleuddônio / Godophredo
  ('8573', 3, 103, '2012-12-12 00:00:00',  -1000.00,   1500.00, 0),  -- Catianna / Gyândula
  ('5887', 4, 101, '2022-02-22 00:00:00', 150000.00,      0.00, 0),  -- Cutardo / Geniéve
  ('7617', 5, 102, '2025-01-01 00:00:00',   1500.00,      0.00, 0);  -- Coândrya / Godophredo

-- =========================================
-- Movimentos
-- Regras:
--   - DEPOSITO: origem_conta = número da própria conta, destino_conta = NULL
--   - SAQUE:    origem_conta = número da própria conta, destino_conta = NULL
--   - TRANSFERENCIA: duas linhas (uma na origem e outra na destino)
-- =========================================

-- -------- Conta 1291 (Catharyna) --------
INSERT INTO conta_cmd.movimento
  (conta_id, data_hora, tipo, origem_conta, destino_conta, valor)
VALUES
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '1291'),
    '2020-01-01 10:00:00', 'DEPOSITO', '1291', NULL, 1000.00),
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '1291'),
    '2020-01-01 11:00:00', 'DEPOSITO', '1291', NULL,  900.00),
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '1291'),
    '2020-01-01 12:00:00', 'SAQUE',    '1291', NULL,  550.00),
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '1291'),
    '2020-01-01 13:00:00', 'SAQUE',    '1291', NULL,  350.00),
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '1291'),
    '2020-01-10 15:00:00', 'DEPOSITO', '1291', NULL, 2000.00),
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '1291'),
    '2020-01-15 08:00:00', 'SAQUE',    '1291', NULL,  500.00);

-- Transferência 20/01/2020 12:00 de 1291 -> 0950 (duas entradas)
-- Origem (1291): saída
INSERT INTO conta_cmd.movimento
  (conta_id, data_hora, tipo, origem_conta, destino_conta, valor)
VALUES
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '1291'),
    '2020-01-20 12:00:00', 'TRANSFERENCIA', '1291', '0950', 1700.00);

-- Destino (0950): entrada
INSERT INTO conta_cmd.movimento
  (conta_id, data_hora, tipo, origem_conta, destino_conta, valor)
VALUES
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '0950'),
    '2020-01-20 12:00:00', 'TRANSFERENCIA', '1291', '0950', 1700.00);

-- -------- Conta 0950 (Cleuddônio) --------
INSERT INTO conta_cmd.movimento
  (conta_id, data_hora, tipo, origem_conta, destino_conta, valor)
VALUES
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '0950'),
    '2025-01-01 12:00:00', 'DEPOSITO', '0950', NULL, 1000.00),
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '0950'),
    '2025-01-02 10:00:00', 'DEPOSITO', '0950', NULL, 5000.00),
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '0950'),
    '2025-01-10 10:00:00', 'SAQUE',    '0950', NULL,  200.00),
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '0950'),
    '2025-02-05 10:00:00', 'DEPOSITO', '0950', NULL, 7000.00);

-- -------- Conta 8573 (Catianna) --------
INSERT INTO conta_cmd.movimento
  (conta_id, data_hora, tipo, origem_conta, destino_conta, valor)
VALUES
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '8573'),
    '2025-05-05 12:00:00', 'DEPOSITO', '8573', NULL, 1000.00),
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '8573'),
    '2025-05-06 12:00:00', 'SAQUE',    '8573', NULL, 2000.00);

-- -------- Conta 5887 (Cutardo) --------
INSERT INTO conta_cmd.movimento
  (conta_id, data_hora, tipo, origem_conta, destino_conta, valor)
VALUES
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '5887'),
    '2025-06-01 12:00:00', 'DEPOSITO', '5887', NULL, 150000.00);

-- -------- Conta 7617 (Coândrya) --------
INSERT INTO conta_cmd.movimento
  (conta_id, data_hora, tipo, origem_conta, destino_conta, valor)
VALUES
  ((SELECT id FROM conta_cmd.conta WHERE numero_conta = '7617'),
    '2025-07-01 12:00:00', 'DEPOSITO', '7617', NULL, 1500.00);

COMMIT;

