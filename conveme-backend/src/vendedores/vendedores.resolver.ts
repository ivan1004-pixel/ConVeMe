import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VendedoresService } from './vendedores.service';
import { Vendedor } from './vendedor.entity';
import { CreateVendedorInput } from './dto/create-vendedor.input';
import { UpdateVendedorInput } from './dto/update-vendedor.input';

@Resolver(() => Vendedor)
export class VendedoresResolver {
    constructor(private readonly vendedoresService: VendedoresService) {}

    @Mutation(() => Vendedor)
    createVendedor(@Args('createVendedorInput') createVendedorInput: CreateVendedorInput) {
        return this.vendedoresService.create(createVendedorInput);
    }

    @Query(() => [Vendedor], { name: 'vendedores' })
    findAll() {
        return this.vendedoresService.findAll();
    }

    @Query(() => Vendedor, { name: 'vendedor' })
    findOne(@Args('id_vendedor', { type: () => Int }) id_vendedor: number) {
        return this.vendedoresService.findOne(id_vendedor);
    }

    @Mutation(() => Vendedor)
    updateVendedor(@Args('updateVendedorInput') updateVendedorInput: UpdateVendedorInput) {
        return this.vendedoresService.update(updateVendedorInput.id_vendedor, updateVendedorInput);
    }

    @Mutation(() => Boolean)
    removeVendedor(@Args('id_vendedor', { type: () => Int }) id_vendedor: number) {
        return this.vendedoresService.remove(id_vendedor);
    }
}
