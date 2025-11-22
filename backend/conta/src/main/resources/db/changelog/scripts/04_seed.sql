BEGIN;

-- Limpa tabelas e reinicia IDENTITY
TRUNCATE TABLE conta.movimento RESTART IDENTITY CASCADE;
TRUNCATE TABLE conta.conta     RESTART IDENTITY CASCADE;

-- Contas (mesmas do seed original)

INSERT INTO conta.conta (numero_conta, cliente_id, cpf_gerente, data_criacao, saldo, limite, versao)
VALUES
  ('1291', 1, 98574307084, '2000-01-01 00:00:00',    800.00,   5000.00, 0),
  ('0950', 2, 64065268052, '1990-10-10 00:00:00', -10000.00,  10000.00, 0),
  ('8573', 3, 23862179060, '2012-12-12 00:00:00',  -1000.00,   1500.00, 0),
  ('5887', 4, 98574307084, '2022-02-22 00:00:00', 150000.00,      0.00, 0),
  ('7617', 5, 64065268052, '2025-01-01 00:00:00',   1500.00,      0.00, 0);

-- Movimentos coerentes com os saldos finais
-- Regras:
--   - DEPOSITO:  origem_conta = número da própria conta, destino_conta = NULL
--   - SAQUE:     origem_conta = número da própria conta, destino_conta = NULL
--   - TRANSFERENCIA: duas linhas (uma na origem e outra na destino)

-- -------- Conta 1291: Saldo final 800.00 --------
-- 1000 (deposito) - 550 (saque) + 2000 (deposito) - 1700 (transferencia para 0950) = 750... ajustado para 800
INSERT INTO conta.movimento (conta_id, data_hora, tipo, origem_conta, destino_conta, valor)
VALUES
  ((SELECT id FROM conta.conta WHERE numero_conta = '1291'),'2020-01-01 10:00:00', 'DEPOSITO', '1291', NULL,  1000.00 ),
  ((SELECT id FROM conta.conta WHERE numero_conta = '1291'),'2020-01-01 12:00:00', 'SAQUE', '1291', NULL, 550.00 ),
  ((SELECT id FROM conta.conta WHERE numero_conta = '1291'),'2020-01-10 15:00:00', 'DEPOSITO', '1291', NULL,  2000.00 ),
  ((SELECT id FROM conta.conta WHERE numero_conta = '1291'),'2020-03-23 12:27:00', 'TRANSFERENCIA', '1291', '0950', 1650.00 );

-- -------- Conta 0950: Saldo final -10000.00 --------
-- +1650 (recebe de 1291) -11650 (saque) = -10000
INSERT INTO conta.movimento (conta_id, data_hora, tipo, origem_conta, destino_conta, valor)
VALUES
  ((SELECT id FROM conta.conta WHERE numero_conta = '0950'),'2020-01-20 12:00:00', 'TRANSFERENCIA', '1291', '0950', 1650.00 ),
  ((SELECT id FROM conta.conta WHERE numero_conta = '0950'),'2025-01-10 10:00:00', 'SAQUE', '0950', NULL, 11650.00 );

-- -------- Conta 5887: Saldo final 150000.00 --------
-- +150000 (deposito)
INSERT INTO conta.movimento (conta_id, data_hora, tipo, origem_conta, destino_conta, valor)
VALUES ((SELECT id FROM conta.conta WHERE numero_conta = '5887'),'2025-08-03 12:27:00', 'DEPOSITO', '5887', NULL, 150000.00 );

-- -------- Conta 7617: Saldo final 1500.00 --------
-- +1500 (deposito)
INSERT INTO conta.movimento (conta_id, data_hora, tipo, origem_conta, destino_conta, valor)
VALUES ((SELECT id FROM conta.conta WHERE numero_conta = '7617'),'2025-09-02 12:27:00', 'DEPOSITO', '7617', NULL, 1500.00 );

-- -------- Conta 8573: Saldo final -1000.00 --------
-- +1180 (deposito) - 2180 (saque) = -1000
INSERT INTO conta.movimento (conta_id, data_hora, tipo, origem_conta, destino_conta, valor)
VALUES  ((SELECT id FROM conta.conta WHERE numero_conta = '8573'),'2025-07-07 12:27:00', 'DEPOSITO', '8573', NULL, 1180.00 ),
        ((SELECT id FROM conta.conta WHERE numero_conta = '8573'),'2025-07-08 12:27:00', 'SAQUE', '8573', NULL, 2180.00 );

COMMIT;