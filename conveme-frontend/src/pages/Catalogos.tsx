import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserGreeting from '../components/ui/UserGreeting';
import { Plus } from 'lucide-react';

export default function Catalogos() {
    const [tabActiva, setTabActiva] = useState('escuelas');

    const tabs = [
        { id: 'escuelas', label: 'Escuelas' },
        { id: 'empleados', label: 'Empleados' },
        { id: 'vendedores', label: 'Vendedores' },
        { id: 'cuentas', label: 'Cuentas Bancarias' },
        { id: 'eventos', label: 'Eventos' },
    ];

    // Esta función decide qué cabeceras mostrar según tu base de datos real
    const renderCabeceras = () => {
        switch (tabActiva) {
            case 'escuelas':
                return ['ID', 'Nombre', 'Siglas', 'Municipio', 'Estado', 'Acciones'];
            case 'empleados':
                return ['ID', 'Nombre Completo', 'Puesto', 'Teléfono', 'Email', 'Acciones'];
            case 'vendedores':
                return ['ID', 'Nombre Completo', 'Escuela Asignada', 'Instagram', 'Comisiones', 'Acciones'];
            case 'cuentas':
                return ['ID', 'Vendedor', 'Banco', 'Titular', 'CLABE', 'Acciones'];
            case 'eventos':
                return ['ID', 'Nombre Evento', 'Fechas', 'Escuela Sede', 'Estado', 'Acciones'];
            default:
                return [];
        }
    };

    return (
        <div className="space-y-8">
        <UserGreeting />

        <div className="bg-white border-4 border-[#1a0060] rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_#1a0060]">

        {/* CABECERA Y BOTÓN */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
        <h1 className="text-3xl font-black text-[#1a0060] uppercase">Catálogos</h1>
        <p className="text-[#1a0060]/60 font-medium">Selecciona una categoría para administrar sus registros.</p>
        </div>

        <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="bg-[#06d6a0] text-white font-black uppercase tracking-wider px-6 py-3 rounded-xl border-4 border-[#1a0060] shadow-[4px_4px_0px_#1a0060] flex items-center justify-center gap-2"
        >
        <Plus size={20} />
        Añadir {tabs.find(t => t.id === tabActiva)?.label}
        </motion.button>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-8 border-b-4 border-[#1a0060] pb-4">
        {tabs.map((tab) => (
            <button
            key={tab.id}
            onClick={() => setTabActiva(tab.id)}
            className={`px-5 py-2 font-black uppercase text-sm md:text-base rounded-lg border-2 transition-all ${
                tabActiva === tab.id
                ? 'bg-[#ffe144] text-[#1a0060] border-[#1a0060] shadow-[3px_3px_0px_#1a0060] translate-y-[-2px]'
                : 'bg-transparent text-[#1a0060]/50 border-transparent hover:text-[#1a0060] hover:bg-gray-100'
            }`}
            >
            {tab.label}
            </button>
        ))}
        </div>

        {/* TABLA DINÁMICA */}
        <div className="bg-[#f3e8ff] border-2 border-[#1a0060] rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
        <motion.div
        key={tabActiva}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="overflow-x-auto"
        >
        <table className="w-full text-left border-collapse">
        <thead>
        <tr className="bg-[#cc55ff] border-b-4 border-[#1a0060]">
        {renderCabeceras().map((cabecera, index) => (
            <th key={index} className={`p-4 font-black text-white uppercase tracking-wider ${cabecera === 'Acciones' ? 'text-right' : ''}`}>
            {cabecera}
            </th>
        ))}
        </tr>
        </thead>
        <tbody>
        {/* ESTADO VACÍO: Listo para recibir los .map() de NestJS */}
        <tr>
        <td colSpan={renderCabeceras().length} className="p-8 text-center">
        <p className="text-[#1a0060] font-bold text-lg mb-2">No hay datos cargados todavía</p>
        <p className="text-[#1a0060]/60 font-medium">Conectando con la base de datos para extraer los registros de {tabActiva}...</p>
        </td>
        </tr>
        </tbody>
        </table>
        </motion.div>
        </AnimatePresence>
        </div>

        </div>
        </div>
    );
}
