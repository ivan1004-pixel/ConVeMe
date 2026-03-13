import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorteVendedor } from './entities/corte-vendedor.entity';
import { CreateCorteVendedorInput } from './dto/create-corte-vendedor.input';
import { UpdateCorteVendedorInput } from './dto/update-corte-vendedor.input';

@Injectable()
export class CortesVendedorService {
    constructor(
        @InjectRepository(CorteVendedor)
        private readonly corteRepository: Repository<CorteVendedor>,
    ) {}

    async create(createCorteInput: CreateCorteVendedorInput): Promise<CorteVendedor> {
        const nuevo = this.corteRepository.create(createCorteInput);
        const guardado = await this.corteRepository.save(nuevo);
        return this.findOne(guardado.id_corte);
    }

    async findAll(): Promise<CorteVendedor[]> {
        return this.corteRepository.find({
            // Le agregamos 'asignacion' para que se traiga el folio original
            relations: ['vendedor', 'asignacion', 'detalles', 'detalles.producto']
        });
    }

    async findOne(id_corte: number): Promise<CorteVendedor> {
        const corte = await this.corteRepository.findOne({
            where: { id_corte },
            relations: ['vendedor', 'asignacion', 'detalles', 'detalles.producto'],
        });
        if (!corte) throw new NotFoundException(`Corte #${id_corte} no encontrado`);
        return corte;
    }

    async update(id_corte: number, updateCorteInput: UpdateCorteVendedorInput): Promise<CorteVendedor> {
        const corte = await this.findOne(id_corte);
        Object.assign(corte, updateCorteInput);
        await this.corteRepository.save(corte);
        return this.findOne(id_corte);
    }

    async remove(id_corte: number): Promise<boolean> {
        const resultado = await this.corteRepository.delete(id_corte);
        return (resultado.affected ?? 0) > 0;
    }
}
