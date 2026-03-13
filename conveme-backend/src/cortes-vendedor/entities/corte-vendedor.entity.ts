import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Vendedor } from '../../vendedores/vendedor.entity';
import { DetCorteInventario } from './det-corte-inventario.entity';

@ObjectType()
@Entity('cortes_vendedor')
export class CorteVendedor {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id_corte: number;

    @Field(() => Int)
    @Column()
    vendedor_id: number;

    @Field(() => Vendedor, { nullable: true })
    @ManyToOne(() => Vendedor)
    @JoinColumn({ name: 'vendedor_id' })
    vendedor: Vendedor;

    @Field()
    @CreateDateColumn()
    fecha_corte: Date;

    @Field(() => Float)
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total_ventas_reportadas: number;

    // Monto exacto en dinero, no porcentaje
    @Field(() => Float)
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total_comision_vendedor: number;

    @Field(() => Float)
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    monto_entregado_empresa: number;

    @Field()
    @Column({ default: 'Aprobado' }) // Aprobado, Pendiente, Con Diferencias
    estado: string;

    @Field(() => [DetCorteInventario], { nullable: true })
    @OneToMany(() => DetCorteInventario, detalle => detalle.corte, { cascade: true })
    detalles: DetCorteInventario[];
}
