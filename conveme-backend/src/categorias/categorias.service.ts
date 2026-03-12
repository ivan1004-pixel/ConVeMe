import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';
import { CreateCategoriaInput } from './dto/create-categoria.input';
import { UpdateCategoriaInput } from './dto/update-categoria.input';

@Injectable()
export class CategoriasService {
    constructor(
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
    ) {}

    async create(createCategoriaInput: CreateCategoriaInput): Promise<Categoria> {
        const nueva = this.categoriaRepository.create(createCategoriaInput);
        const guardada = await this.categoriaRepository.save(nueva);
        return this.findOne(guardada.id_categoria);
    }

    async findAll(): Promise<Categoria[]> {
        return this.categoriaRepository.find();
    }

    async findOne(id_categoria: number): Promise<Categoria> {
        const categoria = await this.categoriaRepository.findOne({ where: { id_categoria } });
        if (!categoria) throw new NotFoundException(`Categoría #${id_categoria} no encontrada`);
        return categoria;
    }

    async update(id_categoria: number, updateCategoriaInput: UpdateCategoriaInput): Promise<Categoria> {
        const categoria = await this.findOne(id_categoria);
        Object.assign(categoria, updateCategoriaInput);
        await this.categoriaRepository.save(categoria);
        return this.findOne(id_categoria);
    }

    async remove(id_categoria: number): Promise<boolean> {
        const resultado = await this.categoriaRepository.delete(id_categoria);
        return (resultado.affected ?? 0) > 0;
    }
}
