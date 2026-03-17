import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../hooks/useUser';

export default function CreateUser() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rolId, setRolId] = useState(1); // Por defecto rol 1 (ej. Vendedor)

    const { loading, error, exito, crearUsuario, setExito } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fueExitoso = await crearUsuario(username, password, rolId);

        // Si fue exitoso, limpiamos el formulario después de un ratito
        if (fueExitoso) {
            setTimeout(() => {
                setUsername('');
                setPassword('');
                setRolId(1);
                setExito(false);
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-[#ede9fe] p-8 font-sans flex flex-col items-center justify-center">

        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-[8px_8px_0px_#1a0060] border-4 border-[#1a0060]"
        >
        <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#cc55ff] rounded-xl flex items-center justify-center border-2 border-[#1a0060]">
        <span className="text-2xl">👤</span>
        </div>
        <div>
        <h2 className="text-2xl font-black text-[#1a0060] uppercase tracking-wide">Nuevo Usuario</h2>
        <p className="text-[#1a0060]/60 font-medium text-sm">Registra accesos para el ERP</p>
        </div>
        </div>

        {/* ALERTA DE ÉXITO */}
        <AnimatePresence>
        {exito && (
            <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#06d6a0] text-white font-bold p-4 rounded-xl mb-6 border-2 border-[#05b589] flex items-center gap-2"
            >
            <span>✅</span> ¡Usuario creado exitosamente!
            </motion.div>
        )}
        </AnimatePresence>

        {/* ALERTA DE ERROR */}
        {error && (
            <div className="bg-red-100 text-red-600 font-bold p-4 rounded-xl mb-6 border-2 border-red-300">
            {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

        <div>
        <label className="block text-[#1a0060] font-bold text-xs uppercase tracking-wider mb-2">
        Nombre de Usuario
        </label>
        <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="ej. ivan_admin"
        required
        disabled={loading}
        className="w-full bg-[#f3e8ff] border-2 border-[#1a0060] rounded-xl p-3 font-medium text-[#1a0060] outline-none focus:bg-white focus:shadow-[4px_4px_0px_#cc55ff] transition-all"
        />
        </div>

        <div>
        <label className="block text-[#1a0060] font-bold text-xs uppercase tracking-wider mb-2">
        Contraseña Temporal
        </label>
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        disabled={loading}
        className="w-full bg-[#f3e8ff] border-2 border-[#1a0060] rounded-xl p-3 font-medium text-[#1a0060] outline-none focus:bg-white focus:shadow-[4px_4px_0px_#cc55ff] transition-all"
        />
        </div>

        <div>
        <label className="block text-[#1a0060] font-bold text-xs uppercase tracking-wider mb-2">
        Rol de Acceso
        </label>
        <div className="relative">
        <select
        value={rolId}
        onChange={(e) => setRolId(Number(e.target.value))}
        disabled={loading}
        className="w-full bg-[#f3e8ff] border-2 border-[#1a0060] rounded-xl p-3 font-medium text-[#1a0060] outline-none focus:bg-white focus:shadow-[4px_4px_0px_#cc55ff] transition-all appearance-none cursor-pointer"
        >
        <option value={1}>Administrador</option>
        <option value={2}>Vendedor</option>
        <option value={3}>Logística / Inventario</option>
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#1a0060]">
        ▼
        </div>
        </div>
        </div>

        <motion.button
        type="submit"
        disabled={loading}
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        className="w-full bg-[#1a0060] text-[#ffe144] font-black uppercase tracking-widest p-4 rounded-xl border-2 border-[#1a0060] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] mt-4 disabled:opacity-70"
        >
        {loading ? 'Guardando...' : 'Crear Usuario 🚀'}
        </motion.button>

        </form>
        </motion.div>
        </div>
    );
}
