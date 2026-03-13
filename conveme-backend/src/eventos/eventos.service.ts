import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from './entities/evento.entity';
import { CreateEventoInput } from './dto/create-evento.input';
import { UpdateEventoInput } from './dto/update-evento.input';

@Injectable()
export class EventosService {
    constructor(
        @InjectRepository(Evento)
        private readonly eventoRepository: Repository<Evento>,
    ) {}

    async create(createEventoInput: CreateEventoInput): Promise<Evento> {
        const nuevo = this.eventoRepository.create(createEventoInput);
        return this.eventoRepository.save(nuevo);
    }

    async findAll(): Promise<Evento[]> {
        return this.eventoRepository.find();
    }

    async findOne(id_evento: number): Promise<Evento> {
        const evento = await this.eventoRepository.findOne({ where: { id_evento } });
        if (!evento) throw new NotFoundException(`Evento #${id_evento} no encontrado`);
        return evento;
    }

    async update(id_evento: number, updateEventoInput: UpdateEventoInput): Promise<Evento> {
        const evento = await this.findOne(id_evento);
        Object.assign(evento, updateEventoInput);
        return this.eventoRepository.save(evento);
    }

    async remove(id_evento: number): Promise<boolean> {
        const resultado = await this.eventoRepository.delete(id_evento);
        return (resultado.affected ?? 0) > 0;
    }
}
