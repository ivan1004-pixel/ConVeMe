import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
@Entity('eventos')
export class Evento {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id_evento: number;

    @Field()
    @Column({ length: 255 })
    nombre: string;

    @Field({ nullable: true })
    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Field()
    @Column({ type: 'datetime' })
    fecha_inicio: Date;

    @Field()
    @Column({ type: 'datetime' })
    fecha_fin: Date;

    // Los dejamos como Int directo para evitar errores si aún no existen los módulos de Escuela/Municipio
    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    escuela_id: number;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    municipio_id: number;

    @Field(() => Float, { nullable: true })
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    costo_stand: number;

    @Field()
    @Column({ default: true })
    activo: boolean;
}
