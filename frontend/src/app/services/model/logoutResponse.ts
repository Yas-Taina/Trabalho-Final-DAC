export interface LoginResponse { 
    token: string;
}

export interface LogoutResponse { 
    cpf?: string;
    nome?: string;
    email?: string;
    tipo?: string;
}

