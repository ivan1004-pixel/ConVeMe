import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Usuario } from '../usuarios/usuario.entity';
import { Municipio } from '../municipios/municipio.entity';

@ObjectType()
@Entity('empleados')
export class Empleado {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id_empleado: number;

    @Field(() => Int)
    @Column({ unique: true })
    usuario_id: number;

    // Relación Uno a Uno. Un empleado es un usuario en el sistema.
    @Field(() => Usuario, { nullable: true })
    @OneToOne(() => Usuario)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @Field()
    @Column()
    nombre_completo: string;

    @Field()
    @Column({ unique: true })
    email: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    telefono: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    puesto: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    calle_y_numero: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    colonia: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    codigo_postal: string;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    municipio_id: number;

    // DOCUMENTACIÓN: Relación Muchos a Uno con Municipio
    @Field(() => Municipio, { nullable: true })
    @ManyToOne(() => Municipio)
    @JoinColumn({ name: 'municipio_id' })
    municipio: Municipio;
}
