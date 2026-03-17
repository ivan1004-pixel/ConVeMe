import { convemeApi } from '../api/convemeApi';
import type { LoginResponse } from '../interfaces/auth.interface';

export const loginService = async (username: string, password_raw: string) => {
  // Nota: Usamos password_raw o password según lo que pida tu backend para el Login
  const query = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        access_token
        usuario {
          id_usuario
          rol
        }
      }
    }
  `;

  const { data } = await convemeApi.post<LoginResponse>('', {
    query,
    variables: { username, password: password_raw },
  });

  // Si GraphQL nos devuelve un error (ej. contraseña incorrecta)
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data.login;
};
