export const SERVICES = {
    AUTH: process.env.AUTH_SERVICE || "http://localhost:8080/auth",
    CLIENTE: process.env.CLIENTE_SERVICE || "http://localhost:8081/clientes",
    CONTA: process.env.CONTA_SERVICE ||  "http://localhost:8083/contas",
    GERENTE: process.env.GERENTE_SERVICE || "http://localhost:8084/gerentes",
    SAGA: process.env.SAGA_SERVICE || "http://localhost:8085/sagas"
};