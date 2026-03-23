import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Building, MapPin, ChevronDown, Search } from 'lucide-react';
import { getEstados, getMunicipiosPorEstado } from '../../services/ubicacion.service';

interface ModalEscuelaProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { nombre: string; siglas: string; municipio_id: number }) => Promise<void>;
}

export default function ModalEscuela({ isOpen, onClose, onSave }: ModalEscuelaProps) {
    const [nombre, setNombre] = useState('');
    const [siglas, setSiglas] = useState('');
    const [estadoId, setEstadoId] = useState<number | ''>('');
    const [municipioId, setMunicipioId] = useState<number | ''>('');

    // Estados Reales (se llenan con la Base de Datos)
    const [estados, setEstados] = useState<any[]>([]);
    const [municipios, setMunicipios] = useState<any[]>([]);

    // Buscador
    const [showMunicipioDrop, setShowMunicipioDrop] = useState(false);
    const [searchMunicipio, setSearchMunicipio] = useState('');

    const [loading, setLoading] = useState(false);

    // 1. Cargar estados al abrir
    useEffect(() => {
        if (isOpen) {
            cargarEstados();
        } else {
            setNombre(''); setSiglas(''); setEstadoId(''); setMunicipioId('');
            setSearchMunicipio(''); setShowMunicipioDrop(false);
            setMunicipios([]); // Limpiar municipios al cerrar
        }
    }, [isOpen]);

    // 2. Cargar municipios cuando cambia el estado
    useEffect(() => {
        if (estadoId) {
            cargarMunicipios(Number(estadoId));
            setMunicipioId('');
            setSearchMunicipio('');
        } else {
            setMunicipios([]);
        }
    }, [estadoId]);

    const cargarEstados = async () => {
        try {
            const data = await getEstados();
            setEstados(data);
        } catch (error) {
            console.error("Error cargando estados:", error);
        }
    };

    const cargarMunicipios = async (id: number) => {
        try {
            const data = await getMunicipiosPorEstado(id);
            setMunicipios(data);
        } catch (error) {
            console.error("Error cargando municipios:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!municipioId) return alert("Por favor selecciona un municipio");

        setLoading(true);
        try {
            await onSave({ nombre, siglas, municipio_id: Number(municipioId) });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrado 100% real de la base de datos
    const municipiosFiltrados = municipios.filter(m =>
    m.nombre.toLowerCase().includes(searchMunicipio.toLowerCase())
    );

    const municipioSeleccionado = municipios.find(m => m.id_municipio === municipioId);

    return (
        <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
            <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1a0060]/40 backdrop-blur-sm"
            onClick={onClose}
            />

            <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white border-4 border-[#1a0060] rounded-3xl w-full max-w-md shadow-[8px_8px_0px_#1a0060] overflow-visible"
            >
            <div className="bg-[#ffe144] border-b-4 border-[#1a0060] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl border-2 border-[#1a0060]">
            <Building size={20} className="text-[#1a0060]" />
            </div>
            <h2 className="font-black text-[#1a0060] text-lg uppercase tracking-wide">Añadir Escuela</h2>
            </div>
            <button type="button" onClick={onClose} className="text-[#1a0060] hover:bg-[#1a0060] hover:text-white p-1 rounded-lg transition-colors border-2 border-transparent hover:border-[#1a0060]">
            <X size={24} />
            </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
            <label className="block text-[#1a0060] font-bold text-xs uppercase tracking-wider mb-2">Nombre de la Institución</label>
            <input
            type="text" required disabled={loading}
            value={nombre} onChange={e => setNombre(e.target.value)}
            placeholder="Ej. Fac. Arquitectura UAEMex"
            className="w-full bg-[#f3e8ff] border-2 border-[#1a0060] rounded-xl p-3 font-medium text-[#1a0060] outline-none focus:bg-white focus:shadow-[4px_4px_0px_#cc55ff] transition-all"
            />
            </div>

            <div>
            <label className="block text-[#1a0060] font-bold text-xs uppercase tracking-wider mb-2">Siglas</label>
            <input
            type="text" required disabled={loading}
            value={siglas} onChange={e => setSiglas(e.target.value)}
            placeholder="Ej. FARQ"
            className="w-full bg-[#f3e8ff] border-2 border-[#1a0060] rounded-xl p-3 font-medium text-[#1a0060] outline-none focus:bg-white focus:shadow-[4px_4px_0px_#cc55ff] transition-all uppercase"
            />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t-2 border-[#1a0060]/10 pt-4 mt-2">
            <div>
            <label className="text-[#1a0060] font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1"><MapPin size={12}/> Estado</label>
            <select
            required disabled={loading || estados.length === 0}
            value={estadoId}
            onChange={e => setEstadoId(Number(e.target.value))}
            className="w-full bg-[#f3e8ff] border-2 border-[#1a0060] rounded-xl p-3 font-medium text-[#1a0060] outline-none focus:bg-white cursor-pointer transition-all appearance-none"
            >
            <option value="" disabled>Seleccione...</option>
            {estados.map(est => (
                <option key={est.id_estado} value={est.id_estado}>{est.nombre}</option>
            ))}
            </select>
            </div>

            <div className="relative">
            <label className="text-[#1a0060] font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1"><MapPin size={12}/> Municipio</label>
            <div
            onClick={() => {
                if (!loading && estadoId) setShowMunicipioDrop(!showMunicipioDrop);
            }}
            className={`w-full bg-[#f3e8ff] border-2 border-[#1a0060] rounded-xl p-3 font-medium text-[#1a0060] cursor-pointer flex justify-between items-center transition-all ${(!estadoId || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'}`}
            >
            <span className="truncate pr-2">
            {municipioSeleccionado ? municipioSeleccionado.nombre : 'Seleccione...'}
            </span>
            <ChevronDown size={16} className="shrink-0" />
            </div>

            <AnimatePresence>
            {showMunicipioDrop && (
                <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 top-[105%] left-0 w-[200%] bg-white border-2 border-[#1a0060] rounded-xl shadow-[6px_6px_0px_#1a0060] overflow-hidden"
                >
                <div className="p-3 border-b-2 border-[#1a0060] bg-[#f3e8ff] flex items-center gap-2">
                <Search size={16} className="text-[#1a0060]/50" />
                <input
                type="text" autoFocus
                placeholder="Buscar municipio..."
                value={searchMunicipio}
                onChange={e => setSearchMunicipio(e.target.value)}
                className="w-full bg-transparent outline-none font-bold text-[#1a0060] placeholder-[#1a0060]/40 text-sm"
                />
                </div>
                <div className="max-h-48 overflow-y-auto">
                {municipiosFiltrados.length > 0 ? (
                    municipiosFiltrados.map(mun => (
                        <div
                        key={mun.id_municipio}
                        onClick={() => {
                            setMunicipioId(mun.id_municipio);
                            setShowMunicipioDrop(false);
                            setSearchMunicipio('');
                        }}
                        className="p-3 hover:bg-[#ffe144] cursor-pointer text-sm font-bold text-[#1a0060] border-b border-[#1a0060]/10 transition-colors"
                        >
                        {mun.nombre}
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-sm font-bold text-[#1a0060]/50">No hay resultados</div>
                )}
                </div>
                </motion.div>
            )}
            </AnimatePresence>
            </div>
            </div>

            <motion.button
            type="submit" disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
            className="w-full bg-[#06d6a0] text-white font-black uppercase tracking-widest p-4 rounded-xl border-4 border-[#1a0060] shadow-[4px_4px_0px_#1a0060] mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
            >
            {loading ? 'Guardando...' : <><Save size={20}/> Guardar Escuela</>}
            </motion.button>
            </form>
            </motion.div>
            </div>
        )}
        </AnimatePresence>
    );
}
