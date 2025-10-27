# DAC - Teste de Back-end

DAC - UFPR

Aqui está o passo a passo para execução dos testes do Back-end da disciplina de DAC.

Este código está licenciado como [GNU GPL v3](https://github.com/razeranthom/test_bantads/blob/main/LICENSE).

## Download do Repositório

Para fazer o download dos fontes do repositório, execute o seguinte comando no terminal:

```
git clone https://github.com/razeranthom/test_bantads.git
```
Confira se tudo foi baixado na sua pasta corrente.

## Instalação

### Python

Você precisa do Python para executar os testes. Neste link você encontra um tutorial de como instalar o Python na sua máquina, seja MAC, Windows ou Linux:

[Installing Python](https://realpython.com/installing-python/)

### Pacotes

Para instalar os pacotes necessários, execute o seguinte comando no terminal.

```
pip3 install -r requirements.txt
```

## Configuração

O arquivo .env contém a configuração do endpoint. Aqui está o default:

```
# URL sem a barra no final
URL = "http://localhost:8000"

ARQUIVO_TOKEN = "token_test.json"
ARQUIVO_CACHE = "cache_test.json"

EMAIL_AUTOCADASTRO1 = ""
EMAIL_AUTOCADASTRO2 = ""
```
No parâmetro URL, coloque o endpoint a ser testado, sem a barra final.

Neste arquivo você também deve configurar os 2 e-mails para teste do autocadastro:

Se deixar em branco, em toda execução o teste vai solicitar novamente os e-mails

## Execução

Para executar os testes, no terminal rode o seguinte comando:

```
pytest -s -v test_dac_bantads.py
```

Ao executar você vai perceber a criação de 2 arquivos (cujos nomes estão no arquivo .env). Um contém o token de login e outro contém um cache com dados que são usados entre as chamadas dos testes.


## Validação do Arquivo de Teste

O testador possui um hash que está no arquivo: "hash.md5.txt", que será testado para evitar alterações.

````
# LINUX
md5sum test_dac_bantads.py

# WINDOWS
certUtil -hashfile test_dac_bantads.py MD5

# MAC
md5 test_dac_bantads.py
```
