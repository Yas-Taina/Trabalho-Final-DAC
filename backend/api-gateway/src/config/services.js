export const SERVICES = {
    AUTH: process.env.AUTH_SERVICE || "http://localhost:8080/auth",
    CLIENTE: process.env.CLIENTE_SERVICE || "http://localhost:8080/clientes",
    CONTA: "http://localhost:8082/contas",
    GERENTE: "http://localhost:8083/gerentes",
    SAGA: process.env.SAGA_SERVICE || "http://localhost:8084/sagas"    
};