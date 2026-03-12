import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendedor } from './vendedor.entity';
import { CreateVendedorInput } from './dto/create-vendedor.input';
import { UpdateVendedorInput } from './dto/update-vendedor.input';

@Injectable()
export class VendedoresService {
    constructor(
        @InjectRepository(Vendedor)
        private readonly vendedorRepository: Repository<Vendedor>,
    ) {}

    async create(createVendedorInput: CreateVendedorInput): Promise<Vendedor> {
        const nuevo = this.vendedorRepository.create(createVendedorInput);
        const guardado = await this.vendedorRepository.save(nuevo);
        return this.findOne(guardado.id_vendedor);
    }

    async findAll(): Promise<Vendedor[]> {
        return this.vendedorRepository.find({
            relations: ['usuario', 'escuela', 'municipio']
        });
    }

    async findOne(id_vendedor: number): Promise<Vendedor> {
        const vendedor = await this.vendedorRepository.findOne({
            where: { id_vendedor },
            relations: ['usuario', 'escuela', 'municipio'],
        });
        if (!vendedor) throw new NotFoundException(`Vendedor #${id_vendedor} no encontrado`);
        return vendedor;
    }

    async update(id_vendedor: number, updateVendedorInput: UpdateVendedorInput): Promise<Vendedor> {
        const vendedor = await this.findOne(id_vendedor);
        Object.assign(vendedor, updateVendedorInput);
        await this.vendedorRepository.save(vendedor);
        return this.findOne(id_vendedor);
    }

    async remove(id_vendedor: number): Promise<boolean> {
        const resultado = await this.vendedorRepository.delete(id_vendedor);
        return (resultado.affected ?? 0) > 0;
    }
}
