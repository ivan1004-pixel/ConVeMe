import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateDetOrdenInput {
    @Field(() => Int)
    insumo_id: number;

    @Field(() => Float)
    cantidad_consumida: number;
}

@InputType()
export class CreateOrdenProduccionInput {
    @Field(() => Int)
    producto_id: number;

    @Field(() => Int)
    empleado_id: number;

    @Field(() => Int)
    cantidad_a_producir: number;

    @Field({ nullable: true })
    estado?: string;

    // Recibimos la lista de insumos que se van a consumir
    @Field(() => [CreateDetOrdenInput])
    detalles: CreateDetOrdenInput[];
}
