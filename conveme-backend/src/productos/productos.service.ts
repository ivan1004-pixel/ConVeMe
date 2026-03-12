import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoInput } from './dto/create-producto.input';
import { UpdateProductoInput } from './dto/update-producto.input';

@Injectable()
export class ProductosService {
    constructor(
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
    ) {}

    async create(createProductoInput: CreateProductoInput): Promise<Producto> {
        const nuevo = this.productoRepository.create(createProductoInput);
        const guardado = await this.productoRepository.save(nuevo);
        // Retornamos recargando para traer la categoría y el tamaño
        return this.findOne(guardado.id_producto);
    }

    async findAll(): Promise<Producto[]> {
        return this.productoRepository.find({ relations: ['categoria', 'tamano'] });
    }

    async findOne(id_producto: number): Promise<Producto> {
        const producto = await this.productoRepository.findOne({
            where: { id_producto },
            relations: ['categoria', 'tamano'],
        });
        if (!producto) throw new NotFoundException(`Producto #${id_producto} no encontrado`);
        return producto;
    }

    async update(id_producto: number, updateProductoInput: UpdateProductoInput): Promise<Producto> {
        const producto = await this.findOne(id_producto);
        Object.assign(producto, updateProductoInput);
        await this.productoRepository.save(producto);
        return this.findOne(id_producto);
    }

    async remove(id_producto: number): Promise<boolean> {
        const resultado = await this.productoRepository.delete(id_producto);
        return (resultado.affected ?? 0) > 0;
    }
}
