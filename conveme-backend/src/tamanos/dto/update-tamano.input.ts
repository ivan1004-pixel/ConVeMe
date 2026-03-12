import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateTamanoInput } from './create-tamano.input';

@InputType()
export class UpdateTamanoInput extends PartialType(CreateTamanoInput) {
    @Field(() => Int)
    id_tamano: number; // Quitamos la ñ
}
