CREATE TABLE if not exists gerente.gerente (
    id serial PRIMARY KEY,
	cpf varchar(255) NULL,
	email varchar(255) NULL,
	nome varchar(255) NULL,
	senha varchar(255) NULL,
	tipo varchar(255) NULL
);
