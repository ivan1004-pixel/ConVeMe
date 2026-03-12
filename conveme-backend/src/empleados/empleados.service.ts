import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './empleado.entity';
import { CreateEmpleadoInput } from './dto/create-empleado.input';
import { UpdateEmpleadoInput } from './dto/update-empleado.input';

@Injectable()
export class EmpleadosService {
    constructor(
        @InjectRepository(Empleado)
        private readonly empleadoRepository: Repository<Empleado>,
    ) {}

    async create(createEmpleadoInput: CreateEmpleadoInput): Promise<Empleado> {
        const nuevoEmpleado = this.empleadoRepository.create(createEmpleadoInput);
        const guardado = await this.empleadoRepository.save(nuevoEmpleado);
        return this.findOne(guardado.id_empleado);
    }

    async findAll(): Promise<Empleado[]> {
        return this.empleadoRepository.find({
            // Traemos tanto el usuario para saber sus credenciales, como el municipio donde vive
            relations: ['usuario', 'usuario.rol', 'municipio', 'municipio.estado']
        });
    }

    async findOne(id_empleado: number): Promise<Empleado> {
        const empleado = await this.empleadoRepository.findOne({
            where: { id_empleado },
            relations: ['usuario', 'usuario.rol', 'municipio', 'municipio.estado'],
        });
        if (!empleado) throw new NotFoundException(`Empleado #${id_empleado} no encontrado`);
        return empleado;
    }

    async update(id_empleado: number, updateEmpleadoInput: UpdateEmpleadoInput): Promise<Empleado> {
        const empleado = await this.findOne(id_empleado);
        Object.assign(empleado, updateEmpleadoInput);
        await this.empleadoRepository.save(empleado);
        return this.findOne(id_empleado);
    }

    async remove(id_empleado: number): Promise<boolean> {
        const resultado = await this.empleadoRepository.delete(id_empleado);
        return (resultado.affected ?? 0) > 0;
    }
}
