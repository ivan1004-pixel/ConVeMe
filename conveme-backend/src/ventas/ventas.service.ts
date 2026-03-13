import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaInput } from './dto/create-venta.input';
import { UpdateVentaInput } from './dto/update-venta.input';

@Injectable()
export class VentasService {
    constructor(
        @InjectRepository(Venta)
        private readonly ventaRepository: Repository<Venta>,
    ) {}

    async create(createVentaInput: CreateVentaInput): Promise<Venta> {
        const nuevaVenta = this.ventaRepository.create(createVentaInput);
        const guardada = await this.ventaRepository.save(nuevaVenta);
        return this.findOne(guardada.id_venta);
    }

    async findAll(): Promise<Venta[]> {
        return this.ventaRepository.find({
            relations: ['cliente', 'vendedor', 'detalles', 'detalles.producto']
        });
    }

    async findOne(id_venta: number): Promise<Venta> {
        const venta = await this.ventaRepository.findOne({
            where: { id_venta },
            relations: ['cliente', 'vendedor', 'detalles', 'detalles.producto'],
        });
        if (!venta) throw new NotFoundException(`Venta #${id_venta} no encontrada`);
        return venta;
    }

    async update(id_venta: number, updateVentaInput: UpdateVentaInput): Promise<Venta> {
        const venta = await this.findOne(id_venta);
        Object.assign(venta, updateVentaInput);
        await this.ventaRepository.save(venta);
        return this.findOne(id_venta);
    }

    async remove(id_venta: number): Promise<boolean> {
        const resultado = await this.ventaRepository.delete(id_venta);
        return (resultado.affected ?? 0) > 0;
    }
}
