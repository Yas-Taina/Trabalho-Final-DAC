######################################################
# Testador de Back-end da disciplina de DAC
#
# Autor: Prof. Dr. Razer Anthom Nizer Rojas Montaño
#
# Necessário PyTest para execução
######################################################
from dotenv import load_dotenv
import requests, os, time, json, datetime, random
from datetime import timedelta, datetime
from faker import Faker

### Header padrão sendo enviado nas comunicações
HEADERS = {
    'Accept': '*/*',
    'User-Agent': 'request'
}

### Carga dos parâmetros no arquivo .env
load_dotenv()
URL = os.getenv("URL")
ARQUIVO_TOKEN = os.getenv("ARQUIVO_TOKEN")
ARQUIVO_CACHE = os.getenv("ARQUIVO_CACHE")
EMAIL_AUTOCADASTRO1 = os.getenv("EMAIL_AUTOCADASTRO1")
EMAIL_AUTOCADASTRO2 = os.getenv("EMAIL_AUTOCADASTRO1")

###############################################
# Dados para teste
###############################################
USUARIO1 = {
    "cpf": "",
    "email": "",
    "nome": "Usuário 1",
    "salario": 0,
    "endereco": "Rua das Palmeiras, 100",
    "CEP" : "80050490",
    "cidade" : "Curitiba",
    "estado" : "PR"
}

LOGIN = {
    "login": "teste_zoado@gmail.com",
    "senha": "XXXX"
}

GYANDULA = {
    "cpf" : "23862179060",
    "email" : "ger3@bantads.com.br",
    "nome" : "Gyândula",
    "tipo" : "GERENTE",
    "senha" : "tads"
}
GYANDULA_NOME_ALTERADO = "Nome Alterado"
GYANDULA_EMAIL_ALTERADO = "email@alterado.com.br"
GENIEVE = {
    "cpf" : "98574307084",
    "email" : "ger1@bantads.com.br",
    "nome" : "Geniéve",
    "tipo" : "GERENTE",
    "senha" : "tads"
}
GODOPHREDO = {
    "cpf" : "64065268052",
    "email" : "ger2@bantads.com.br",
    "nome" : "Godophredo",
    "tipo" : "GERENTE",
    "senha" : "tads"
}
GUEDENCIA = {
    "cpf" : "",
    "email" : "ger4@bantads.com.br",
    "nome" : "Guedência",
    "tipo" : "GERENTE",
    "senha" : "tads"
}
GERENTE1 = {
    "cpf" : "",
    "email" : "",
    "nome" : "",
    "tipo" : "GERENTE",
    "senha" : ""
}
GERENTE1_SENHA = "gaga"

ADAMANTIO = {
    "cpf": "40501740066",
    "nome": "Adamântio",
    "email": "adm1@bantads.com.br",
    "senha": "tads",
    "tipo": "ADMINISTRADOR"
}

CATHARYNA = {
    "conta": "1291",
    "cpf": "12912861012",
    "nome": "Catharyna",
    "email": "cli1@bantads.com.br",
    "senha": "tads",
    "tipo": "CLIENTE",
    "limite": 5000.0,
    "saldo": 800.0,
    "gerente": GENIEVE["cpf"],
    "data_criacao": "01/01/2000"
}
CLEUDDONIO = {
    "conta": "0950",
    "cpf": "09506382000",
    "nome": "Cleuddônio",
    "email": "cli2@bantads.com.br",
    "senha": "tads",
    "tipo": "CLIENTE",
    "salario": 20000.0,
    "limite": 10000.0,
    "saldo": -10000.0,
    "gerente": GODOPHREDO["cpf"],
    "data_criacao": "10/10/1990"
}
CATIANNA = {
    "conta": "8573",
    "cpf": "85733854057",
    "nome": "Catianna",
    "email": "cli3@bantads.com.br",
    "senha": "tads",
    "tipo": "CLIENTE",
    "salario": 3000.0,
    "limite": 1500.0,
    "saldo": -1000.0,
    "gerente": GYANDULA["cpf"],
    "data_criacao": "12/12/2012"
}
CUTARDO = {
    "conta": "5887",
    "cpf": "58872160006",
    "nome": "Cutardo",
    "email": "cli4@bantads.com.br",
    "senha": "tads",
    "tipo": "CLIENTE",
    "salario": 500.0,
    "limite": 0.0,
    "saldo": 0.0,
    "gerente": GENIEVE["cpf"],
    "data_criacao": "22/02/2022"
}
COANDRYA = {
    "conta": "7617",
    "cpf": "76179646090",
    "nome": "Coândrya",
    "email": "cli5@bantads.com.br",
    "senha": "tads",
    "tipo": "CLIENTE",
    "salario": 1500.0,
    "limite": 0.0,
    "saldo": 0.0,
    "gerente": GODOPHREDO["cpf"],
    "data_criacao": "01/01/2025"
}

# Lista de clientes pré-cadastrados
CLIENTES_TESTE = ["12912861012", "09506382000", "85733854057", "58872160006", "76179646090"]
CLIENTES_NOME_TESTE = ["Catharyna", "Cleuddônio", "Catianna", "Cutardo", "Coândrya"]
CLIENTES_EMAIL_TESTE = ["cli1@bantads.com.br", "cli2@bantads.com.br", "cli3@bantads.com.br", "cli4@bantads.com.br", "cli5@bantads.com.br"]

####################################################
# Funções Helpers
def salvar_token(token):
    with open(ARQUIVO_TOKEN, "w") as fp:
        fp.write(token)

def recuperar_token():
    with open(ARQUIVO_TOKEN, "r") as fp:
        token = fp.readline()
    return token

def salvar_cache(cache):
    cache_s = json.dumps(cache)
    with open(ARQUIVO_CACHE, "w") as fp:
        fp.write(cache_s)

def recuperar_cache():
    if not os.path.exists(ARQUIVO_CACHE):
        return {}
    with open(ARQUIVO_CACHE, "r") as fp:
        cache = json.load(fp)
    return cache

def inserir_ou_alterar_cache(lista):
    cache = recuperar_cache()
    for l in lista:
        cache[l[0]] = l[1]

    salvar_cache(cache)

#### TODO Usar o Faker na próxima versão!!!
def gerar_cpf():
    # faker = Faker("pt_BR")
    # return faker.cpf().replace(".", "").replace("-","")                                  
    cpf = [random.randint(0, 9) for x in range(9)]                              
                                                                               
    for _ in range(2):                                                          
        val = sum([(len(cpf) + 1 - i) * v for i, v in enumerate(cpf)]) % 11                                                                                   
        cpf.append(11 - val if val > 1 else 0)                                  
                                                                                
    return '%s%s%s%s%s%s%s%s%s%s%s' % tuple(cpf)

def obter_novo_codigo(quantidade=4):
    numeros = "0123456789"
    generated_numero = ''.join(random.choices(numeros, k = quantidade))
    return generated_numero

def gerar_email():
    return f"func_{obter_novo_codigo(2)}@gmail.com"

def gerar_senha():
    return obter_novo_codigo(4)

def gerar_valor_moeda(inf=100, sup=500):
    return round(random.uniform(inf, sup), 2)

####################################################
# Agora começam as funções de teste ao back-end
####################################################

####################################################
# FUNÇÕES GENÉRICAS

def login(email, senha, cpf, tipo, correto=True):
    LOGIN["login"] = email
    LOGIN["senha"] = senha

    resp = requests.post(URL + "/login", 
                         headers=HEADERS, 
                         json=LOGIN)
    
    if correto:
        assert resp.status_code==200 

        r = resp.json()
        assert "access_token" in r
        assert "token_type" in r
        assert r["usuario"]["cpf"] == cpf
        assert r["usuario"]["email"] == email
        assert r["tipo"] == tipo

        ACCESS_TOKEN = r["access_token"]

        # Adiciona o token retornado para as próximas chamadas
        salvar_token(f"Bearer {ACCESS_TOKEN}")
    else:
        assert resp.status_code==401 


def logout(email, token):
    HEADERS["Authorization"] = token

    r = requests.post(URL + "/logout", 
                         headers=HEADERS)

    assert r.status_code==200
    resp = r.json()
    assert resp["email"] == email

    salvar_token(f"Bearer ")


####################################################
# R00 - Reboot - apagar base
def test_r00_reboot():

    # Passo 1 - invoca reboot
    resp = requests.get(URL + f"/reboot", 
                         headers=HEADERS)
    assert resp.status_code==200

    inserir_ou_alterar_cache([
        ("lista_gerentes", [GENIEVE["cpf"], GODOPHREDO["cpf"], GYANDULA["cpf"]]),
        ("genieve_saldo_pos", 150800.0),
        ("genieve_saldo_neg", 0.0),
        ("godophredo_saldo_pos", 1500.0),
        ("godophredo_saldo_neg", -10000.0),
        ("gyandula_saldo_pos", 0),
        ("gyandula_saldo_neg", -1000.0)
    ])

####################################################
# R00 - Verificação da base - apagar base
def test_r00_verificacao_base():
    # Passo 1
    # Loga como ADMIN para ver os gerentes
    login(ADAMANTIO["email"], ADAMANTIO["senha"], ADAMANTIO["cpf"], ADAMANTIO["tipo"])

    token = recuperar_token()
    HEADERS["Authorization"] = token

    # Passo 2 - Busca os gerentes
    resp = requests.get(URL + "/gerentes", 
                         headers=HEADERS)
    assert resp.status_code==200
    resp = resp.json()
    assert len(resp) == 3
    for g in resp:
        assert g["cpf"] in [GENIEVE["cpf"], GODOPHREDO["cpf"], GYANDULA["cpf"]]

    # Passo 3 - Busca os clientes
    params = {
        "filtro": "adm_relatorio_clientes"
    }
    resp = requests.get(URL + "/clientes", 
                         headers=HEADERS, 
                         params=params)
    
    assert resp.status_code==200
    lista = resp.json()
    assert len(lista) == 5
    for cli in lista:
        assert cli["cpf"] in CLIENTES_TESTE

    # Passo 4 - logout
    logout(ADAMANTIO["email"], token)


####################################################
# R01 - Autocadastro
def test_r01_autocadastro1():

    cpf = gerar_cpf()

    if EMAIL_AUTOCADASTRO1:
        email = EMAIL_AUTOCADASTRO1
    else:
        print()
        email = input(f"    >>>> Digite um e-mail para o 1o autocadastro: ")

    USUARIO1["cpf"] = cpf
    USUARIO1["email"] = email
    USUARIO1["nome"] = "Usuário 1"
    USUARIO1["salario"] = 5000.0 # para gerar limite
    resp = requests.post(URL + "/clientes", 
                         headers=HEADERS, 
                         json=USUARIO1)
    
    assert resp.status_code==201

    r = resp.json()
    assert r['cpf']==cpf
    assert r['email']==email

    inserir_ou_alterar_cache([ 
        ("autocad1_cpf", USUARIO1["cpf"]),
        ("autocad1_nome", USUARIO1["nome"]),
        ("autocad1_email", USUARIO1["email"]),
        ("autocad1_salario", USUARIO1["salario"])
    ])

def test_r01_autocadastro2():

    cpf = gerar_cpf()

    if EMAIL_AUTOCADASTRO2:
        email = EMAIL_AUTOCADASTRO2
    else:
        print()
        email = input(f"    >>>> Digite um e-mail para o 2o autocadastro: ")

    USUARIO1["cpf"] = cpf
    USUARIO1["email"] = email
    USUARIO1["nome"] = "Usuário 2"
    USUARIO1["salario"] = 450.0  # para não gerar limite
    resp = requests.post(URL + "/clientes", 
                         headers=HEADERS, 
                         json=USUARIO1)
    
    assert resp.status_code==201

    r = resp.json()
    assert r['cpf']==cpf
    assert r['email']==email

    inserir_ou_alterar_cache([ 
        ("autocad2_cpf", USUARIO1["cpf"]),
        ("autocad2_nome", USUARIO1["nome"]),
        ("autocad2_email", USUARIO1["email"]),
        ("autocad2_salario", USUARIO1["salario"])
    ])

def test_r01_autocadastro_duplicado():

    cache = recuperar_cache()

    USUARIO1["cpf"] = cache["autocad1_cpf"]
    USUARIO1["email"] = cache["autocad1_email"]
    USUARIO1["nome"] = cache["autocad1_nome"]
    USUARIO1["salario"] = cache["autocad1_salario"]
    resp = requests.post(URL + "/clientes", 
                         headers=HEADERS, 
                         json=USUARIO1)
    
    assert resp.status_code==409

####################################################
# R02 - Login Inválido
def test_r02_login_invalido():
    login("xxx", "xxx", "xxx", "CLIENTE", False)

    login(GYANDULA["email"], "xxx", GYANDULA["cpf"], GYANDULA["tipo"], False)
    login(GENIEVE["email"], "xxx", GENIEVE["cpf"], GENIEVE["tipo"], False)
    login(GODOPHREDO["email"], "xxx", GODOPHREDO["cpf"], GODOPHREDO["tipo"], False)
    login(ADAMANTIO["email"], "xxx", ADAMANTIO["cpf"], ADAMANTIO["tipo"], False)
    login(CATHARYNA["email"], "xxx", CATHARYNA["cpf"], CATHARYNA["tipo"], False)
    login(CLEUDDONIO["email"], "xxx", CLEUDDONIO["cpf"], CLEUDDONIO["tipo"], False)
    login(CATIANNA["email"], "xxx", CATIANNA["cpf"], CATIANNA["tipo"], False)
    login(CUTARDO["email"], "xxx", CUTARDO["cpf"], CUTARDO["tipo"], False)
    login(COANDRYA["email"], "xxx", COANDRYA["cpf"], COANDRYA["tipo"], False)

####################################################
# R02 - Login de Gerente

def test_r02_login_gerente():
    # Loga com a Gyândula
    # token já é salvo automaticamente
    login(GYANDULA["email"], GYANDULA["senha"], GYANDULA["cpf"], GYANDULA["tipo"])


def test_r02_gerente_testar_acesso():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    params = {
        "filtro": "adm_relatorio_clientes"
    }
    resp = requests.get(URL + "/clientes", 
                         headers=HEADERS, 
                         params=params)
    assert resp.status_code==403
    

####################################################
# R09 - Tela Inicial de Gerente

def test_r09_tela_inicial_gerente():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    cache = recuperar_cache()
    params = {
        "filtro": "para_aprovar"
    }

    resp = requests.get(URL + "/clientes", 
                         headers=HEADERS, 
                         params=params)
    
    assert resp.status_code==200

    lista = resp.json()
    assert lista[0]["cpf"] == cache["autocad1_cpf"]
    assert lista[0]["nome"] == cache["autocad1_nome"]
    assert lista[0]["salario"] == cache["autocad1_salario"]
    assert lista[1]["cpf"] == cache["autocad2_cpf"]
    assert lista[1]["email"] == cache["autocad2_email"]
    assert lista[1]["nome"] == cache["autocad2_nome"]
    assert lista[1]["salario"] == cache["autocad2_salario"]

####################################################
# R10 - Aprovar Cliente
    
def test_r10_aprovar_cliente():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    cache = recuperar_cache()

    USUARIO1["cpf"] = cache["autocad1_cpf"]
    USUARIO1["email"] = cache["autocad1_email"]
    USUARIO1["nome"] = "Usuário 1"
    resp = requests.post(URL + "/clientes/" + cache["autocad1_cpf"] + "/aprovar", 
                         headers=HEADERS, 
                         json=USUARIO1)
    
    assert resp.status_code==200

    resp = requests.get(URL + "/clientes/" + cache["autocad1_cpf"], 
                         headers=HEADERS)
    assert resp.status_code==200
    r = resp.json()
    assert r["cpf"] == cache["autocad1_cpf"]
    assert r["email"] == cache["autocad1_email"]
    assert r["salario"] == cache["autocad1_salario"]
    assert r["limite"] == float(cache["autocad1_salario"])/2

    # verificar para qual gerente foi

    print()
    senha = input(f"    >>>> Digite a senha enviada no e-mail {cache["autocad1_email"]}: ")

    inserir_ou_alterar_cache([ 
        ("autocad1_senha", senha),
        ("autocad1_conta", r["conta"]),
    ])


    CLIENTES_TESTE.append(USUARIO1["cpf"])
    CLIENTES_EMAIL_TESTE.append(USUARIO1["email"])
    CLIENTES_NOME_TESTE.append(USUARIO1["nome"])


####################################################
# R02 - Login com o cliente aprovado
def test_r02_login_cliente_aprovado():
    token = recuperar_token()
    logout(GYANDULA["email"], token)

    cache = recuperar_cache()
    login(cache["autocad1_email"], cache["autocad1_senha"], cache["autocad1_cpf"], "CLIENTE", True)

def test_r02_acesso_cliente():
    token = recuperar_token()
    HEADERS["Authorization"] = token
    cache = recuperar_cache()
    USUARIO1["cpf"] = cache["autocad2_cpf"]
    USUARIO1["email"] = cache["autocad2_email"]
    USUARIO1["nome"] = "Usuário 2"
    resp = requests.post(URL + "/clientes/" + cache["autocad2_cpf"] + "/aprovar", 
                         headers=HEADERS, 
                         json=USUARIO1)
    
    assert resp.status_code==403

    USUARIO1["cpf"] = cache["autocad2_cpf"]
    USUARIO1["email"] = cache["autocad2_email"]
    USUARIO1["nome"] = "Usuário 2"
    payload = {
        "usuario": USUARIO1,
        "motivo" : "Cliente não é interessante para o banco"
    }
    resp = requests.post(URL + "/clientes/" + cache["autocad2_cpf"] + "/rejeitar", 
                         headers=HEADERS, 
                         json=payload)
    
    assert resp.status_code==403

def test_r02_login_gerente_novamente():
    cache = recuperar_cache()
    token = recuperar_token()
    logout(cache["autocad1_email"], token)

    login(GYANDULA["email"], GYANDULA["senha"], GYANDULA["cpf"], GYANDULA["tipo"], True)

####################################################
# R11 - Rejeitar Cliente

def test_r11_rejeitar_cliente():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    cache = recuperar_cache()

    USUARIO1["cpf"] = cache["autocad2_cpf"]
    USUARIO1["email"] = cache["autocad2_email"]
    USUARIO1["nome"] = "Usuário 2"
    payload = {
        "usuario": USUARIO1,
        "motivo" : "Cliente não é interessante para o banco"
    }
    resp = requests.post(URL + "/clientes/" + cache["autocad2_cpf"] + "/rejeitar", 
                         headers=HEADERS, 
                         json=payload)
    
    assert resp.status_code==200

    resp = requests.get(URL + f"/clientes/{cache["autocad2_cpf"]}", 
                         headers=HEADERS)
    assert resp.status_code==404

####################################################
# R11 - Consultar TODOS Clientes
def test_r12_consultar_todos_clientes():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    resp = requests.get(URL + "/clientes", 
                         headers=HEADERS)
    
    assert resp.status_code==200

    r = resp.json()
    assert len(r) == 6
    nome_ant = ""
    for cli in r:
        assert cli["cpf"] in CLIENTES_TESTE
        assert cli["nome"] in CLIENTES_NOME_TESTE
        assert cli["email"] in CLIENTES_EMAIL_TESTE
        assert nome_ant <= cli["nome"]
        nome_ant = cli["nome"]


####################################################
# R13 - Consultar Cliente
def test_r13_consultar_cliente():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    # Consulta clientes pré-cadastrados
    for index, cpf in enumerate(CLIENTES_TESTE):
        resp = requests.get(URL + "/clientes/" + cpf, 
                         headers=HEADERS)
        assert resp.status_code==200
        r = resp.json()
        assert r["cpf"] == cpf
        assert r["nome"] == CLIENTES_NOME_TESTE[index]
        assert r["email"] == CLIENTES_EMAIL_TESTE[index]
        assert r["conta"]

    cache = recuperar_cache()

    # consulta o cpf recém cadastrado
    cpf = cache["autocad1_cpf"]
    email = cache["autocad1_email"]
    resp = requests.get(URL + "/clientes/" + cpf, 
                         headers=HEADERS)
    assert resp.status_code==200
    r = resp.json()
    assert r["cpf"] == cpf
    assert r["email"] == email

    # consulta o cpf recém rejeitado
    cpf = cache["autocad2_cpf"]
    resp = requests.get(URL + "/clientes/" + cpf, 
                         headers=HEADERS)
    assert resp.status_code==404

## OK
def test_r14_consultar_3_melhores_clientes():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    params = {
        "filtro": "melhores_clientes"
    }
    resp = requests.get(URL + "/clientes", 
                         headers=HEADERS,
                         params=params)
    
    assert resp.status_code==200

    r = resp.json()
    saldo_ant = 999999999999.9
    assert len(r) == 3
    assert r[0]["cpf"] == "58872160006"
    assert r[1]["cpf"] == "76179646090"
    assert r[2]["cpf"] == "12912861012"
    for cli in r:
        assert float(cli["saldo"]) <= saldo_ant
        saldo_ant = float(cli["saldo"])

def test_r02_logout_gerente():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    logout(GYANDULA["email"], token)

    # testa se fez logout correto
    resp = requests.get(URL + "/clientes", 
                         headers=HEADERS) 
    assert resp.status_code==401


########## Operações de Cliente aqui

def test_r02_login_cliente_aprovado_novamente():

    cache = recuperar_cache()
    login(cache["autocad1_email"], cache["autocad1_senha"], cache["autocad1_cpf"], "CLIENTE", True)


def test_r03_tela_inicial_cliente():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    cache = recuperar_cache()
    cpf = cache["autocad1_cpf"]
    conta = cache["autocad1_conta"]
    r = requests.get(URL + f"/contas/{conta}/saldo", 
                         headers=HEADERS)
    
    assert r.status_code==200

    resp = r.json()
    assert resp["cliente"] == cpf
    assert resp["conta"] == conta
    assert resp["saldo"] == 0


def test_r04_alteracao_perfil():
    token = recuperar_token()
    cache = recuperar_cache()
    HEADERS["Authorization"] = token

    cpf = cache["autocad1_cpf"]
    email = cache["autocad1_email"]
    novo_nome = "Usuário 1 - Nome Alterado"
    novo_salario = 10000.0
    USUARIO1["cpf"] = cpf
    USUARIO1["email"] = email
    USUARIO1["nome"] = novo_nome
    USUARIO1["salario"] = novo_salario
    r = requests.put(URL + f"/clientes/{USUARIO1['cpf']}", 
                         headers=HEADERS,
                         json=USUARIO1)

    assert r.status_code==200

    resp = r.json()
    assert resp['cpf'] == cpf
    assert resp['nome'] == novo_nome
    assert resp['salario'] == novo_salario

    r = requests.get(URL + f"/clientes/{USUARIO1['cpf']}", 
                         headers=HEADERS)

    assert r.status_code==200

    resp = r.json()
    assert resp['cpf'] == cpf
    assert resp['salario'] == novo_salario
    assert resp['limite'] == novo_salario / 2
    assert resp['saldo'] == 0
    assert resp['gerente'] == GYANDULA['cpf']
    # saldo 
    # nome gerente

def test_r05_depositar():
    token = recuperar_token()
    cache = recuperar_cache()
    HEADERS["Authorization"] = token

    VALOR1 = gerar_valor_moeda(100, 500)
    VALORES = {
        "valor": VALOR1
    }
    cpf  = cache["autocad1_cpf"]
    conta  = cache["autocad1_conta"]
    gyandula_saldo_pos = cache["gyandula_saldo_pos"]

    r = requests.post(URL + f"/contas/{conta}/depositar", 
                         headers=HEADERS,
                         json=VALORES)

    assert r.status_code==200
    resp = r.json()
    assert resp["conta"] == conta
    assert resp["saldo"] == VALOR1
    data1 = resp["data"]
    
    r = requests.get(URL + f"/clientes/{cpf}", 
                         headers=HEADERS)
    assert r.status_code==200
    resp = r.json()
    assert resp['cpf'] == cpf
    assert resp['saldo'] == VALOR1

    gyandula_saldo_pos = round(gyandula_saldo_pos + VALOR1, 2)

    VALOR2 = gerar_valor_moeda(100, 500)
    VALORES = {
        "valor": VALOR2
    }
    cpf  = cache["autocad1_cpf"]
    conta  = cache["autocad1_conta"]
    saldo = round(VALOR1 + VALOR2, 2)

    r = requests.post(URL + f"/contas/{conta}/depositar", 
                         headers=HEADERS,
                         json=VALORES)

    assert r.status_code==200
    resp = r.json()
    assert resp["conta"] == conta
    assert resp["saldo"] == saldo
    data2 = resp["data"]
    
    r = requests.get(URL + f"/clientes/{cpf}", 
                         headers=HEADERS)
    assert r.status_code==200
    resp = r.json()
    assert resp['cpf'] == cpf
    assert resp['saldo'] == saldo
    gyandula_saldo_pos = round(gyandula_saldo_pos + VALOR2, 2)

    inserir_ou_alterar_cache([ 
        ("autocad1_deposito_1", VALOR1),
        ("autocad1_deposito_1_data", data1),
        ("autocad1_deposito_2", VALOR2),
        ("autocad1_deposito_2_data", data2),
        ("autocad1_saldo", saldo),
        ("gyandula_saldo_pos", gyandula_saldo_pos)
    ])

def test_r06_sacar():
    token = recuperar_token()
    cache = recuperar_cache()
    HEADERS["Authorization"] = token

    VALOR1 = gerar_valor_moeda(50, 100)
    VALORES = {
        "valor": VALOR1
    }
    cpf  = cache["autocad1_cpf"]
    conta  = cache["autocad1_conta"]
    saldo  = cache["autocad1_saldo"]
    gyandula_saldo_pos  = cache["gyandula_saldo_pos"]


    saldo = round(saldo - VALOR1, 2)
    r = requests.post(URL + f"/contas/{conta}/sacar", 
                         headers=HEADERS,
                         json=VALORES)

    assert r.status_code==200
    resp = r.json()
    assert resp["conta"] == conta
    assert resp["saldo"] == saldo
    data1 = resp["data"]
    
    gyandula_saldo_pos = round(gyandula_saldo_pos - VALOR1, 2)

    r = requests.get(URL + f"/clientes/{cpf}", 
                         headers=HEADERS)
    assert r.status_code==200
    resp = r.json()
    assert resp['cpf'] == cpf
    assert resp['saldo'] == saldo

    VALOR2 = gerar_valor_moeda(50, 100)
    VALORES = {
        "valor": VALOR2
    }
    cpf  = cache["autocad1_cpf"]
    conta  = cache["autocad1_conta"]

    saldo = round(saldo - VALOR2, 2)

    r = requests.post(URL + f"/contas/{conta}/sacar", 
                         headers=HEADERS,
                         json=VALORES)

    assert r.status_code==200
    resp = r.json()
    assert resp["conta"] == conta
    assert resp["saldo"] == saldo
    data2 = resp["data"]

    gyandula_saldo_pos = round(gyandula_saldo_pos - VALOR2, 2)
    
    r = requests.get(URL + f"/clientes/{cpf}", 
                         headers=HEADERS)
    assert r.status_code==200
    resp = r.json()
    assert resp['cpf'] == cpf
    assert resp['saldo'] == saldo

    inserir_ou_alterar_cache([ 
        ("autocad1_saque_1", VALOR1),
        ("autocad1_saque_1_data", data1),
        ("autocad1_saque_2", VALOR2),
        ("autocad1_saque_2_data", data2),
        ("autocad1_saldo", saldo),
        ("gyandula_saldo_pos", gyandula_saldo_pos)
    ])

def test_r07_transferir():
    token = recuperar_token()
    cache = recuperar_cache()
    HEADERS["Authorization"] = token

    cpf  = cache["autocad1_cpf"]
    email = cache["autocad1_email"]
    conta  = cache["autocad1_conta"]
    saldo = cache["autocad1_saldo"]
    gyandula_saldo_pos  = cache["gyandula_saldo_pos"]
    genieve_saldo_pos  = cache["genieve_saldo_pos"]

    VALOR1 = gerar_valor_moeda(1, saldo/2)
    VALORES = {
        "destino": CATHARYNA["conta"],
        "valor": VALOR1
    }
    saldo = round(saldo - VALOR1, 2)
    gyandula_saldo_pos = round(gyandula_saldo_pos - VALOR1, 2)
    geniveve_saldo_pos = round(genieve_saldo_pos + VALOR1, 2)

    r = requests.post(URL + f"/contas/{conta}/transferir", 
                         headers=HEADERS,
                         json=VALORES)

    assert r.status_code==200
    resp = r.json()
    assert resp["conta"] == conta
    assert resp["destino"] == CATHARYNA["conta"]
    assert resp["valor"] == VALOR1
    assert resp["saldo"] == gyandula_saldo_pos    
    data = resp["data"]
    
    r = requests.get(URL + f"/clientes/{cpf}", 
                         headers=HEADERS)
    assert r.status_code==200
    resp = r.json()
    assert resp['cpf'] == cpf
    assert resp['saldo'] == saldo

    cat_saldo = round(CATHARYNA["saldo"] + VALOR1, 2)
    inserir_ou_alterar_cache([ 
        ("autocad1_transferencia_1", VALOR1),
        ("autocad1_transferencia_1_data", data),
        ("autocad1_transferencia_1_destino", CATHARYNA["conta"]),
        ("catharyna_saldo", cat_saldo),
        ("autocad1_saldo", saldo),
        ("gyandula_saldo_pos", gyandula_saldo_pos),
        ("genieve_saldo_pos", geniveve_saldo_pos)
    ])

    logout(email, token)
    login(CATHARYNA["email"], CATHARYNA["senha"], CATHARYNA["cpf"], CATHARYNA["tipo"])
    token = recuperar_token()
    HEADERS["Authorization"] = token

    r = requests.get(URL + f"/clientes/{CATHARYNA["cpf"]}", 
                         headers=HEADERS)
    assert r.status_code==200
    resp = r.json()
    assert resp['cpf'] == CATHARYNA["cpf"]
    assert resp['saldo'] == cat_saldo

    token = recuperar_token()
    logout(CATHARYNA["email"], token)
    
    cpf  = cache["autocad1_cpf"]
    email = cache["autocad1_email"]
    senha  = cache["autocad1_senha"]
    login(email, senha, cpf, "CLIENTE")


def test_r08_consulta_extrato():
    token = recuperar_token()
    cache = recuperar_cache()
    HEADERS["Authorization"] = token

    cpf = cache["autocad1_cpf"]
    conta = cache["autocad1_conta"]
    saldo = cache["autocad1_saldo"]

    r = requests.get(URL + f"/contas/{conta}/extrato", 
                         headers=HEADERS)
    assert r.status_code==200
    resp = r.json()
    assert resp['conta'] == conta
    assert resp['saldo'] == saldo
    assert len(resp['movimentacoes']) == 5

    # valida movimentacoes
    m = resp["movimentacoes"][0]
    assert m["tipo"] == "depósito"
    assert m["origem"] == conta
    assert m["data"] == cache["autocad1_deposito_1_data"]
    assert m["valor"] == cache["autocad1_deposito_1"]
    m = resp["movimentacoes"][1]
    assert m["tipo"] == "depósito"
    assert m["origem"] == conta
    assert m["data"] == cache["autocad1_deposito_2_data"]
    assert m["valor"] == cache["autocad1_deposito_2"]
    m = resp["movimentacoes"][2]
    assert m["tipo"] == "saque"
    assert m["origem"] == conta
    assert m["data"] == cache["autocad1_saque_1_data"]
    assert m["valor"] == cache["autocad1_saque_1"]
    m = resp["movimentacoes"][3]
    assert m["tipo"] == "saque"
    assert m["origem"] == conta
    assert m["data"] == cache["autocad1_saque_2_data"]
    assert m["valor"] == cache["autocad1_saque_2"]
    m = resp["movimentacoes"][4]
    assert m["tipo"] == "transferência"
    assert m["origem"] == conta
    assert m["destino"] == CATHARYNA["conta"]
    assert m["data"] == cache["autocad1_transferencia_1_data"]
    assert m["valor"] == cache["autocad1_transferencia_1"]



def test_r02_logout_cliente_aprovado():
    token = recuperar_token()
    cache = recuperar_cache()
    logout(cache["autocad1_email"], token)

    # TODO Arrumar isso aqui
    # resp = requests.get(URL + "/clientes", 
    #                      headers=HEADERS) 
    # assert resp.status_code==401


def test_r02_login_administrador():

    login(ADAMANTIO["email"], ADAMANTIO["senha"], ADAMANTIO["cpf"], ADAMANTIO["tipo"])


def test_r15_tela_inicial_administrador():
    token = recuperar_token()
    cache = recuperar_cache()
    HEADERS["Authorization"] = token
    params = {
        "filtro": "dashboard"
    }

    resp = requests.get(URL + "/gerentes", 
                         headers=HEADERS, 
                         params=params)
    
    assert resp.status_code==200
    lista = resp.json()

    gyandula_saldo_pos = cache["gyandula_saldo_pos"]
    gyandula_saldo_neg = cache["gyandula_saldo_neg"]
    genieve_saldo_pos = cache["genieve_saldo_pos"]
    genieve_saldo_neg = cache["genieve_saldo_neg"]
    godophredo_saldo_pos = cache["godophredo_saldo_pos"]
    godophredo_saldo_neg = cache["godophredo_saldo_neg"]

    # ordenados pelo maior saldo positivo
    assert lista[0]["gerente"]["cpf"] == GENIEVE["cpf"]
    assert lista[0]["gerente"]["nome"] == GENIEVE["nome"]
    assert lista[0]["clientes"] == 2
    assert lista[0]["saldo_positivo"] == genieve_saldo_pos
    assert lista[0]["saldo_negativo"] == genieve_saldo_neg
    assert lista[1]["gerente"]["cpf"] == GODOPHREDO["cpf"]
    assert lista[1]["gerente"]["nome"] == GODOPHREDO["nome"]
    assert lista[1]["saldo_positivo"] == godophredo_saldo_pos
    assert lista[1]["saldo_negativo"] == godophredo_saldo_neg
    assert lista[1]["clientes"] == 2
    assert lista[2]["gerente"]["cpf"] == GYANDULA["cpf"]
    assert lista[2]["gerente"]["nome"] == GYANDULA["nome"]
    assert lista[2]["saldo_positivo"] == gyandula_saldo_pos
    assert lista[2]["saldo_negativo"] == gyandula_saldo_neg
    assert lista[2]["clientes"] == 2


def test_r16_relatorio_clientes():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    cache = recuperar_cache()
    params = {
        "filtro": "adm_relatorio_clientes"
    }

    resp = requests.get(URL + "/clientes", 
                         headers=HEADERS, 
                         params=params)
    
    assert resp.status_code==200
    lista = resp.json()

    # verifica se está em ordem por nome
    nome_ant = ""
    for cli in lista:
        assert cli["cpf"] in CLIENTES_TESTE
        assert nome_ant <= cli["nome"]
        nome_ant = cli["nome"]

        # TODO: é bom verificar todos os clientes retornados

def test_r17_crud_gerente_insercao():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    cache = recuperar_cache()

    # não pode inserir com o mesmo CPF
    resp = requests.post(URL + "/gerentes", 
                         headers=HEADERS, 
                         json=GYANDULA)
    
    assert resp.status_code==409

    GERENTE1["cpf"] = gerar_cpf()
    GERENTE1["nome"] = "Gaxtrúlio"
    GERENTE1["senha"] = GERENTE1_SENHA
    GERENTE1["email"] = gerar_email()
    GERENTE1["tipo"] = "GERENTE"

    resp = requests.post(URL + "/gerentes", 
                         headers=HEADERS, 
                         json=GERENTE1)
    
    assert resp.status_code==201
    obj = resp.json()

    assert obj["cpf"] == GERENTE1["cpf"]

    resp = requests.get(URL + "/gerentes/" + GERENTE1["cpf"], 
                         headers=HEADERS)
    assert resp.status_code==200
    r = resp.json()
    assert r["cpf"] == GERENTE1["cpf"]
    assert r["nome"] == GERENTE1["nome"]
    assert r["email"] == GERENTE1["email"]
    assert r["tipo"] == GERENTE1["tipo"]

    params = {
        "filtro": "dashboard"
    }
    resp = requests.get(URL + "/gerentes", 
                         headers=HEADERS, 
                         params=params)
    assert resp.status_code==200
    lista = resp.json()
    encontrou = False
    for g in lista:
        if g["gerente"]["cpf"] == GYANDULA["cpf"]:
            assert g["clientes"] == 1  # doou 1 cliente
        if g["gerente"]["cpf"] == GERENTE1["cpf"]:
            assert g["clientes"] == 1  # precisa receber 1 cliente
            encontrou = True

    assert encontrou

    lista = cache["lista_gerentes"]
    lista.append(GERENTE1["cpf"])
    inserir_ou_alterar_cache([
        ("lista_gerentes", lista)
    ])

def test_r02_login_novo_gerente():
    # desloga do admin
    token = recuperar_token()
    logout(ADAMANTIO["email"], token)

    # loga como o novo gerente criado
    login(GERENTE1["email"], GERENTE1_SENHA, GERENTE1["cpf"], tipo="GERENTE")

    # desloga do gerente
    token = recuperar_token()
    logout(GERENTE1["email"], token)

    # loga novamente como admin
    login(ADAMANTIO["email"], ADAMANTIO["senha"], ADAMANTIO["cpf"], ADAMANTIO["tipo"])


def test_r18_crud_gerente_remocao():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    cache = recuperar_cache()

    ### TODO remover
    # params = {
    #     "filtro": "dashboard"
    # }
    # resp = requests.get(URL + "/gerentes", 
    #                      headers=HEADERS, 
    #                      params=params)
    # assert resp.status_code==200
    # lista = resp.json()
    # print(lista)

    ###

    resp = requests.delete(URL + "/gerentes/" + GODOPHREDO["cpf"], 
                         headers=HEADERS)
    
    assert resp.status_code==200
    lista = resp.json()

    resp = requests.get(URL + "/gerentes/" + GODOPHREDO["cpf"], 
                         headers=HEADERS)
    assert resp.status_code==404
    r = resp.json()

    params = {
        "filtro": "dashboard"
    }
    resp = requests.get(URL + "/gerentes", 
                         headers=HEADERS, 
                         params=params)
    assert resp.status_code==200
    lista = resp.json()
    # TODO  decidir para qual vai a conta
    for g in lista:
        assert g["gerente"]["cpf"] != GODOPHREDO["cpf"]
        # if g["gerente"]["cpf"] == GUEDENCIA["cpf"]:
        #     assert g["clientes"] == 3
        #     break

    lista = cache["lista_gerentes"]
    lista.remove(GODOPHREDO["cpf"])
    inserir_ou_alterar_cache([
        ("lista_gerentes", lista)
    ])


def test_r19_crud_gerente_listagem():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    cache = recuperar_cache()
    lista = cache["lista_gerentes"]

    resp = requests.get(URL + "/gerentes", 
                         headers=HEADERS)
    
    assert resp.status_code==200
    resp = resp.json()

    # TODO arrumar aqui
    # garante que retorna a quantidade certa
    assert len(resp) == len(lista)
    for g in resp:
        # garante que o gerente retornado deveria estar lá
        assert g["cpf"] in lista
        lista.remove(g["cpf"])

    # garante que não sobrou nenhum gerente na base
    assert len(lista) == 0


def test_r20_crud_gerente_alteracao():
    token = recuperar_token()
    HEADERS["Authorization"] = token

    cache = recuperar_cache()

    GERENTE1["cpf"] = "012345678901" # vamos mandar um cpf errado para validar
    GERENTE1["nome"] = GYANDULA_NOME_ALTERADO
    GERENTE1["email"] = GYANDULA_EMAIL_ALTERADO
    GERENTE1["tipo"] = GYANDULA["tipo"]
    # TODO Verificar a alteração de senha
    resp = requests.put(URL + "/gerentes/" + GYANDULA["cpf"], 
                         headers=HEADERS, 
                         json=GERENTE1)
    
    assert resp.status_code==200
    r = resp.json()
    assert r["cpf"] == GYANDULA["cpf"]
    assert r["nome"] == GYANDULA_NOME_ALTERADO
    assert r["email"] == GYANDULA_EMAIL_ALTERADO
    assert r["tipo"] == GYANDULA["tipo"]

    resp = requests.get(URL + "/gerentes/" + GYANDULA["cpf"], 
                         headers=HEADERS)
    assert resp.status_code==200
    r = resp.json()
    assert r["cpf"] == GYANDULA["cpf"]
    assert r["nome"] == GYANDULA_NOME_ALTERADO
    assert r["email"] == GYANDULA_EMAIL_ALTERADO
    assert r["tipo"] == GYANDULA["tipo"]

