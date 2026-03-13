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
    merma_o_perdida: number;
}

@InputType()
export class CreateCorteVendedorInput {
    @Field(() => Int)
    vendedor_id: number;

    @Field(() => Float)
    total_ventas_reportadas: number;

    @Field(() => Float)
    total_comision_vendedor: number;

    @Field(() => Float)
    monto_entregado_empresa: number;

    @Field({ nullable: true })
    estado?: string;

    @Field(() => [CreateDetCorteInput])
    detalles: CreateDetCorteInput[];
}
