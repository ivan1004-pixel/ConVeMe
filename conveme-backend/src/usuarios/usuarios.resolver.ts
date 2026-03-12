// SOLUCIÓN TS2552: Agregamos 'Int' en esta primera línea
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.entity';
import { CreateUsuarioInput } from './dto/create-usuario.input';
import { UpdateUsuarioInput } from './dto/update-usuario.input';

@Resolver(() => Usuario)
export class UsuariosResolver {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Mutation(() => Usuario)
    createUsuario(@Args('createUsuarioInput') createUsuarioInput: CreateUsuarioInput) {
        return this.usuariosService.create(createUsuarioInput);
    }

    @Query(() => [Usuario], { name: 'usuarios' })
    findAll() {
        return this.usuariosService.findAll();
    }

    @Query(() => Usuario, { name: 'usuario' })
    findOne(@Args('id_usuario', { type: () => Int }) id_usuario: number) {
        return this.usuariosService.findOne(id_usuario);
    }

    @Mutation(() => Usuario)
    updateUsuario(@Args('updateUsuarioInput') updateUsuarioInput: UpdateUsuarioInput) {
        return this.usuariosService.update(updateUsuarioInput.id_usuario, updateUsuarioInput);
    }

    @Mutation(() => Boolean)
    removeUsuario(@Args('id_usuario', { type: () => Int }) id_usuario: number) {
        return this.usuariosService.remove(id_usuario);
    }
}
