import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateCategoriaInput } from './create-categoria.input';

@InputType()
export class UpdateCategoriaInput extends PartialType(CreateCategoriaInput) {
    @Field(() => Int)
    id_categoria: number;
}
