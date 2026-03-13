import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateDetCorteInput {
    @Field(() => Int)
    producto_id: number;

    @Field(() => Int, { defaultValue: 0 })
    cantidad_vendida: number;

    @Field(() => Int, { defaultValue: 0 })
    cantidad_devuelta: number;

    @Field(() => Int, { defaultValue: 0 })
    merma_reportada: number;
}

@InputType()
export class CreateCorteVendedorInput {
    @Field(() => Int)
    vendedor_id: number;

    @Field(() => Int)
    asignacion_id: number; // Agregado

    @Field(() => Float)
    dinero_esperado: number;

    @Field(() => Float)
    dinero_total_entregado: number;

    @Field(() => Float)
    diferencia_corte: number;

    @Field({ nullable: true })
    observaciones?: string;

    @Field(() => [CreateDetCorteInput])
    detalles: CreateDetCorteInput[];
}
