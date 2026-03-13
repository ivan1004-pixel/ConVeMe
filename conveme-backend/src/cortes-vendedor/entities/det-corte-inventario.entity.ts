import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CorteVendedor } from './corte-vendedor.entity';
import { Producto } from '../../productos/producto.entity';

@ObjectType()
@Entity('det_cortes_inventario')
export class DetCorteInventario {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id_det_corte: number;

    @Field(() => Int)
    @Column()
    corte_id: number;

    @Field(() => CorteVendedor, { nullable: true })
    @ManyToOne(() => CorteVendedor, corte => corte.detalles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'corte_id' })
    corte: CorteVendedor;

    @Field(() => Int)
    @Column()
    producto_id: number;

    @Field(() => Producto, { nullable: true })
    @ManyToOne(() => Producto)
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;

    @Field(() => Int)
    @Column({ default: 0 })
    cantidad_vendida: number;

    @Field(() => Int)
    @Column({ default: 0 })
    cantidad_devuelta: number; // Pines físicos que te regresan

    @Field(() => Int)
    @Column({ default: 0 })
    merma_o_perdida: number; // Pines que se perdieron o dañaron
}
