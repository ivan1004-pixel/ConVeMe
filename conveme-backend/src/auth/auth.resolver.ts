import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response.type';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    // Mutación que recibe credenciales y devuelve el token y usuario.
    @Mutation(() => AuthResponse)
    login(@Args('loginInput') loginInput: LoginInput) {
        return this.authService.login(loginInput);
    }
}
