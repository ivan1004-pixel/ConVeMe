import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesProduccionService } from './ordenes-produccion.service';
import { OrdenesProduccionResolver } from './ordenes-produccion.resolver';
import { OrdenProduccion } from './entities/orden-produccion.entity';
import { DetOrdenProduccion } from './entities/det-orden-produccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenProduccion, DetOrdenProduccion])],
        providers: [OrdenesProduccionResolver, OrdenesProduccionService],
        exports: [OrdenesProduccionService],
})
export class OrdenesProduccionModule {}
