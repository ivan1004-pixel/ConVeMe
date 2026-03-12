import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('categorias')
export class Categoria {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id_categoria: number;

    @Field()
    @Column({ unique: true })
    nombre: string;
}
