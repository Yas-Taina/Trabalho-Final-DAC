
truncate table gerente.gerente restart identity cascade;

INSERT INTO gerente.gerente(id, cpf, email, nome, tipo)
VALUES
(1, '98574307084', 'ger1@bantads.com.br', 'Geniéve', 'gerente'),
(2, '64065268052', 'ger2@bantads.com.br', 'Godophredo', 'gerente'),
(3, '23862179060', 'ger3@bantads.com.br', 'Gyândula', 'gerente'),
(4, '40501740066', 'adm1@bantads.com.br', 'Adamântio', 'administrador');

SELECT setval(
               pg_get_serial_sequence('gerente.gerente', 'id'),
               COALESCE((SELECT MAX(id) FROM gerente.gerente), 1)
);