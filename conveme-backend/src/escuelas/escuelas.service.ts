import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Escuela } from './escuela.entity';
import { CreateEscuelaInput } from './dto/create-escuela.input';
import { UpdateEscuelaInput } from './dto/update-escuela.input';

@Injectable()
export class EscuelasService {
    constructor(
        @InjectRepository(Escuela)
        private readonly escuelaRepository: Repository<Escuela>,
    ) {}

    async create(createEscuelaInput: CreateEscuelaInput): Promise<Escuela> {
        const nuevaEscuela = this.escuelaRepository.create(createEscuelaInput);
        const guardada = await this.escuelaRepository.save(nuevaEscuela);

        // LA MAGIA: Retornamos con todo el árbol geográfico
        return this.findOne(guardada.id_escuela);
    }

    async findAll(): Promise<Escuela[]> {
        return this.escuelaRepository.find({
            relations: ['municipio', 'municipio.estado', 'municipio.estado.pais']
        });
    }

    async findOne(id_escuela: number): Promise<Escuela> {
        const escuela = await this.escuelaRepository.findOne({
            where: { id_escuela },
            relations: ['municipio', 'municipio.estado', 'municipio.estado.pais'],
        });
        if (!escuela) throw new NotFoundException(`Escuela #${id_escuela} no encontrada`);
        return escuela;
    }

    async update(id_escuela: number, updateEscuelaInput: UpdateEscuelaInput): Promise<Escuela> {
        const escuela = await this.findOne(id_escuela);
        Object.assign(escuela, updateEscuelaInput);
        await this.escuelaRepository.save(escuela);

        return this.findOne(id_escuela);
    }

    async remove(id_escuela: number): Promise<boolean> {
        const resultado = await this.escuelaRepository.delete(id_escuela);
        return (resultado.affected ?? 0) > 0;
    }
}
