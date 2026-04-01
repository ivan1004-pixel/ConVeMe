/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  seed-generator-conveme.js  —  Sistema CONVEME (MariaDB)       ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  Genera seed_conveme.sql con 100 000 registros por tabla       ║
 * ║                                                                ║
 * ║  USO:                                                          ║
 * ║    node seed-generator-conveme.js                              ║
 * ║    mysql -u root -p BD_CONVEME < seed_conveme.sql              ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ESTRATEGIA ANTI-DUPLICADOS EN FKs ÚNICAS
 * ──────────────────────────────────────────
 *  • usuarios → divididos en 3 rangos consecutivos (OneToOne):
 *      ids  1 – 20 000  → empleados
 *      ids 20 001 – 50 000  → vendedores
 *      ids 50 001 – 100 000 → clientes
 *    Así empleado_i.usuario_id = i, nunca repite.
 *
 *  • inventario_negocio.producto_id  UNIQUE  → inventario_i → producto_i (1:1)
 *  • saldo_vendedores.vendedor_id    UNIQUE  → saldo_i      → vendedor_i (1:1)
 *    Solo 30 000 filas (una por vendedor).
 *  • cortes_vendedor.asignacion_id   UNIQUE  → corte_i      → asignacion_i (1:1)
 *  • ventas.pedido_id                UNIQUE  → venta_i      → pedido_i     (1:1)
 *
 * ORDEN DE INSERCIÓN (padres antes que hijos)
 * ─────────────────────────────────────────────
 *  1.  roles                    (sin FK)
 *  2.  paises                   (sin FK)
 *  3.  estados                  → pais
 *  4.  municipios               → estado   (125 mun. reales del Edo. de Méx.)
 *  5.  categorias               (sin FK)
 *  6.  tamanos                  (sin FK)
 *  7.  categorias_gasto         (sin FK)
 *  8.  insumos_materia_prima    (sin FK)
 *  9.  usuarios                 → rol
 * 10.  empleados                → usuario (1:1, ids 1-20 000)
 * 11.  escuelas                 → municipio (200 escuelas)
 * 12.  vendedores               → usuario (1:1, ids 20 001-50 000), escuela, municipio
 * 13.  clientes                 → usuario (1:1, ids 50 001-100 000)
 * 14.  eventos                  → escuela, municipio
 * 15.  productos                → categoria, tamano
 * 16.  inventario_negocio       → producto (UNIQUE 1:1)
 * 17.  movimientos_inventario   → producto, usuario
 * 18.  compras_insumos          → empleado
 * 19.  det_compras_insumos      → compra, insumo
 * 20.  ordenes_produccion       → producto, empleado
 * 21.  consumo_insumos_produccion → orden, insumo
 * 22.  asignaciones_vendedor    → vendedor, empleado
 * 23.  det_asignaciones         → asignacion, producto
 * 24.  promociones              (sin FK, 1 000 registros)
 * 25.  pedidos                  → cliente, vendedor
 * 26.  det_pedidos              → pedido, producto
 * 27.  ventas                   → vendedor, cliente, pedido (UNIQUE 1:1), evento, promocion
 * 28.  detalles_ventas          → venta, producto
 * 29.  cortes_vendedor          → vendedor, asignacion (UNIQUE 1:1)
 * 30.  det_cortes_inventario    → corte, producto
 * 31.  cuentas_bancarias_vendedor → vendedor
 * 32.  saldo_vendedores         → vendedor (UNIQUE 1:1, 30 000 filas)
 * 33.  pagos_vendedores         → vendedor, empleado, cuenta
 * 34.  gastos_operativos        → categoria_gasto, empleado?, vendedor?, evento?
 * 35.  auditoria_sistema        → usuario
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Configuración ──────────────────────────────────────────────────────────
const TARGET      = 100_000;
const BATCH       = 500;
const OUTPUT      = path.join(__dirname, 'seed_conveme.sql');

// Distribución de usuarios (OneToOne con empleados / vendedores / clientes)
const N_EMPLEADOS  = Math.floor(TARGET * 0.20); // 20 000
const N_VENDEDORES = Math.floor(TARGET * 0.30); // 30 000
const N_CLIENTES   = TARGET - N_EMPLEADOS - N_VENDEDORES; // 50 000

// ── LCG pseudo-random (sin dependencias npm) ───────────────────────────────
let _seed = 1337;
function rand()            { _seed = (_seed * 1664525 + 1013904223) & 0xffffffff; return (_seed >>> 0) / 0xffffffff; }
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function pick(arr)         { return arr[Math.floor(rand() * arr.length)]; }

// ── Helpers de formato ─────────────────────────────────────────────────────
function esc(v)       { return String(v).replace(/'/g, "''"); }
function bool(v)      { return v ? 'TRUE' : 'FALSE'; }
function fmtDate(d)   { return d.toISOString().slice(0, 10); }
function fmtDT(d)     { return d.toISOString().slice(0, 19).replace('T', ' '); }
function randDate(y1, y2) {
    const a = new Date(y1, 0, 1).getTime();
    const b = new Date(y2, 11, 31).getTime();
    return new Date(a + rand() * (b - a));
}
function addDays(d, n) {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
}

// ── Escritura en lotes ─────────────────────────────────────────────────────
function insertBatch(stream, table, cols, rows) {
    if (!rows.length) return;
    const colStr = cols.map(c => `\`${c}\``).join(', ');
    for (let i = 0; i < rows.length; i += BATCH) {
        const chunk = rows.slice(i, i + BATCH);
        const vals  = chunk.map(r => `(${r})`).join(',\n  ');
        stream.write(`INSERT INTO \`${table}\` (${colStr}) VALUES\n  ${vals};\n`);
    }
}

// ── Catálogos ──────────────────────────────────────────────────────────────
const MUNICIPIOS_EDOMEX = [
    'Acambay de Ruíz Castañeda','Acolman','Aculco','Almoloya de Alquisiras',
'Almoloya de Juárez','Almoloya del Río','Amanalco','Amatepec','Amecameca',
'Apaxco','Atenco','Atizapán','Atizapán de Zaragoza','Atlacomulco','Atlautla',
'Axapusco','Ayapango','Calimaya','Capulhuac','Coacalco de Berriozábal',
'Coatepec Harinas','Cocotitlán','Coyotepec','Cuautitlán','Cuautitlán Izcalli',
'Chalco','Chapa de Mota','Chapultepec','Chiautla','Chicoloapan','Chiconcuac',
'Chimalhuacán','Donato Guerra','Ecatepec de Morelos','Ecatzingo','El Oro',
'Huehuetoca','Hueypoxtla','Huixquilucan','Isidro Fabela','Ixtapaluca',
'Ixtapan de la Sal','Ixtapan del Oro','Ixtlahuaca','Jaltenco','Jilotepec',
'Jilotzingo','Jiquipilco','Jocotitlán','Joquicingo','Juchitepec','La Paz',
'Lerma','Luvianos','Malinalco','Melchor Ocampo','Metepec','Mexicaltzingo',
'Morelos','Naucalpan de Juárez','Nextlalpan','Nezahualcóyotl','Nicolás Romero',
'Nopaltepec','Ocoyoacac','Ocuilan','Otzoloapan','Otzolotepec','Ozumba',
'Papalotla','Polotitlán','Rayón','San Antonio la Isla','San Felipe del Progreso',
'San José del Rincón','San Martín de las Pirámides','San Mateo Atenco',
'San Simón de Guerrero','Santo Tomás','Soyaniquilpan de Juárez','Sultepec',
'Tecámac','Tejupilco','Temamatla','Temascalapa','Temascalcingo',
'Temascaltepec','Temoaya','Tenancingo','Tenango del Aire','Tenango del Valle',
'Teoloyucan','Teotihuacán','Tepetlaoxtoc','Tepetlixpa','Tepotzotlán',
'Tequixquiac','Texcaltitlán','Texcalyacac','Texcoco','Tezoyuca',
'Tianguistenco','Timilpan','Tlalmanalco','Tlalnepantla de Baz','Tlatlaya',
'Toluca','Tonanitla','Tonatico','Tultepec','Tultitlán','Valle de Bravo',
'Valle de Chalco Solidaridad','Villa de Allende','Villa del Carbón',
'Villa Guerrero','Villa Victoria','Xalatlaco','Xonacatlán','Zacazonapan',
'Zacualpan','Zinacantepec','Zumpahuacán','Zumpango'
];

const NOMBRES   = ['Guadalupe','María','José','Juan','Carlos','Ana','Luis','Rosa','Pedro','Laura',
'Jorge','Elena','Andrés','Sofía','Miguel','Valentina','Diego','Camila',
'Ricardo','Gabriela','Fernando','Patricia','Roberto','Alejandra','Manuel',
'Daniela','Sergio','Natalia','Ángel','Verónica','Raúl','Claudia',
'Arturo','Mariana','Héctor','Adriana','Iván','Paulina','Omar','Brenda'];
const APELLIDOS = ['García','Hernández','López','Martínez','González','Rodríguez','Pérez',
'Sánchez','Ramírez','Torres','Flores','Rivera','Gómez','Díaz','Cruz',
'Morales','Reyes','Jiménez','Ruiz','Vargas','Mendoza','Castillo',
'Romero','Guerrero','Gutiérrez','Ortega','Delgado','Vega','Ramos','Medina'];
const COLONIAS  = ['Centro','Santa Fe','Lomas Verdes','Valle Dorado','San Lorenzo',
'La Merced','Jardines del Valle','Industrial','Los Álamos',
'Bosques de Ixtapan','Cd. Satélite','Del Parque',
'San Cristóbal','La Florida','Cumbres'];
const BANCOS    = ['BBVA','Citibanamex','Santander','HSBC','Banorte',
'Scotiabank','Inbursa','Banco Azteca','BanBajío','Bansí'];
const PUESTOS   = ['Gerente General','Coordinador de Producción','Diseñador Gráfico',
'Asistente Administrativo','Contador','Encargado de Logística',
'Community Manager','Jefe de Ventas','Encargado de Almacén'];
const FACULTADES = ['Facultad de Ingeniería','Facultad de Medicina','Facultad de Derecho',
'Facultad de Economía','Facultad de Humanidades','Facultad de Arquitectura',
'Centro Universitario UAEM','Campus Toluca','Campus Texcoco',
'Campus Ecatepec','Campus Zumpango','Campus Amecameca'];
const NOMBRES_ESC   = ['UAEM','UAM','IPN','TecNM','UNAM','UVM','Anáhuac',
'Iberoamericana','La Salle','UNITEC','UPVM','UTEG','CET'];
const CAMPUS_ESC    = ['Campus Norte','Campus Sur','Campus Centro','Campus Oriente',
'Campus Poniente','Plantel A','Plantel B','Unidad 1','Unidad 2'];
const NOMBRES_EV    = ['Feria del Arte Universitario','Expo Creativa','Festival Geek','Mercado Artesanal',
'Feria de Diseño','Pop-Up Market','Exposición Cultural','Comic Con EdoMex',
'Bazar Estudiantil','Feria de Emprendedores','ExpoArte','Mercado Freak'];
const TEMAS_PROD    = ['Ajolote','Gato Espacial','Dinosaurio','Calavera Kawaii','Hongo Mágico',
'Pulpo Cósmico','Zorro Ninja','Conejo Astronauta','Dragón Pastel',
'Luna Brillante','Sol Retro','Mariposa Neon','Delfín Holográfico',
'Rana Samuray','Búho Steampunk','Lobo Glacial','Panda Mecha',
'Koi Fantasma','Axolotl Rosa','Cactus Simpático'];
const ESTILOS_PROD  = ['Clásico','Edición Especial','Kawaii','Retro','Neon','Pastel','Dark','Glitter'];
const PROVEEDORES   = ['Materiales México SA','Distribuidora GX','Insumos del Valle',
'ImportaFácil','ProArtesanía','SupplyPlus','Todo en Metal',
'Sticker World','Mex Insumos','Arte y Color'];
const TIPOS_INSUMO  = ['Bases Metálicas','Papel Adhesivo Holográfico','Resina Epóxica',
'Tinta UV','Lámina de Acrílico','Tela para Parches','Hilo Bordado',
'Botones de Metal','Pintura Esmalte','Barniz Protector',
'Film Holográfico','Vinilo de Corte','Papel Kraft','Bolsa Burbuja',
'Caja Cartón Microcorrugado','Pegamento Industrial','Acetato Transparente'];
const UNIDADES_INS  = ['kg','g','lt','ml','pzas','metros','rollos','láminas'];
const NOMBRES_PROMO = ['Descuento Estudiantil','Buen Fin','Día del Amor','Regreso a Clases',
'Promo Fin de Semana','Liquidación Temporada','Pack Especial','2x1 Limitado',
'Fidelidad CONVEME','Flash Sale','Bazar Universitario','Martes de Oferta'];
const ESTADO_PEDIDO = ['Pendiente','En proceso','Enviado','Entregado','Cancelado'];
const ESTADO_ASIG   = ['Activa','Cerrada','Cancelada'];
const ESTADO_ORDEN  = ['Pendiente','En producción','Completada','Cancelada'];
const ESTADO_LAB    = ['Activo','Inactivo','En prueba','Suspendido'];
const TIPO_MOV      = ['ENTRADA','SALIDA','AJUSTE'];
const TIPO_DESC     = ['PORCENTAJE','MONTO_FIJO'];
const METODO_PAGO   = ['Efectivo','Transferencia','Tarjeta'];
const CONCEPTO_PAGO = ['Liquidación semanal','Anticipo de comisión','Bono por meta alcanzada',
'Pago de comisión mensual','Reembolso de gastos','Liquidación final'];
const ACCIONES_LOG  = ['INSERT','UPDATE','DELETE','LOGIN','LOGOUT'];
const TABLAS_LOG    = ['ventas','productos','vendedores','clientes','pedidos',
'inventario_negocio','pagos_vendedores'];
const PUNTO_ENT     = ['Entrada Facultad','Cafetería Central','Biblioteca','Estacionamiento A',
'Puerta Principal','Sala de Juntas','Explanada','Coordinación'];

const nombre    = () => esc(pick(NOMBRES));
const apellido  = () => esc(pick(APELLIDOS));
const tel       = () => `55${randInt(10000000, 99999999)}`;
const clabe18   = () => String(randInt(10000, 99999)).padStart(18, '0').slice(0, 18);

// ════════════════════════════════════════════════════════════════════════════
// INICIO
// ════════════════════════════════════════════════════════════════════════════
console.log(`\n🚀  Generando seed CONVEME (MariaDB)...`);
console.log(`    TARGET  : ${TARGET.toLocaleString()} registros/tabla`);
console.log(`    Empleados: ${N_EMPLEADOS.toLocaleString()} | Vendedores: ${N_VENDEDORES.toLocaleString()} | Clientes: ${N_CLIENTES.toLocaleString()}`);
console.log(`    Salida  : ${OUTPUT}\n`);

const stream = fs.createWriteStream(OUTPUT, { encoding: 'utf8' });

stream.write(`-- ============================================================\n`);
stream.write(`-- SEED — Sistema CONVEME (MariaDB / BD_CONVEME)\n`);
stream.write(`-- Generado: ${new Date().toISOString()}\n`);
stream.write(`-- Registros por tabla principal: ${TARGET.toLocaleString()}\n`);
stream.write(`-- Distribución usuarios: ${N_EMPLEADOS.toLocaleString()} empleados,\n`);
stream.write(`--   ${N_VENDEDORES.toLocaleString()} vendedores, ${N_CLIENTES.toLocaleString()} clientes\n`);
stream.write(`-- Importar:\n`);
stream.write(`--   mysql -u root -p BD_CONVEME < seed_conveme.sql\n`);
stream.write(`-- ============================================================\n\n`);

stream.write(`USE \`BD_CONVEME\`;\n\n`);
stream.write(`-- Desactiva FKs para insertar en cualquier orden\n`);
stream.write(`SET FOREIGN_KEY_CHECKS = 0;\n`);
stream.write(`SET autocommit = 0;\n\n`);


// ══════════════════════════════════════════════════════════════
// 1. ROLES
// ══════════════════════════════════════════════════════════════
console.log('[01] roles...');
stream.write(`-- 1. ROLES\n`);
stream.write(`INSERT IGNORE INTO \`roles\` (\`nombre\`, \`descripcion\`) VALUES\n`);
stream.write(`  ('Admin',    'Administrador del sistema con acceso total'),\n`);
stream.write(`  ('Empleado', 'Personal interno de producción y administración'),\n`);
stream.write(`  ('Vendedor', 'Vendedor en campo o facultad'),\n`);
stream.write(`  ('Cliente',  'Comprador final de pines y stickers');\n\n`);


// ══════════════════════════════════════════════════════════════
// 2. PAISES
// ══════════════════════════════════════════════════════════════
console.log('[02] paises...');
stream.write(`-- 2. PAISES\n`);
stream.write(`INSERT IGNORE INTO \`paises\` (\`id_pais\`, \`nombre\`) VALUES (1, 'México');\n\n`);


// ══════════════════════════════════════════════════════════════
// 3. ESTADOS
// ══════════════════════════════════════════════════════════════
console.log('[03] estados...');
stream.write(`-- 3. ESTADOS\n`);
stream.write(`INSERT IGNORE INTO \`estados\` (\`id_estado\`, \`pais_id\`, \`nombre\`) VALUES (1, 1, 'Estado de México');\n\n`);


// ══════════════════════════════════════════════════════════════
// 4. MUNICIPIOS — 125 municipios reales del Estado de México
// ══════════════════════════════════════════════════════════════
console.log('[04] municipios...');
stream.write(`-- 4. MUNICIPIOS (${MUNICIPIOS_EDOMEX.length} municipios reales del Estado de México)\n`);
const municipioIds = [];
{
    const rows = [];
    for (let i = 0; i < MUNICIPIOS_EDOMEX.length; i++) {
        const id = i + 1;
        rows.push(`${id}, 1, '${esc(MUNICIPIOS_EDOMEX[i])}'`);
        municipioIds.push(id);
    }
    insertBatch(stream, 'municipios', ['id_municipio', 'estado_id', 'nombre'], rows);
    stream.write('\n');
}
console.log(`    ${MUNICIPIOS_EDOMEX.length} municipios reales`);


// ══════════════════════════════════════════════════════════════
// 5. CATEGORIAS (catálogo fijo — 10 tipos de producto)
// ══════════════════════════════════════════════════════════════
console.log('[05] categorias...');
stream.write(`-- 5. CATEGORIAS\n`);
stream.write(`INSERT IGNORE INTO \`categorias\` (\`id_categoria\`, \`nombre\`) VALUES\n`);
stream.write(`  (1,'Pines Esmaltados'),(2,'Stickers Holográficos'),(3,'Llaveros Acrílicos'),\n`);
stream.write(`  (4,'Parches Bordados'),(5,'Botones'),(6,'Imanes Decorativos'),\n`);
stream.write(`  (7,'Pines de Seguridad'),(8,'Stickers Mate'),(9,'Coleccionables'),\n`);
stream.write(`  (10,'Edición Limitada');\n\n`);
const categoriaIds = [1,2,3,4,5,6,7,8,9,10];


// ══════════════════════════════════════════════════════════════
// 6. TAMANOS (catálogo fijo — 6 tamaños)
// ══════════════════════════════════════════════════════════════
console.log('[06] tamanos...');
stream.write(`-- 6. TAMANOS\n`);
stream.write(`INSERT IGNORE INTO \`tamanos\` (\`id_tamano\`, \`descripcion\`) VALUES\n`);
stream.write(`  (1,'Mini (1.5cm)'),(2,'Chico (3cm)'),(3,'Mediano (4cm)'),\n`);
stream.write(`  (4,'Grande (5cm)'),(5,'Jumbo (7cm)'),(6,'XL (10cm)');\n\n`);
const tamanoIds = [1,2,3,4,5,6];


// ══════════════════════════════════════════════════════════════
// 7. CATEGORIAS_GASTO (catálogo fijo — 10 categorías)
// ══════════════════════════════════════════════════════════════
console.log('[07] categorias_gasto...');
stream.write(`-- 7. CATEGORIAS_GASTO\n`);
stream.write(`INSERT IGNORE INTO \`categorias_gasto\` (\`id_categoria_gasto\`, \`nombre\`, \`tipo\`) VALUES\n`);
stream.write(`  (1,'Materias primas','Variable'),(2,'Transporte','Variable'),\n`);
stream.write(`  (3,'Empaques','Variable'),(4,'Renta local','Fijo'),\n`);
stream.write(`  (5,'Servicios básicos','Fijo'),(6,'Marketing y publicidad','Variable'),\n`);
stream.write(`  (7,'Eventos y stands','Variable'),(8,'Nómina','Fijo'),\n`);
stream.write(`  (9,'Equipo y herramientas','Fijo'),(10,'Gastos varios','Variable');\n\n`);
const categoriaGastoIds = [1,2,3,4,5,6,7,8,9,10];


// ══════════════════════════════════════════════════════════════
// 8. INSUMOS_MATERIA_PRIMA — 100 000, sin FK
// ══════════════════════════════════════════════════════════════
console.log('[08] insumos_materia_prima...');
stream.write(`-- 8. INSUMOS_MATERIA_PRIMA\n`);
const insumoIds = [];
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const nm    = esc(`${pick(TIPOS_INSUMO)} Lote-${String(i).padStart(6, '0')}`);
        const stock = (rand() * 1000).toFixed(4);
        const min   = (5 + rand() * 50).toFixed(4);
        rows.push(`${i},'${nm}','${pick(UNIDADES_INS)}',${stock},${min}`);
        insumoIds.push(i);
    }
    insertBatch(stream, 'insumos_materia_prima',
                ['id_insumo','nombre','unidad_medida','stock_actual','stock_minimo_alerta'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} insumos`);


// ══════════════════════════════════════════════════════════════
// 9. USUARIOS — 100 000
//    Roles asignados por rango de id:
//      1 – 20 000  → rol 2 (Empleado)
//      20 001 – 50 000 → rol 3 (Vendedor)
//      50 001 – 100 000 → rol 4 (Cliente)
// ══════════════════════════════════════════════════════════════
console.log('[09] usuarios...');
stream.write(`-- 9. USUARIOS (${TARGET.toLocaleString()})\n`);
const usuarioIds = [];
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        let rolId;
        if      (i <= N_EMPLEADOS)                  rolId = 2; // Empleado
        else if (i <= N_EMPLEADOS + N_VENDEDORES)   rolId = 3; // Vendedor
        else                                         rolId = 4; // Cliente

        const fecha = fmtDT(randDate(2020, 2025));
        rows.push(
            `${i},'user${String(i).padStart(7,'0')}',` +
            `'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',` +
            `${rolId},${bool(rand() > 0.05)},'${fecha}'`
        );
        usuarioIds.push(i);
    }
    insertBatch(stream, 'usuarios',
                ['id_usuario','username','password_hash','rol_id','activo','ultimo_acceso'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} usuarios`);


// ══════════════════════════════════════════════════════════════
// 10. EMPLEADOS — 20 000 (usuario_id 1..20 000, OneToOne)
// ══════════════════════════════════════════════════════════════
console.log('[10] empleados...');
stream.write(`-- 10. EMPLEADOS (${N_EMPLEADOS.toLocaleString()}, usuario_id 1-${N_EMPLEADOS})\n`);
const empleadoIds = [];
{
    const rows = [];
    for (let i = 1; i <= N_EMPLEADOS; i++) {
        const n1  = nombre(), ap1 = apellido(), ap2 = apellido();
        const mun = pick(municipioIds);
        const cp  = `${50000 + randInt(0, 999)}`;
        rows.push(
            `${i},${i},'${n1} ${ap1} ${ap2}','emp${i}@conveme.mx','${tel()}',` +
            `'${pick(PUESTOS)}','Calle ${randInt(1,999)} #${randInt(1,99)}',` +
            `'${pick(COLONIAS)}','${cp}',${mun}`
        );
        empleadoIds.push(i);
    }
    insertBatch(stream, 'empleados',
                ['id_empleado','usuario_id','nombre_completo','email','telefono',
                'puesto','calle_y_numero','colonia','codigo_postal','municipio_id'], rows);
    stream.write('\n');
}
console.log(`    ${N_EMPLEADOS.toLocaleString()} empleados`);


// ══════════════════════════════════════════════════════════════
// 11. ESCUELAS — 200 escuelas reales del Edo. de Méx.
//     (necesario antes de vendedores que hacen FK a escuela_id)
// ══════════════════════════════════════════════════════════════
console.log('[11] escuelas...');
stream.write(`-- 11. ESCUELAS (200)\n`);
const escuelaIds = [];
{
    const rows = [];
    for (let i = 1; i <= 200; i++) {
        const mun = pick(municipioIds);
        const nm  = esc(`${pick(NOMBRES_ESC)} ${pick(CAMPUS_ESC)} ${i}`);
        const sig = pick(NOMBRES_ESC).replace(/[^A-Z]/g, '').slice(0, 6);
        rows.push(`${i},'${nm}','${sig}',${mun},${bool(rand() > 0.05)}`);
        escuelaIds.push(i);
    }
    insertBatch(stream, 'escuelas',
                ['id_escuela','nombre','siglas','municipio_id','activa'], rows);
    stream.write('\n');
}
console.log(`    200 escuelas`);


// ══════════════════════════════════════════════════════════════
// 12. VENDEDORES — 30 000 (usuario_id 20 001..50 000, OneToOne)
// ══════════════════════════════════════════════════════════════
console.log('[12] vendedores...');
stream.write(`-- 12. VENDEDORES (${N_VENDEDORES.toLocaleString()}, usuario_id ${N_EMPLEADOS+1}-${N_EMPLEADOS+N_VENDEDORES})\n`);
const vendedorIds = [];
{
    const rows = [];
    for (let i = 1; i <= N_VENDEDORES; i++) {
        const usuId = N_EMPLEADOS + i;   // 20 001 .. 50 000
        const n1    = nombre(), ap1 = apellido(), ap2 = apellido();
        const mun   = pick(municipioIds);
        const escId = pick(escuelaIds);
        const comMen = (8  + rand() * 7).toFixed(2);
        const comMay = (3  + rand() * 4).toFixed(2);
        const meta   = (2000 + rand() * 8000).toFixed(2);
        const cp     = `${50000 + randInt(0, 999)}`;
        rows.push(
            `${i},${usuId},${escId},'${n1} ${ap1} ${ap2}','vend${i}@conveme.mx',` +
            `'${tel()}','@conveme_${i}','Calle ${randInt(1,999)} #${randInt(1,99)}',` +
            `'${pick(COLONIAS)}','${cp}',${mun},'${pick(FACULTADES)}',` +
            `'${pick(PUNTO_ENT)}','${pick(ESTADO_LAB)}',${comMen},${comMay},${meta}`
        );
        vendedorIds.push(i);
    }
    insertBatch(stream, 'vendedores',
                ['id_vendedor','usuario_id','escuela_id','nombre_completo','email','telefono',
                'instagram_handle','calle_y_numero','colonia','codigo_postal','municipio_id',
                'facultad_o_campus','punto_entrega_habitual','estado_laboral',
                'comision_fija_menudeo','comision_fija_mayoreo','meta_ventas_mensual'], rows);
    stream.write('\n');
}
console.log(`    ${N_VENDEDORES.toLocaleString()} vendedores`);


// ══════════════════════════════════════════════════════════════
// 13. CLIENTES — 50 000 (usuario_id 50 001..100 000, OneToOne)
// ══════════════════════════════════════════════════════════════
console.log('[13] clientes...');
stream.write(`-- 13. CLIENTES (${N_CLIENTES.toLocaleString()}, usuario_id ${N_EMPLEADOS+N_VENDEDORES+1}-${TARGET})\n`);
const clienteIds = [];
{
    const rows = [];
    for (let i = 1; i <= N_CLIENTES; i++) {
        const usuId = N_EMPLEADOS + N_VENDEDORES + i;   // 50 001 .. 100 000
        const n1    = nombre(), ap1 = apellido(), ap2 = apellido();
        const mun   = pick(MUNICIPIOS_EDOMEX);
        const fecha = fmtDT(randDate(2020, 2025));
        const dir   = esc(`Calle ${randInt(1,999)} #${randInt(1,99)}, Col. ${pick(COLONIAS)}, ${mun}, Edo. Méx.`);
        rows.push(
            `${i},${usuId},'${n1} ${ap1} ${ap2}','cli${i}@email.com','${tel()}','${dir}','${fecha}'`
        );
        clienteIds.push(i);
    }
    insertBatch(stream, 'clientes',
                ['id_cliente','usuario_id','nombre_completo','email','telefono',
                'direccion_envio','fecha_registro'], rows);
    stream.write('\n');
}
console.log(`    ${N_CLIENTES.toLocaleString()} clientes`);


// ══════════════════════════════════════════════════════════════
// 14. EVENTOS — 100 000
//     FK: escuela_id, municipio_id — admite repetidos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[14] eventos...');
stream.write(`-- 14. EVENTOS\n`);
const eventoIds = [];
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const fi  = randDate(2020, 2025);
        const ff  = addDays(fi, randInt(1, 5));
        const nm  = esc(`${pick(NOMBRES_EV)} ${i}`);
        const costo = (150 + rand() * 850).toFixed(2);
        rows.push(
            `${i},'${nm}','Evento cultural universitario en el Estado de México',` +
            `'${fmtDT(fi)}','${fmtDT(ff)}',${pick(escuelaIds)},${pick(municipioIds)},${costo},${bool(rand() > 0.15)}`
        );
        eventoIds.push(i);
    }
    insertBatch(stream, 'eventos',
                ['id_evento','nombre','descripcion','fecha_inicio','fecha_fin',
                'escuela_id','municipio_id','costo_stand','activo'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} eventos`);


// ══════════════════════════════════════════════════════════════
// 15. PRODUCTOS — 100 000
//     FK: categoria_id, tamano_id → libre (catálogos chicos).
// ══════════════════════════════════════════════════════════════
console.log('[15] productos...');
stream.write(`-- 15. PRODUCTOS\n`);
const productoIds = [];
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const catId    = pick(categoriaIds);
        const tamId    = pick(tamanoIds);
        const precio   = (40 + rand() * 160).toFixed(2);
        const precioMay= (parseFloat(precio) * 0.75).toFixed(2);
        const costo    = (parseFloat(precio) * (0.25 + rand() * 0.15)).toFixed(2);
        const minMay   = randInt(6, 24);
        const nm = esc(`${pick(TEMAS_PROD)} ${pick(ESTILOS_PROD)} ${i}`);
        rows.push(
            `${i},'SKU-${String(i).padStart(7,'0')}','${nm}',${catId},${tamId},` +
            `${precio},${precioMay},${minMay},${costo},${bool(rand() > 0.08)}`
        );
        productoIds.push(i);
    }
    insertBatch(stream, 'productos',
                ['id_producto','sku','nombre','categoria_id','tamano_id',
                'precio_unitario','precio_mayoreo','cantidad_minima_mayoreo',
                'costo_produccion','activo'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} productos`);


// ══════════════════════════════════════════════════════════════
// 16. INVENTARIO_NEGOCIO — producto_id UNIQUE
//     Un producto solo puede tener UN registro de inventario.
//     Solución: inventario_i → producto_i (mapeo directo 1:1).
// ══════════════════════════════════════════════════════════════
console.log('[16] inventario_negocio...');
stream.write(`-- 16. INVENTARIO_NEGOCIO (producto_id UNIQUE → 1 fila por producto)\n`);
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        rows.push(`${i},${i},${randInt(0, 500)},${randInt(5, 25)}`);
    }
    insertBatch(stream, 'inventario_negocio',
                ['id_inventario','producto_id','stock_actual','stock_minimo_alerta'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} registros de inventario`);


// ══════════════════════════════════════════════════════════════
// 17. MOVIMIENTOS_INVENTARIO — 100 000
//     FK: producto_id, usuario_id → admite repetidos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[17] movimientos_inventario...');
stream.write(`-- 17. MOVIMIENTOS_INVENTARIO\n`);
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const pId   = pick(productoIds);
        const uId   = pick(usuarioIds);
        const fecha = fmtDT(randDate(2020, 2025));
        const motivo = esc(`Movimiento ${pick(['por producción','por venta','por ajuste','por devolución','por inventario físico'])}`);
        rows.push(`${i},${pId},${uId},'${pick(TIPO_MOV)}',${randInt(1, 100)},'${motivo}','${fecha}'`);
    }
    insertBatch(stream, 'movimientos_inventario',
                ['id_movimiento','producto_id','usuario_id','tipo_movimiento',
                'cantidad','motivo','fecha'], rows);
    stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 18. COMPRAS_INSUMOS — 100 000
//     FK: empleado_id → admite repetidos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[18] compras_insumos...');
stream.write(`-- 18. COMPRAS_INSUMOS\n`);
const compraInsumoIds = [];
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const empId = pick(empleadoIds);
        const fecha = fmtDT(randDate(2020, 2025));
        const monto = (500 + rand() * 9500).toFixed(2);
        rows.push(
            `${i},'${fecha}','${pick(PROVEEDORES)}',${monto},${empId},` +
            `'https://docs.conveme.mx/compras/${i}.pdf'`
        );
        compraInsumoIds.push(i);
    }
    insertBatch(stream, 'compras_insumos',
                ['id_compra_insumo','fecha_compra','proveedor','monto_total',
                'empleado_id','comprobante_url'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} compras de insumos`);


// ══════════════════════════════════════════════════════════════
// 19. DET_COMPRAS_INSUMOS — 100 000
//     FK: compra_insumo_id, insumo_id → admite repetidos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[19] det_compras_insumos...');
stream.write(`-- 19. DET_COMPRAS_INSUMOS\n`);
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const cId    = pick(compraInsumoIds);
        const insId  = pick(insumoIds);
        const cant   = (1 + rand() * 100).toFixed(4);
        const costo  = (5  + rand() * 200).toFixed(2);
        rows.push(`${i},${cId},${insId},${cant},${costo}`);
    }
    insertBatch(stream, 'det_compras_insumos',
                ['id_det_compra','compra_insumo_id','insumo_id','cantidad_comprada','costo_unitario'], rows);
    stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 20. ORDENES_PRODUCCION — 100 000
//     FK: producto_id, empleado_id → admite repetidos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[20] ordenes_produccion...');
stream.write(`-- 20. ORDENES_PRODUCCION\n`);
const ordenIds = [];
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const pId    = pick(productoIds);
        const empId  = pick(empleadoIds);
        const fecha  = fmtDT(randDate(2020, 2025));
        const cant   = randInt(10, 500);
        const merma  = randInt(0, Math.max(1, Math.floor(cant * 0.04)));
        const costoL = (cant * (2 + rand() * 8)).toFixed(2);
        rows.push(`${i},${pId},${empId},'${fecha}',${cant},${merma},${costoL},'${pick(ESTADO_ORDEN)}'`);
        ordenIds.push(i);
    }
    insertBatch(stream, 'ordenes_produccion',
                ['id_orden','producto_id','empleado_id','fecha_produccion',
                'cantidad_fabricada','mermas_produccion','costo_operativo_lote','estado'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} órdenes de producción`);


// ══════════════════════════════════════════════════════════════
// 21. CONSUMO_INSUMOS_PRODUCCION — 100 000
//     FK: orden_produccion_id, insumo_id → admite repetidos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[21] consumo_insumos_produccion...');
stream.write(`-- 21. CONSUMO_INSUMOS_PRODUCCION\n`);
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const ordId = pick(ordenIds);
        const insId = pick(insumoIds);
        const cant  = (0.5 + rand() * 50).toFixed(4);
        rows.push(`${i},${ordId},${insId},${cant}`);
    }
    insertBatch(stream, 'consumo_insumos_produccion',
                ['id_consumo','orden_produccion_id','insumo_id','cantidad_utilizada'], rows);
    stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 22. ASIGNACIONES_VENDEDOR — 100 000
//     FK: vendedor_id, empleado_id → admite repetidos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[22] asignaciones_vendedor...');
stream.write(`-- 22. ASIGNACIONES_VENDEDOR\n`);
const asignacionIds = [];
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const vId   = pick(vendedorIds);
        const empId = pick(empleadoIds);
        const fecha = fmtDT(randDate(2020, 2025));
        rows.push(`${i},${vId},${empId},'${fecha}','${pick(ESTADO_ASIG)}'`);
        asignacionIds.push(i);
    }
    insertBatch(stream, 'asignaciones_vendedor',
                ['id_asignacion','vendedor_id','empleado_id','fecha_asignacion','estado'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} asignaciones`);


// ══════════════════════════════════════════════════════════════
// 23. DET_ASIGNACIONES — 100 000
//     FK: asignacion_id, producto_id → admite repetidos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[23] det_asignaciones...');
stream.write(`-- 23. DET_ASIGNACIONES\n`);
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const aId = pick(asignacionIds);
        const pId = pick(productoIds);
        rows.push(`${i},${aId},${pId},${randInt(1, 50)}`);
    }
    insertBatch(stream, 'det_asignaciones',
                ['id_det_asignacion','asignacion_id','producto_id','cantidad_entregada'], rows);
    stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 24. PROMOCIONES — 1 000 registros (catálogo moderado, sin FK)
// ══════════════════════════════════════════════════════════════
console.log('[24] promociones...');
stream.write(`-- 24. PROMOCIONES (1 000)\n`);
const promocionIds = [];
{
    const rows = [];
    for (let i = 1; i <= 1000; i++) {
        const fi   = randDate(2020, 2025);
        const ff   = addDays(fi, randInt(3, 30));
        const tipo = pick(TIPO_DESC);
        const val  = tipo === 'PORCENTAJE'
        ? randInt(5, 50)
        : (10 + rand() * 90).toFixed(2);
        rows.push(
            `${i},'${esc(pick(NOMBRES_PROMO))} ${i}','${tipo}',${val},` +
            `'${fmtDT(fi)}','${fmtDT(ff)}',${bool(rand() > 0.25)}`
        );
        promocionIds.push(i);
    }
    insertBatch(stream, 'promociones',
                ['id_promocion','nombre','tipo_descuento','valor_descuento',
                'fecha_inicio','fecha_fin','activa'], rows);
    stream.write('\n');
}
console.log(`    1 000 promociones`);


// ══════════════════════════════════════════════════════════════
// 25. PEDIDOS — 100 000
//     FK: cliente_id, vendedor_id → admite repetidos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[25] pedidos...');
stream.write(`-- 25. PEDIDOS\n`);
const pedidoIds = [];
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const cliId = pick(clienteIds);
        const vId   = pick(vendedorIds);
        const fecha = fmtDT(randDate(2020, 2025));
        const monto = (50 + rand() * 2000).toFixed(2);
        rows.push(`${i},${cliId},${vId},'${fecha}','${pick(ESTADO_PEDIDO)}',${monto}`);
        pedidoIds.push(i);
    }
    insertBatch(stream, 'pedidos',
                ['id_pedido','cliente_id','vendedor_id','fecha_pedido','estado_pedido','monto_estimado'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} pedidos`);


// ══════════════════════════════════════════════════════════════
// 26. DET_PEDIDOS — 100 000
//     FK: pedido_id, producto_id → admite repetidos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[26] det_pedidos...');
stream.write(`-- 26. DET_PEDIDOS\n`);
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const pId  = pick(pedidoIds);
        const prId = pick(productoIds);
        rows.push(`${i},${pId},${prId},${randInt(1, 20)}`);
    }
    insertBatch(stream, 'det_pedidos',
                ['id_det_pedido','pedido_id','producto_id','cantidad'], rows);
    stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 27. VENTAS — 100 000
//     pedido_id UNIQUE → venta_i cubre pedido_i (1:1 directo).
//     evento_id y promocion_id son opcionales (NULL ~30 y ~50%).
// ══════════════════════════════════════════════════════════════
console.log('[27] ventas...');
stream.write(`-- 27. VENTAS (pedido_id UNIQUE → venta_i = pedido_i)\n`);
const ventaIds = [];
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const vId    = pick(vendedorIds);
        const cliId  = pick(clienteIds);
        const pedId  = i;   // 1:1 con pedidos (UNIQUE)
        const evId   = rand() > 0.35 ? pick(eventoIds)   : 'NULL';
        const promId = rand() > 0.50 ? pick(promocionIds) : 'NULL';
        const fecha  = fmtDT(randDate(2020, 2025));
        const monto  = (50 + rand() * 2000).toFixed(2);
        const metodo = pick(METODO_PAGO);
        const recibido = (parseFloat(monto) + rand() * 50).toFixed(2);
        const cambio   = (parseFloat(recibido) - parseFloat(monto)).toFixed(2);
        rows.push(
            `${i},${vId},${cliId},${pedId},${evId},${promId},'${fecha}',` +
            `${monto},'${metodo}',${recibido},${cambio}`
        );
        ventaIds.push(i);
    }
    insertBatch(stream, 'ventas',
                ['id_venta','vendedor_id','cliente_id','pedido_id','evento_id','promocion_id',
                'fecha_venta','monto_total','metodo_pago','dinero_recibido','cambio_devuelto'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} ventas`);


// ══════════════════════════════════════════════════════════════
// 28. DETALLES_VENTAS — 100 000
//     FK: venta_id, producto_id → admite repetidos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[28] detalles_ventas...');
stream.write(`-- 28. DETALLES_VENTAS\n`);
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const vId      = pick(ventaIds);
        const prId     = pick(productoIds);
        const cant     = randInt(1, 20);
        const aplMay   = cant >= 12 ? 'TRUE' : 'FALSE';
        const precHist = (40 + rand() * 160).toFixed(2);
        const sub      = (cant * parseFloat(precHist)).toFixed(2);
        const comision = (cant * (5 + rand() * 10)).toFixed(2);
        rows.push(`${i},${vId},${prId},${cant},${aplMay},${precHist},${sub},${comision}`);
    }
    insertBatch(stream, 'detalles_ventas',
                ['id_det_venta','venta_id','producto_id','cantidad','aplico_mayoreo',
                'precio_unitario_historico','subtotal','monto_comision_generada'], rows);
    stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 29. CORTES_VENDEDOR — 100 000
//     asignacion_id UNIQUE → corte_i cubre asignacion_i (1:1).
// ══════════════════════════════════════════════════════════════
console.log('[29] cortes_vendedor...');
stream.write(`-- 29. CORTES_VENDEDOR (asignacion_id UNIQUE → corte_i = asignacion_i)\n`);
const corteIds = [];
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const vId       = pick(vendedorIds);
        const asigId    = i;   // 1:1 con asignaciones (UNIQUE)
        const fecha     = fmtDT(randDate(2020, 2025));
        const esperado  = (500 + rand() * 4500).toFixed(2);
        const entregado = (parseFloat(esperado) * (0.80 + rand() * 0.30)).toFixed(2);
        const diferencia= (parseFloat(entregado) - parseFloat(esperado)).toFixed(2);
        rows.push(
            `${i},${vId},${asigId},'${fecha}',${esperado},${entregado},${diferencia},'Sin observaciones adicionales'`
        );
        corteIds.push(i);
    }
    insertBatch(stream, 'cortes_vendedor',
                ['id_corte','vendedor_id','asignacion_id','fecha_corte',
                'dinero_esperado','dinero_total_entregado','diferencia_corte','observaciones'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} cortes`);


// ══════════════════════════════════════════════════════════════
// 30. DET_CORTES_INVENTARIO — 100 000
//     FK: corte_id, producto_id → admite repetidos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[30] det_cortes_inventario...');
stream.write(`-- 30. DET_CORTES_INVENTARIO\n`);
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const cId    = pick(corteIds);
        const prId   = pick(productoIds);
        const vend   = randInt(0, 30);
        const dev    = randInt(0, Math.min(5, vend));
        const merma  = randInt(0, 2);
        rows.push(`${i},${cId},${prId},${vend},${dev},${merma}`);
    }
    insertBatch(stream, 'det_cortes_inventario',
                ['id_det_corte','corte_id','producto_id','cantidad_vendida',
                'cantidad_devuelta','merma_reportada'], rows);
    stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 31. CUENTAS_BANCARIAS_VENDEDOR — 100 000
//     FK: vendedor_id → admite múltiples cuentas → libre.
// ══════════════════════════════════════════════════════════════
console.log('[31] cuentas_bancarias_vendedor...');
stream.write(`-- 31. CUENTAS_BANCARIAS_VENDEDOR\n`);
const cuentaIds = [];
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const vId = pick(vendedorIds);
        const n1  = nombre(), ap1 = apellido(), ap2 = apellido();
        rows.push(
            `${i},${vId},'${pick(BANCOS)}','${n1} ${ap1} ${ap2}',` +
            `'${clabe18()}',${bool(rand() > 0.35)}`
        );
        cuentaIds.push(i);
    }
    insertBatch(stream, 'cuentas_bancarias_vendedor',
                ['id_cuenta','vendedor_id','banco','titular_cuenta','clabe_interbancaria','es_principal'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} cuentas bancarias`);


// ══════════════════════════════════════════════════════════════
// 32. SALDO_VENDEDORES — vendedor_id UNIQUE
//     Solo 30 000 filas (una exacta por vendedor).
//     Solución: saldo_i → vendedor_i (mapeo directo 1:1).
// ══════════════════════════════════════════════════════════════
console.log('[32] saldo_vendedores...');
stream.write(`-- 32. SALDO_VENDEDORES (vendedor_id UNIQUE → 1 saldo por vendedor, ${N_VENDEDORES.toLocaleString()} filas)\n`);
{
    const rows = [];
    for (let i = 1; i <= N_VENDEDORES; i++) {
        const comis = (rand() * 5000).toFixed(2);
        const deuda = (rand() * 1000).toFixed(2);
        rows.push(`${i},${i},${comis},${deuda}`);
    }
    insertBatch(stream, 'saldo_vendedores',
                ['id_saldo','vendedor_id','comisiones_acumuladas','deuda_por_faltantes'], rows);
    stream.write('\n');
}
console.log(`    ${N_VENDEDORES.toLocaleString()} saldos (1 por vendedor)`);


// ══════════════════════════════════════════════════════════════
// 33. PAGOS_VENDEDORES — 100 000
//     FK: vendedor_id, empleado_id, cuenta_destino_id → libre.
// ══════════════════════════════════════════════════════════════
console.log('[33] pagos_vendedores...');
stream.write(`-- 33. PAGOS_VENDEDORES\n`);
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const vId   = pick(vendedorIds);
        const empId = pick(empleadoIds);
        const ctaId = pick(cuentaIds);
        const fecha = fmtDT(randDate(2020, 2025));
        const monto = (100 + rand() * 4900).toFixed(2);
        rows.push(
            `${i},${vId},${empId},'${fecha}',${monto},'${pick(CONCEPTO_PAGO)}',` +
            `${ctaId},'https://pagos.conveme.mx/${i}.pdf'`
        );
    }
    insertBatch(stream, 'pagos_vendedores',
                ['id_pago','vendedor_id','empleado_id','fecha_pago','monto_pagado',
                'concepto_pago','cuenta_destino_id','comprobante_url'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} pagos a vendedores`);


// ══════════════════════════════════════════════════════════════
// 34. GASTOS_OPERATIVOS — 100 000
//     FK: categoria_gasto_id (siempre), empleado_id / vendedor_id /
//     evento_id son opcionales (NULL permitido en el esquema).
// ══════════════════════════════════════════════════════════════
console.log('[34] gastos_operativos...');
stream.write(`-- 34. GASTOS_OPERATIVOS\n`);
{
    const DETALLES_GASTO = ['Material de empaque holográfico','Renta de stand en evento',
    'Transporte a facultad','Compra de bases metálicas','Impresión de etiquetas',
    'Pago de publicidad en redes','Mantenimiento de equipo','Material de oficina',
    'Servicio de mensajería','Gastos de logística'];
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const catGId = pick(categoriaGastoIds);
        const empId  = rand() > 0.30 ? pick(empleadoIds) : 'NULL';
        const vId    = rand() > 0.60 ? pick(vendedorIds)  : 'NULL';
        const evId   = rand() > 0.70 ? pick(eventoIds)    : 'NULL';
        const fecha  = fmtDT(randDate(2020, 2025));
        const monto  = (50 + rand() * 5000).toFixed(2);
        const desc   = esc(pick(DETALLES_GASTO));
        rows.push(
            `${i},${catGId},${empId},${vId},${evId},${monto},'${fecha}','${desc}',` +
            `'https://gastos.conveme.mx/${i}.pdf'`
        );
    }
    insertBatch(stream, 'gastos_operativos',
                ['id_gasto','categoria_gasto_id','empleado_id','vendedor_id','evento_id',
                'monto','fecha','descripcion','comprobante_url'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} gastos operativos`);


// ══════════════════════════════════════════════════════════════
// 35. AUDITORIA_SISTEMA — 100 000
//     FK: usuario_id → admite múltiples registros → libre.
// ══════════════════════════════════════════════════════════════
console.log('[35] auditoria_sistema...');
stream.write(`-- 35. AUDITORIA_SISTEMA\n`);
{
    const rows = [];
    for (let i = 1; i <= TARGET; i++) {
        const uId = pick(usuarioIds);
        rows.push(`${i},${uId},'${pick(ACCIONES_LOG)}','${pick(TABLAS_LOG)}'`);
    }
    insertBatch(stream, 'auditoria_sistema',
                ['id_auditoria','usuario_id','accion','tabla_afectada'], rows);
    stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} registros de auditoría`);


// ══════════════════════════════════════════════════════════════
// RESTAURAR RESTRICCIONES Y CONFIRMAR TRANSACCIÓN
// ══════════════════════════════════════════════════════════════
stream.write(`-- Restaurar restricciones de FK y confirmar\n`);
stream.write(`SET FOREIGN_KEY_CHECKS = 1;\n`);
stream.write(`COMMIT;\n\n`);
stream.write(`-- ============================================================\n`);
stream.write(`-- FIN DEL SEED — CONVEME (MariaDB)\n`);
stream.write(`-- Total tablas pobladas: 35\n`);
stream.write(`-- Registros en tablas principales: ${TARGET.toLocaleString()} c/u\n`);
stream.write(`-- ============================================================\n`);

stream.end(() => {
    const mb = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(1);
    console.log(`\n✅  COMPLETADO`);
    console.log(`    Archivo : ${OUTPUT}`);
    console.log(`    Tamaño  : ${mb} MB`);
    console.log(`\n📦  Para importar en MariaDB:`);
    console.log(`    mysql -u root -p BD_CONVEME < seed_conveme.sql`);
    console.log(`\n    (o desde DBeaver: Tools → Execute Script)\n`);
});
