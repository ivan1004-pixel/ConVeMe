import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateEscuelaInput } from './create-escuela.input';

@InputType()
export class UpdateEscuelaInput extends PartialType(CreateEscuelaInput) {
    @Field(() => Int)
    id_escuela: number;

    // Aquí sí permitimos enviar "activa" por si queremos dar de baja una escuela
    @Field({ nullable: true })
    activa?: boolean;
}
