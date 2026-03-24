import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
        // 👇 VALIDACIÓN: No pueden existir dos productos con el mismo SKU o Código
        const existeSku = await this.productoRepository.findOne({ where: { sku: createProductoInput.sku } });
        if (existeSku) throw new ConflictException(`El SKU ${createProductoInput.sku} ya está registrado.`);

        const nuevo = this.productoRepository.create(createProductoInput);
        const guardado = await this.productoRepository.save(nuevo);

        return this.findOne(guardado.id_producto);
    }

    async findAll(): Promise<Producto[]> {
        return this.productoRepository.find({
            where: { activo: true }, // 👇 FILTRO: Solo mostramos los activos
            relations: ['categoria', 'tamano']
        });
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
        // Validar SKU único si se está intentando cambiar
        if (updateProductoInput.sku) {
            const existeSku = await this.productoRepository.findOne({ where: { sku: updateProductoInput.sku } });
            if (existeSku && existeSku.id_producto !== id_producto) {
                throw new ConflictException(`El SKU ${updateProductoInput.sku} ya está siendo usado por otro producto.`);
            }
        }

        // 👇 MAGIA: preload para relaciones
        const producto = await this.productoRepository.preload(updateProductoInput);
        if (!producto) throw new NotFoundException(`Producto #${id_producto} no encontrado`);

        await this.productoRepository.save(producto);
        return this.findOne(id_producto);
    }

    async remove(id_producto: number): Promise<Producto> {
        const producto = await this.findOne(id_producto);
        // 👇 SOFT DELETE: Apagamos el producto para no arruinar el historial de ventas
        producto.activo = false;
        await this.productoRepository.save(producto);
        return producto;
    }
}
