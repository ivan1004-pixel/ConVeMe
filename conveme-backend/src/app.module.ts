import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { PaisesModule } from './paises/paises.module';
import { EstadosModule } from './estados/estados.module';
import { MunicipiosModule } from './municipios/municipios.module';
import { RolesModule } from './roles/roles.module';
import { EscuelasModule } from './escuelas/escuelas.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { VendedoresModule } from './vendedores/vendedores.module';
import { ClientesModule } from './clientes/clientes.module';
import { CategoriasModule } from './categorias/categorias.module';
import { TamanosModule } from './tamanos/tamanos.module';
import { ProductosModule } from './productos/productos.module';
import { InsumosModule } from './insumos/insumos.module';
import { ComprasInsumosModule } from './compras-insumos/compras-insumos.module';
import { OrdenesProduccionModule } from './ordenes-produccion/ordenes-produccion.module';
import { InventarioProductosModule } from './inventario-productos/inventario-productos.module';
import { MovimientosInventarioModule } from './movimientos-inventario/movimientos-inventario.module';
import { AsignacionesVendedorModule } from './asignaciones-vendedor/asignaciones-vendedor.module';
import { CortesVendedorModule } from './cortes-vendedor/cortes-vendedor.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    // Configuración de TypeORM para conectarse a MariaDB/MySQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',  // Tu usuario de BD
      password: '12345',      // Tu contraseña de BD
      database: 'conveme_bd', // El nombre de la base de datos
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo. Crea las tablas automáticamente.
    }),
    UsuariosModule,
    AuthModule,
    PaisesModule,
    EstadosModule,
    MunicipiosModule,
    RolesModule,
    EscuelasModule,
    EmpleadosModule,
    VendedoresModule,
    ClientesModule,
    CategoriasModule,
    TamanosModule,
    ProductosModule,
    InsumosModule,
    ComprasInsumosModule,
    OrdenesProduccionModule,
    InventarioProductosModule,
    MovimientosInventarioModule,
    AsignacionesVendedorModule,
    CortesVendedorModule,
  ],
})
export class AppModule {}
