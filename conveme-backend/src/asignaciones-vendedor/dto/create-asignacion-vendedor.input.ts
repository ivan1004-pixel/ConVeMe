import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateDetAsignacionInput {
    // 👇 ESTO ES LO QUE FALTABA PARA QUE GRAPHQL DEJE PASAR EL ID 👇
    @Field(() => Int, { nullable: true })
    id_det_asignacion?: number;

    @Field(() => Int)
    producto_id: number;

    @Field(() => Int)
    cantidad_asignada: number;
}

@InputType()
export class CreateAsignacionVendedorInput {
    @Field(() => Int)
    vendedor_id: number;

    @Field({ nullable: true })
    estado?: string;

    @Field(() => [CreateDetAsignacionInput])
    detalles: CreateDetAsignacionInput[];
}
