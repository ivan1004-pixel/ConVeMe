import { Module } from '@nestjs/common';
import { OrdenesProduccionService } from './ordenes-produccion.service';
import { OrdenesProduccionResolver } from './ordenes-produccion.resolver';

@Module({
  providers: [OrdenesProduccionService, OrdenesProduccionResolver]
})
export class OrdenesProduccionModule {}
