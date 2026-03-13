import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaBancaria } from './cuenta-bancaria.entity';
import { CreateCuentaBancariaInput } from './dto/create-cuenta-bancaria.input';
import { UpdateCuentaBancariaInput } from './dto/update-cuenta-bancaria.input';

@Injectable()
export class CuentasBancariasService {
    constructor(
        @InjectRepository(CuentaBancaria)
        private readonly cuentaRepository: Repository<CuentaBancaria>,
    ) {}

    async create(createCuentaInput: CreateCuentaBancariaInput): Promise<CuentaBancaria> {
        const nueva = this.cuentaRepository.create(createCuentaInput);
        const guardada = await this.cuentaRepository.save(nueva);
        return this.findOne(guardada.id_cuenta);
    }

    async findAll(): Promise<CuentaBancaria[]> {
        return this.cuentaRepository.find({ relations: ['vendedor'] });
    }

    async findOne(id_cuenta: number): Promise<CuentaBancaria> {
        const cuenta = await this.cuentaRepository.findOne({
            where: { id_cuenta },
            relations: ['vendedor'],
        });
        if (!cuenta) throw new NotFoundException(`Cuenta #${id_cuenta} no encontrada`);
        return cuenta;
    }

    async update(id_cuenta: number, updateCuentaInput: UpdateCuentaBancariaInput): Promise<CuentaBancaria> {
        const cuenta = await this.findOne(id_cuenta);
        Object.assign(cuenta, updateCuentaInput);
        await this.cuentaRepository.save(cuenta);
        return this.findOne(id_cuenta);
    }

    async remove(id_cuenta: number): Promise<boolean> {
        const resultado = await this.cuentaRepository.delete(id_cuenta);
        return (resultado.affected ?? 0) > 0;
    }
}
