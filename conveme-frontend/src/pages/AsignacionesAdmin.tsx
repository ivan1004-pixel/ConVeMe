import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserGreeting from '../components/ui/UserGreeting';
import ActionModal from '../components/ui/ActionModal';
import type { ActionType } from '../components/ui/ActionModal';
import { getAsignaciones, createAsignacion, deleteAsignacion } from '../services/asignacion.service';
import { getVendedores } from '../services/vendedor.service';
import { getProductos } from '../services/producto.service';
import {
    Search, Plus, Trash2, Loader2, PackageOpen, Users, X
} from 'lucide-react';

// Asegúrate de que estas rutas de estilos existan
import '../styles/Catalogos.css';
import '../styles/Modales.css';

interface DetalleAsignacion {
    producto_id: number;
    cantidad: number;
    nombre?: string;
}

export default function AsignacionesAdmin() {
    const [asignaciones, setAsignaciones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Estados para nueva asignación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vendedores, setVendedores] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [vendedorId, setVendedorId] = useState<number | ''>('');
    const [detalles, setDetalles] = useState<DetalleAsignacion[]>([]);
    const [guardando, setGuardando] = useState(false);

    const [actionModal, setActionModal] = useState<{
        isOpen: boolean; type: ActionType; title: string; subtitle: string; description?: string; itemName?: string; onConfirm?: () => Promise<void>;
    }>({ isOpen: false, type: 'success', title: '', subtitle: '' });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [asigData, vends, prods] = await Promise.all([
                getAsignaciones(),
                                                               getVendedores(),
                                                               getProductos()
            ]);
            setAsignaciones(asigData.sort((a: any, b: any) => b.id_asignacion - a.id_asignacion));
            setVendedores(vends);
            setProductos(prods);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Lógica del Modal de Creación ---
    const agregarDetalle = () => setDetalles([...detalles, { producto_id: 0, cantidad: 1 }]);

    const actualizarDetalle = (index: number, campo: keyof DetalleAsignacion, valor: any) => {
        const nuevos = [...detalles];
        if (campo === 'producto_id') {
            const id = Number(valor);
            const p = productos.find(x => x.id_producto === id);
            nuevos[index] = { ...nuevos[index], producto_id: id, nombre: p?.nombre };
        } else if (campo === 'cantidad') {
            nuevos[index] = { ...nuevos[index], cantidad: Number(valor) };
        }
        setDetalles(nuevos);
    };

    const quitarDetalle = (index: number) => setDetalles(detalles.filter((_, i) => i !== index));

    const handleGuardarAsignacion = async () => {
        if (!vendedorId) return alert("Selecciona un vendedor.");
        if (detalles.length === 0 || detalles.some(d => d.producto_id === 0)) {
            return alert("Agrega productos válidos.");
        }

        setGuardando(true);
        try {
            // Ajustado a los nombres de tu CreateAsignacionVendedorInput
            const payload = {
                vendedor_id: Number(vendedorId),
                estado: 'Activa',
                detalles: detalles.map(d => ({
                    producto_id: Number(d.producto_id),
                                             cantidad_asignada: Number(d.cantidad)
                }))
            };

            await createAsignacion(payload);

            await cargarDatos();
            setIsModalOpen(false);
            setVendedorId('');
            setDetalles([]);
            setActionModal({
                isOpen: true,
                type: 'success',
                title: '¡Asignado!',
                subtitle: 'La mercancía ha sido vinculada al vendedor.'
            });
            setTimeout(() => setActionModal(prev => ({ ...prev, isOpen: false })), 2000);
        } catch (error: any) {
            alert(error.message || "Error al guardar");
        } finally {
            setGuardando(false);
        }
    };

    const handleDelete = (asignacion: any) => {
        setActionModal({
            isOpen: true, type: 'confirm-delete',
            title: 'Eliminar Asignación', subtitle: '¿Borrar este registro?',
            description: 'Se eliminará la asignación. Asegúrate de que los productos hayan regresado al inventario físico.',
            itemName: `Vendedor: ${asignacion.vendedor?.nombre_completo}`,
            onConfirm: async () => {
                await deleteAsignacion(asignacion.id_asignacion);
                await cargarDatos();
                setActionModal({ isOpen: true, type: 'success-delete', title: 'Eliminada', subtitle: 'Asignación borrada.' });
                setTimeout(() => setActionModal(prev => ({ ...prev, isOpen: false })), 2000);
            }
        });
    };

    const filtradas = asignaciones.filter(a =>
    String(a.id_asignacion).includes(search) ||
    (a.vendedor?.nombre_completo || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="cat-root">
        <UserGreeting />

        <div className="cat-header">
        <div className="cat-header-text">
        <h1>Asignaciones a Vendedores</h1>
        <p>Entrega mercancía a tu equipo para que la vendan en sus escuelas.</p>
        </div>
        <div className="cat-add-wrap">
        <motion.button
        className="cat-add-btn"
        onClick={() => { setDetalles([]); setIsModalOpen(true); }}
        whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
        >
        <Plus size={17} /> Nueva Asignación
        </motion.button>
        </div>
        </div>

        <motion.div className="cat-card mt-6" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}>
        <div className="cat-card-header">
        <div className="cat-card-header-left">
        <span className="cat-card-title-icon"><Users size={16} /></span>
        <span className="cat-card-title">Mercancía en Ruta</span>
        <span className="cat-count-badge">{filtradas.length} registros</span>
        </div>
        <div className="cat-card-header-right">
        <div className="cat-search-wrap">
        <Search size={13} />
        <input className="cat-search-input" placeholder="Buscar vendedor..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        </div>
        </div>

        <div className="cat-table-scroll p-4">
        {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-[#1a0060]/40 font-syne font-bold gap-3">
            <Loader2 size={32} className="animate-spin" /> Cargando asignaciones...
            </div>
        ) : filtradas.length === 0 ? (
            <div className="py-12 text-center text-[#1a0060]/50 font-syne font-bold">No hay mercancía asignada actualmente.</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtradas.map(asig => (
                <div key={asig.id_asignacion} className="bg-white border-2 border-[#1a0060]/10 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-[4px_4px_0px_rgba(26,0,96,0.1)] transition-all">
                <div>
                <div className="flex justify-between items-start mb-3">
                <div>
                <h3 className="font-syne font-black text-lg text-[#1a0060]">Folio #{asig.id_asignacion}</h3>
                <p className="text-xs font-bold text-[#1a0060]/50">{new Date(asig.fecha_asignacion).toLocaleDateString('es-MX')}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-syne font-black uppercase tracking-wider ${asig.estado === 'Activa' ? 'bg-[#06d6a0] text-white' : 'bg-gray-200 text-gray-700'}`}>
                {asig.estado}
                </span>
                </div>

                <p className="text-sm font-bold text-[#cc55ff] mb-4">👤 {asig.vendedor?.nombre_completo}</p>

                <div className="bg-[#f8f5ff] rounded-xl p-3 mb-4 max-h-[150px] overflow-y-auto scrollbar-thin">
                <h4 className="text-[10px] font-syne font-bold uppercase text-[#1a0060]/60 mb-2 flex items-center gap-1"><PackageOpen size={12}/> Productos Entregados</h4>
                {asig.detalles.map((det: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs font-medium text-[#1a0060] border-b border-[#1a0060]/5 py-1.5 last:border-0">
                    <span className="truncate pr-2">{det.producto?.nombre}</span>
                    <span className="font-black shrink-0 text-[#06d6a0]">x{det.cantidad_asignada}</span>
                    </div>
                ))}
                </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-[#1a0060]/10">
                <button onClick={() => handleDelete(asig)} className="bg-[#FFEAEF] text-[#ff5050] hover:bg-[#ff5050] hover:text-white border border-[#ff5050]/20 rounded-xl px-3 py-2 flex justify-center items-center transition-colors text-xs font-bold gap-2">
                <Trash2 size={14}/> Eliminar
                </button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
        </motion.div>

        {/* --- MODAL PARA CREAR ASIGNACIÓN --- */}
        <AnimatePresence>
        {isModalOpen && (
            <div className="me-overlay" style={{ zIndex: 40 }}>
            <motion.div className="me-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setIsModalOpen(false)} />
            <motion.div className="me-modal" style={{ maxWidth: '500px' }} initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}}>
            <div className="me-header">
            <div className="me-header-left">
            <div className="me-header-icon" style={{ background:'rgba(6,214,160,0.15)', color:'#06d6a0', borderColor:'#06d6a0' }}><PackageOpen size={20}/></div>
            <div><p className="me-header-title">Nueva Asignación</p><span className="me-header-sub">Entregar mercancía a un vendedor</span></div>
            </div>
            <button className="me-close-btn" onClick={() => setIsModalOpen(false)}><X size={16}/></button>
            </div>

            <div className="me-body">
            <div>
            <label className="me-label">Vendedor Asignado</label>
            <select className="me-select" value={vendedorId} onChange={e => setVendedorId(Number(e.target.value))}>
            <option value="" disabled>Selecciona al vendedor...</option>
            {vendedores.map(v => <option key={v.id_vendedor} value={v.id_vendedor}>{v.nombre_completo}</option>)}
            </select>
            </div>

            <div className="border-t-[2.5px] border-[#1a0060]/10 pt-4">
            <div className="flex justify-between items-center mb-2">
            <label className="me-label !mb-0">Productos</label>
            <button onClick={agregarDetalle} className="text-[#06d6a0] font-bold text-xs flex items-center gap-1 hover:underline"><Plus size={12}/> Agregar Fila</button>
            </div>

            {detalles.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-[#1a0060]/10 rounded-2xl bg-[#faf5ff]">
                <p className="text-xs text-[#1a0060]/40 font-bold uppercase tracking-wider">La lista está vacía</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
                {detalles.map((det, index) => (
                    <div key={index} className="flex items-center gap-2 bg-[#faf5ff] p-2 rounded-xl border border-[#d4b8f0]">
                    <select
                    className="flex-1 bg-transparent text-xs font-bold text-[#1a0060] outline-none"
                    value={det.producto_id}
                    onChange={e => actualizarDetalle(index, 'producto_id', e.target.value)}
                    >
                    <option value={0} disabled>Producto...</option>
                    {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>)}
                    </select>
                    <input
                    type="number"
                    min="1"
                    placeholder="Cant."
                    className="w-16 bg-white border border-[#d4b8f0] rounded-lg p-1 text-center text-xs font-black outline-none"
                    value={det.cantidad}
                    onChange={e => actualizarDetalle(index, 'cantidad', e.target.value)}
                    />
                    <button onClick={() => quitarDetalle(index)} className="text-[#ff5050] p-1 hover:bg-[#FFEAEF] rounded-lg transition-colors"><Trash2 size={14}/></button>
                    </div>
                ))}
                </div>
            )}
            </div>
            </div>

            <div className="me-actions-footer">
            <button className="me-save-btn" onClick={handleGuardarAsignacion} disabled={guardando}>
            {guardando ? <Loader2 size={16} className="me-spinner" /> : 'Entregar Mercancía'}
            </button>
            </div>
            </motion.div>
            </div>
        )}
        </AnimatePresence>

        <ActionModal
        isOpen={actionModal.isOpen} type={actionModal.type} title={actionModal.title} subtitle={actionModal.subtitle} description={actionModal.description} itemName={actionModal.itemName} onClose={() => setActionModal({ ...actionModal, isOpen: false })} onConfirm={actionModal.onConfirm}
        />
        </div>
    );
}
