import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateUsuarioInput } from './create-usuario.input';

@InputType()
export class UpdateUsuarioInput extends PartialType(CreateUsuarioInput) {
    @Field(() => Int)
    id_usuario: number;

    @Field({ nullable: true })
    activo?: boolean;
}
