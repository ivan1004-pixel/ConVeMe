import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PackagePlus, Loader2 } from 'lucide-react';
import { convemeApi } from '../../api/convemeApi';
import { createAsignacion } from '../../services/asignacion.service'; // Ajusta la ruta

interface ModalAsignacionProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ModalAsignacion({ isOpen, onClose, onSuccess }: ModalAsignacionProps) {
    const [vendedores, setVendedores] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // Estado del formulario
    const [vendedorId, setVendedorId] = useState('');
    const [detalles, setDetalles] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) cargarCatalogos();
    }, [isOpen]);

        const cargarCatalogos = async () => {
            setLoadingData(true);
            try {
                // Hacemos una petición rápida de GraphQL para traer lo necesario para el modal
                const query = `
                query {
                    vendedores { id_vendedor nombre_completo }
                    productos { id_producto nombre sku precio_unitario activo }
                }
                `;
                const { data } = await convemeApi.post('', { query });
                setVendedores(data.data.vendedores || []);
                setProductos(data.data.productos?.filter((p:any) => p.activo) || []);
            } catch (error) {
                console.error("Error cargando catálogos", error);
            } finally {
                setLoadingData(false);
            }
        };

        const handleAddProducto = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const prodId = Number(e.target.value);
            if (!prodId) return;

            // Evitar duplicados
            if (detalles.find(d => d.producto_id === prodId)) return;

            const prod = productos.find(p => p.id_producto === prodId);
            setDetalles([...detalles, {
                producto_id: prod.id_producto,
                nombre: prod.nombre,
                cantidad_asignada: 1
            }]);

            e.target.value = ''; // Resetear el select
        };

        const updateCantidad = (index: number, cantidad: number) => {
            const nuevos = [...detalles];
            nuevos[index].cantidad_asignada = cantidad > 0 ? cantidad : 1;
            setDetalles(nuevos);
        };

        const removeProducto = (index: number) => {
            setDetalles(detalles.filter((_, i) => i !== index));
        };

        const handleGuardar = async () => {
            if (!vendedorId || detalles.length === 0) return alert("Completa los datos");

            setGuardando(true);
            try {
                await createAsignacion({
                    vendedor_id: Number(vendedorId),
                                       estado: "Activa",
                                       detalles: detalles.map(d => ({
                                           producto_id: d.producto_id,
                                           cantidad_asignada: d.cantidad_asignada
                                       }))
                });
                onSuccess(); // Recarga la tabla principal
                onClose(); // Cierra el modal
                setVendedorId('');
                setDetalles([]);
            } catch (error: any) {
                alert("Error: " + error.message);
            } finally {
                setGuardando(false);
            }
        };

        if (!isOpen) return null;

        return (
            <div className="me-overlay" style={{zIndex: 50}}>
            <motion.div className="me-backdrop" initial={{opacity:0}} animate={{opacity:1}} onClick={onClose} />
            <motion.div className="me-modal" style={{maxWidth:'600px', width:'95%'}} initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}}>
            <div className="me-header">
            <div className="me-header-left">
            <div className="me-header-icon" style={{background:'#06d6a0', color:'#1a0060'}}><PackagePlus size={20}/></div>
            <div>
            <p className="me-header-title">Nueva Asignación</p>
            <span className="me-header-sub">Entregar mercancía a vendedor</span>
            </div>
            </div>
            <button className="me-close-btn" onClick={onClose}><X size={16}/></button>
            </div>

            <div className="me-body scrollbar-thin">
            {loadingData ? <div className="text-center py-6"><Loader2 className="animate-spin mx-auto text-[#1a0060]"/></div> : (
                <>
                <div className="mb-4">
                <label className="me-label">1. Seleccionar Vendedor</label>
                <select className="me-select" value={vendedorId} onChange={e => setVendedorId(e.target.value)}>
                <option value="">-- Elige un vendedor --</option>
                {vendedores.map(v => (
                    <option key={v.id_vendedor} value={v.id_vendedor}>{v.nombre_completo}</option>
                ))}
                </select>
                </div>

                <div className="mb-4">
                <label className="me-label">2. Añadir Productos (Pines / Stickers)</label>
                <select className="me-select bg-[#f8f5ff]" defaultValue="" onChange={handleAddProducto}>
                <option value="">+ Buscar producto para agregar...</option>
                {productos.map(p => (
                    <option key={p.id_producto} value={p.id_producto}>{p.sku} - {p.nombre} (${p.precio_unitario})</option>
                ))}
                </select>
                </div>

                {detalles.length > 0 && (
                    <div className="bg-[#f8f5ff] rounded-2xl border-2 border-[#1a0060]/5 overflow-hidden mt-2">
                    <table className="w-full text-[11px]">
                    <thead className="bg-[#1a0060] text-white">
                    <tr>
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-center w-24">Cantidad</th>
                    <th className="p-2 text-center w-12"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {detalles.map((det, idx) => (
                        <tr key={idx} className="border-b border-[#1a0060]/5">
                        <td className="p-2 font-bold">{det.nombre}</td>
                        <td className="p-2">
                        <input type="number" min="1" className="w-full text-center bg-white border rounded p-1 outline-none focus:ring-1 focus:ring-[#06d6a0]"
                        value={det.cantidad_asignada} onChange={e => updateCantidad(idx, parseInt(e.target.value))} />
                        </td>
                        <td className="p-2 text-center">
                        <button onClick={() => removeProducto(idx)} className="text-red-500 hover:bg-red-50 rounded-full p-1 font-bold">
                        <X size={14}/>
                        </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                    </div>
                )}
                </>
            )}
            </div>

            <div className="me-actions-footer">
            <button className="me-save-btn bg-[#06d6a0] hover:bg-[#05b586] text-[#1a0060]" onClick={handleGuardar} disabled={guardando || !vendedorId || detalles.length === 0}>
            {guardando ? <Loader2 className="animate-spin" /> : 'Confirmar Asignación'}
            </button>
            </div>
            </motion.div>
            </div>
        );
}
