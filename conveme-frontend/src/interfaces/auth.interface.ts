export interface LoginResponse {
    data: {
        login: {
            access_token: string;
            usuario: {
                id_usuario: number;
                rol: string;
            };
        };
    };
}
