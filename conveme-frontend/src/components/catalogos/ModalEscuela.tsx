import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Building } from 'lucide-react';

interface ModalEscuelaProps {
    isOpen: boolean;
    onClose: () => void;
    // Aquí después pasaremos la función real para guardar en BD
    onSave: (data: { nombre: string; siglas: string; municipio_id: number }) => Promise<void>;
}

export default function ModalEscuela({ isOpen, onClose, onSave }: ModalEscuelaProps) {
    const [nombre, setNombre] = useState('');
    const [siglas, setSiglas] = useState('');
    const [municipioId, setMunicipioId] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ nombre, siglas, municipio_id: municipioId });
            // Limpiamos el formulario al terminar
            setNombre('');
            setSiglas('');
            setMunicipioId(1);
            onClose(); // Cerramos el modal
        } catch (error) {
            console.error(error);
            alert("Error al guardar la escuela");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
            {/* Fondo oscuro desenfocado */}
            <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1a0060]/40 backdrop-blur-sm"
            onClick={onClose}
            />

            {/* Tarjeta del Formulario */}
            <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white border-4 border-[#1a0060] rounded-3xl w-full max-w-md shadow-[8px_8px_0px_#1a0060] overflow-hidden"
            >
            {/* Cabecera */}
            <div className="bg-[#ffe144] border-b-4 border-[#1a0060] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl border-2 border-[#1a0060]">
            <Building size={20} className="text-[#1a0060]" />
            </div>
            <h2 className="font-black text-[#1a0060] text-lg uppercase tracking-wide">Añadir Escuela</h2>
            </div>
            <button
            onClick={onClose}
            className="text-[#1a0060] hover:bg-[#1a0060] hover:text-white p-1 rounded-lg transition-colors border-2 border-transparent hover:border-[#1a0060]"
            >
            <X size={24} />
            </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

            <div>
            <label className="block text-[#1a0060] font-bold text-xs uppercase tracking-wider mb-2">Nombre de la Institución</label>
            <input
            type="text" required disabled={loading}
            value={nombre} onChange={e => setNombre(e.target.value)}
            placeholder="Ej. Facultad de Arquitectura"
            className="w-full bg-[#f3e8ff] border-2 border-[#1a0060] rounded-xl p-3 font-medium text-[#1a0060] outline-none focus:bg-white focus:shadow-[4px_4px_0px_#cc55ff] transition-all"
            />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-[#1a0060] font-bold text-xs uppercase tracking-wider mb-2">Siglas</label>
            <input
            type="text" required disabled={loading}
            value={siglas} onChange={e => setSiglas(e.target.value)}
            placeholder="Ej. FARQ"
            className="w-full bg-[#f3e8ff] border-2 border-[#1a0060] rounded-xl p-3 font-medium text-[#1a0060] outline-none focus:bg-white focus:shadow-[4px_4px_0px_#cc55ff] transition-all uppercase"
            />
            </div>
            <div>
            <label className="block text-[#1a0060] font-bold text-xs uppercase tracking-wider mb-2">ID Municipio</label>
            <input
            type="number" required disabled={loading} min="1"
            value={municipioId} onChange={e => setMunicipioId(Number(e.target.value))}
            className="w-full bg-[#f3e8ff] border-2 border-[#1a0060] rounded-xl p-3 font-medium text-[#1a0060] outline-none focus:bg-white focus:shadow-[4px_4px_0px_#cc55ff] transition-all"
            />
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
