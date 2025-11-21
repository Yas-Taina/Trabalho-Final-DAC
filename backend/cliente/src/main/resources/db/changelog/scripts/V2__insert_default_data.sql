TRUNCATE TABLE cliente.cliente RESTART IDENTITY CASCADE;

INSERT INTO cliente.cliente (id, nome, cpf, email, telefone, salario, endereco, cep, cidade, estado, cpf_gerente, status)
SELECT *
FROM (VALUES
    (1, 'Catharyna', '12912861012', 'cli1@bantads.com.br', '11987654321', 10000.00, 'Rua das Flores, 123', '01000000', 'São Paulo', 'SP', '98574307084', 'APROVADO'),
    (2, 'Cleuddônio', '09506382000', 'cli2@bantads.com.br', '21999887766', 20000.00, 'Avenida Central, 456', '02000000', 'Rio de Janeiro', 'RJ', '64065268052', 'APROVADO'),
    (3, 'Catianna', '85733854057', 'cli3@bantads.com.br', '31988776655', 3000.00, 'Rua Nova, 789', '03000000', 'Belo Horizonte', 'MG', '23862179060', 'APROVADO'),
    (4, 'Cutardo', '58872160006', 'cli4@bantads.com.br', '41991234567', 500.00, 'Travessa do Sol, 321', '04000000', 'Curitiba', 'PR', '98574307084', 'APROVADO'),
    (5, 'Coândrya', '76179646090', 'cli5@bantads.com.br', '51997654321', 1500.00, 'Rua das Palmeiras, 654', '05000000', 'Porto Alegre', 'RS', '64065268052', 'APROVADO')
    ) AS v(id, nome, cpf, email, telefone, salario, endereco, cep, cidade, estado, cpf_gerente, status)
WHERE NOT EXISTS (SELECT 1 FROM cliente.cliente);

SELECT setval(
               pg_get_serial_sequence('cliente.cliente', 'id'),
               COALESCE((SELECT MAX(id) FROM cliente.cliente), 1)
);