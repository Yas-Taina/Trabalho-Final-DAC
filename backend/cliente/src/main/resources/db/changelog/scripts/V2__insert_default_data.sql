INSERT INTO cliente.cliente (id, nome, cpf, email, telefone, salario, endereco, cep, cidade, estado)
SELECT *
FROM (VALUES
    (1, 'Catharyna', '12912861012', 'cli1@bantads.com.br', '11987654321', 10000.00, 'Rua das Flores, 123', '01000000', 'São Paulo', 'SP'),
    (2, 'Cleuddônio', '09506382000', 'cli2@bantads.com.br', '21999887766', 20000.00, 'Avenida Central, 456', '02000000', 'Rio de Janeiro', 'RJ'),
    (3, 'Catianna', '85733854057', 'cli3@bantads.com.br', '31988776655', 3000.00, 'Rua Nova, 789', '03000000', 'Belo Horizonte', 'MG'),
    (4, 'Cutardo', '58872160006', 'cli4@bantads.com.br', '41991234567', 500.00, 'Travessa do Sol, 321', '04000000', 'Curitiba', 'PR'),
    (5, 'Coândrya', '76179646090', 'cli5@bantads.com.br', '51997654321', 1500.00, 'Rua das Palmeiras, 654', '05000000', 'Porto Alegre', 'RS')
    ) AS v(id, nome, cpf, email, telefone, salario, endereco, cep, cidade, estado)
WHERE NOT EXISTS (SELECT 1 FROM cliente.cliente);

SELECT setval(
               pg_get_serial_sequence('cliente.cliente', 'id'),
               COALESCE((SELECT MAX(id) FROM cliente.cliente), 1)
);