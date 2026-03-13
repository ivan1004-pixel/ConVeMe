import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CortesVendedorService } from './cortes-vendedor.service';
import { CorteVendedor } from './entities/corte-vendedor.entity';
import { CreateCorteVendedorInput } from './dto/create-corte-vendedor.input';
import { UpdateCorteVendedorInput } from './dto/update-corte-vendedor.input';

@Resolver(() => CorteVendedor)
export class CortesVendedorResolver {
    constructor(private readonly cortesVendedorService: CortesVendedorService) {}

    @Mutation(() => CorteVendedor)
    createCorteVendedor(@Args('createCorteVendedorInput') createCorteVendedorInput: CreateCorteVendedorInput) {
        return this.cortesVendedorService.create(createCorteVendedorInput);
    }

    @Query(() => [CorteVendedor], { name: 'cortesVendedor' })
    findAll() {
        return this.cortesVendedorService.findAll();
    }

    @Query(() => CorteVendedor, { name: 'corteVendedor' })
    findOne(@Args('id_corte', { type: () => Int }) id_corte: number) {
        return this.cortesVendedorService.findOne(id_corte);
    }

    @Mutation(() => CorteVendedor)
    updateCorteVendedor(@Args('updateCorteVendedorInput') updateCorteVendedorInput: UpdateCorteVendedorInput) {
        return this.cortesVendedorService.update(updateCorteVendedorInput.id_corte, updateCorteVendedorInput);
    }

    @Mutation(() => Boolean)
    removeCorteVendedor(@Args('id_corte', { type: () => Int }) id_corte: number) {
        return this.cortesVendedorService.remove(id_corte);
    }
}
