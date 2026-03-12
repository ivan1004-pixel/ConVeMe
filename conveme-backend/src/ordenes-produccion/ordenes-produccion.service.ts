import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenProduccion } from './entities/orden-produccion.entity';
import { CreateOrdenProduccionInput } from './dto/create-orden-produccion.input';
import { UpdateOrdenProduccionInput } from './dto/update-orden-produccion.input';

@Injectable()
export class OrdenesProduccionService {
    constructor(
        @InjectRepository(OrdenProduccion)
        private readonly ordenRepository: Repository<OrdenProduccion>,
    ) {}

    async create(createOrdenInput: CreateOrdenProduccionInput): Promise<OrdenProduccion> {
        const nuevaOrden = this.ordenRepository.create(createOrdenInput);
        const guardada = await this.ordenRepository.save(nuevaOrden);
        return this.findOne(guardada.id_orden_produccion);
    }

    async findAll(): Promise<OrdenProduccion[]> {
        return this.ordenRepository.find({
            relations: ['producto', 'empleado', 'detalles', 'detalles.insumo']
        });
    }

    async findOne(id_orden_produccion: number): Promise<OrdenProduccion> {
        const orden = await this.ordenRepository.findOne({
            where: { id_orden_produccion },
            relations: ['producto', 'empleado', 'detalles', 'detalles.insumo'],
        });
        if (!orden) throw new NotFoundException(`Orden #${id_orden_produccion} no encontrada`);
        return orden;
    }

    async update(id_orden_produccion: number, updateOrdenInput: UpdateOrdenProduccionInput): Promise<OrdenProduccion> {
        const orden = await this.findOne(id_orden_produccion);
        Object.assign(orden, updateOrdenInput);
        await this.ordenRepository.save(orden);
        return this.findOne(id_orden_produccion);
    }

    async remove(id_orden_produccion: number): Promise<boolean> {
        const resultado = await this.ordenRepository.delete(id_orden_produccion);
        return (resultado.affected ?? 0) > 0;
    }
}
