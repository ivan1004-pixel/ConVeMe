import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tamano } from './tamano.entity';
import { CreateTamanoInput } from './dto/create-tamano.input';
import { UpdateTamanoInput } from './dto/update-tamano.input';

@Injectable()
export class TamanosService {
    constructor(
        @InjectRepository(Tamano)
        private readonly tamanoRepository: Repository<Tamano>,
    ) {}

    async create(createTamanoInput: CreateTamanoInput): Promise<Tamano> {
        const nuevo = this.tamanoRepository.create(createTamanoInput);
        const guardado = await this.tamanoRepository.save(nuevo);
        return this.findOne(guardado.id_tamano); // Quitamos la ñ
    }

    async findAll(): Promise<Tamano[]> {
        return this.tamanoRepository.find();
    }

    async findOne(id_tamano: number): Promise<Tamano> {
        const tamano = await this.tamanoRepository.findOne({ where: { id_tamano } });
        if (!tamano) throw new NotFoundException(`Tamaño #${id_tamano} no encontrado`);
        return tamano;
    }

    async update(id_tamano: number, updateTamanoInput: UpdateTamanoInput): Promise<Tamano> {
        const tamano = await this.findOne(id_tamano);
        Object.assign(tamano, updateTamanoInput);
        await this.tamanoRepository.save(tamano);
        return this.findOne(id_tamano);
    }

    async remove(id_tamano: number): Promise<boolean> {
        const resultado = await this.tamanoRepository.delete(id_tamano);
        return (resultado.affected ?? 0) > 0;
    }
}
