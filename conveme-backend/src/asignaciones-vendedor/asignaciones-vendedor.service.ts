import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsignacionVendedor } from './entities/asignacion-vendedor.entity';
import { CreateAsignacionVendedorInput } from './dto/create-asignacion-vendedor.input';
import { UpdateAsignacionVendedorInput } from './dto/update-asignacion-vendedor.input';

@Injectable()
export class AsignacionesVendedorService {
    constructor(
        @InjectRepository(AsignacionVendedor)
        private readonly asignacionRepository: Repository<AsignacionVendedor>,
    ) {}

    async create(createAsignacionInput: CreateAsignacionVendedorInput): Promise<AsignacionVendedor> {
        const nueva = this.asignacionRepository.create(createAsignacionInput);
        const guardada = await this.asignacionRepository.save(nueva);
        return this.findOne(guardada.id_asignacion);
    }

    async findAll(): Promise<AsignacionVendedor[]> {
        return this.asignacionRepository.find({
            relations: ['vendedor', 'detalles', 'detalles.producto']
        });
    }

    async findOne(id_asignacion: number): Promise<AsignacionVendedor> {
        const asignacion = await this.asignacionRepository.findOne({
            where: { id_asignacion },
            relations: ['vendedor', 'detalles', 'detalles.producto'],
        });
        if (!asignacion) throw new NotFoundException(`Asignación #${id_asignacion} no encontrada`);
        return asignacion;
    }

    async update(id_asignacion: number, updateAsignacionInput: UpdateAsignacionVendedorInput): Promise<AsignacionVendedor> {
        const asignacion = await this.findOne(id_asignacion);
        Object.assign(asignacion, updateAsignacionInput);
        await this.asignacionRepository.save(asignacion);
        return this.findOne(id_asignacion);
    }

    async remove(id_asignacion: number): Promise<boolean> {
        const resultado = await this.asignacionRepository.delete(id_asignacion);
        return (resultado.affected ?? 0) > 0;
    }
}
