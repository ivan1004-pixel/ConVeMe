import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateDetAsignacionInput {
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

    // Recibimos los productos que se lleva el vendedor
    @Field(() => [CreateDetAsignacionInput])
    detalles: CreateDetAsignacionInput[];
}
