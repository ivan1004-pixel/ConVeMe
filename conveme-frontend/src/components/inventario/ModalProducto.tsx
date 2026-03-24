import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Save, Package, DollarSign, ListFilter, Trash2, AlertTriangle, RefreshCw, Check, ChevronDown } from 'lucide-react';
import { getCategorias } from '../../services/categoria.service';
import { getTamanos } from '../../services/tamano.service';

interface ModalProductoProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    onDelete?: () => Promise<void>;
    productoAEditar?: any | null;
}

type ModalStep = 'form' | 'confirm-delete' | 'success' | 'success-delete';

export default function ModalProducto({ isOpen, onClose, onSave, onDelete, productoAEditar }: ModalProductoProps) {
    const dragControls = useDragControls();

    const [sku, setSku] = useState('');
    const [nombre, setNombre] = useState('');
    const [categoriaId, setCategoriaId] = useState<number | ''>('');
    const [tamanoId, setTamanoId] = useState<number | ''>('');
    const [precioUnitario, setPrecioUnitario] = useState<number | ''>('');
    const [precioMayoreo, setPrecioMayoreo] = useState<number | ''>('');
    const [cantidadMinima, setCantidadMinima] = useState<number>(12);
    const [costoProduccion, setCostoProduccion] = useState<number | ''>('');

    const [categorias, setCategorias] = useState<any[]>([]);
    const [tamanos, setTamanos] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<ModalStep>('form');

    const esEdicion = Boolean(productoAEditar);

    useEffect(() => {
        if (isOpen) {
            setStep('form');
            cargarListas();
            if (productoAEditar) {
                setSku(String(productoAEditar.sku || ''));
                setNombre(String(productoAEditar.nombre || ''));
                setCategoriaId(productoAEditar.categoria?.id_categoria || '');
                setTamanoId(productoAEditar.tamano?.id_tamano || '');
                setPrecioUnitario(Number(productoAEditar.precio_unitario) || '');
                setPrecioMayoreo(productoAEditar.precio_mayoreo ? Number(productoAEditar.precio_mayoreo) : '');
                setCantidadMinima(Number(productoAEditar.cantidad_minima_mayoreo) || 12);
                setCostoProduccion(productoAEditar.costo_produccion ? Number(productoAEditar.costo_produccion) : '');
            } else {
                limpiarFormulario();
            }
        } else {
            limpiarFormulario();
        }
    }, [isOpen, productoAEditar]);

    const cargarListas = async () => {
        try {
            const [dataCat, dataTam] = await Promise.all([getCategorias(), getTamanos()]);
            setCategorias(dataCat);
            setTamanos(dataTam);
        } catch (error) { console.error(error); }
    };

    const limpiarFormulario = () => {
        setSku(''); setNombre(''); setCategoriaId(''); setTamanoId('');
        setPrecioUnitario(''); setPrecioMayoreo(''); setCantidadMinima(12); setCostoProduccion('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoriaId) return alert("Selecciona una categoría.");
        if (!tamanoId) return alert("Selecciona un tamaño.");

        setLoading(true);
        try {
            const payload: any = {
                sku: String(sku).trim(),
                nombre: String(nombre).trim(),
                categoria_id: Number(categoriaId),
                tamano_id: Number(tamanoId),
                precio_unitario: Number(precioUnitario),
                precio_mayoreo: precioMayoreo ? Number(precioMayoreo) : undefined,
                cantidad_minima_mayoreo: Number(cantidadMinima),
                costo_produccion: costoProduccion ? Number(costoProduccion) : undefined,
            };
            await onSave(payload);
            setStep('success');
            setTimeout(() => { onClose(); setStep('form'); }, 2200);
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Error al guardar el producto.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        setLoading(true);
        try {
            await onDelete();
            setStep('success-delete');
            setTimeout(() => { onClose(); setStep('form'); }, 2000);
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <style>{`
            /* Se usan las mismas clases de la escuela, pero ajustando colores al MORADO (#cc55ff) */
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
            .prod-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: 'DM Sans', sans-serif; }
            .prod-backdrop { position: absolute; inset: 0; background: rgba(26,0,96,0.45); backdrop-filter: blur(6px); }
            .prod-modal { position: relative; background: #fff; border: 3px solid #1a0060; border-radius: 28px; width: 100%; max-width: 640px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 8px 8px 0px #1a0060; overflow: hidden; z-index: 2; }
            .prod-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 2.5px solid rgba(26,0,96,0.1); background: rgba(204,85,255,0.6); border-radius: 25px 25px 0 0; }
            .prod-header.delete { background: rgba(255,80,80,0.1); }
            .prod-header-left { display: flex; align-items: center; gap: 12px; }
            .prod-header-icon { width: 42px; height: 42px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            .prod-header-title { font-family: 'Syne', sans-serif; font-weight: 900; font-size: 16px; color: #1a0060; text-transform: uppercase; letter-spacing: .05em; line-height: 1.1; }
            .prod-header-sub { font-size: 11px; font-weight: 500; color: rgba(26,0,96,0.55); display: block; margin-top: 2px; }
            .prod-close-btn { width: 36px; height: 36px; border-radius: 10px; border: 2px solid rgba(26,0,96,0.15); background: rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(26,0,96,0.5); transition: background .18s, color .18s, border-color .18s; flex-shrink: 0; }
            .prod-close-btn:hover { background: #ff5050; color: #fff; border-color: #ff5050; }
            .prod-body { padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; }
            .prod-section { background: rgba(204,85,255,0.05); border: 2px solid rgba(204,85,255,0.2); border-radius: 20px; padding: 20px; }
            .prod-section-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: .15em; color: #cc55ff; display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
            .prod-label { display: block; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: #1a0060; margin-bottom: 7px; }
            .prod-input { width: 100%; background: #fff; border: 2.5px solid #d4b8f0; border-radius: 12px; padding: 12px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: #1a0060; outline: none; transition: border-color .18s, box-shadow .18s; }
            .prod-input:focus { border-color: #cc55ff; box-shadow: 0 0 0 3px rgba(204,85,255,0.15), 3px 3px 0px #1a0060; }
            .prod-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
            .prod-footer { padding: 20px 24px; border-top: 2.5px solid rgba(26,0,96,0.1); background: #fff; display: flex; flex-direction: column; gap: 10px; }
            /* Botones, confirm y success reutilizan la misma lógica que las escuelas */
            .me-save-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; background: #1a0060; color: #ffe144; font-family: 'Syne', sans-serif; font-weight: 900; font-size: 14px; letter-spacing: .1em; text-transform: uppercase; border: 2.5px solid #1a0060; border-radius: 14px; padding: 15px; cursor: pointer; box-shadow: 4px 4px 0px rgba(0,0,0,0.3); transition: transform .12s, box-shadow .12s; }
            .me-save-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px rgba(0,0,0,0.3); }
            .me-delete-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: none; color: rgba(255,80,80,0.8); font-family: 'Syne', sans-serif; font-weight: 800; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; border: 2px solid rgba(255,80,80,0.25); border-radius: 12px; padding: 10px; cursor: pointer; transition: background .18s, color .18s, border-color .18s; }
            .me-delete-btn:hover { background: rgba(255,80,80,0.08); color: #ff5050; border-color: rgba(255,80,80,0.45); }
            `}</style>

            <AnimatePresence>
            {isOpen && (
                <div className="prod-overlay">
                <motion.div className="prod-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => step === 'form' ? onClose() : undefined} />

                <motion.div className="prod-modal" initial={{ opacity: 0, scale: 0.88, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.88, y: 24 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
                <div className={`prod-header ${step === 'confirm-delete' ? 'delete' : ''}`} onPointerDown={(e) => dragControls.start(e)} style={{ touchAction: 'none' }}>
                <div className="prod-header-left">
                <div className="prod-header-icon" style={{
                    background: step === 'confirm-delete' ? 'rgba(255,80,80,0.1)' : 'rgba(204,85,255,0.12)',
                        border: `1.5px solid ${step === 'confirm-delete' ? 'rgba(255,80,80,0.25)' : 'rgba(204,85,255,0.3)'}`,
                        color: step === 'confirm-delete' ? '#ff5050' : '#1a0060',
                }}>
                {step === 'confirm-delete' ? <Trash2 size={20} /> : <Package size={20} />}
                </div>
                <div>
                <p className="prod-header-title">
                {step === 'confirm-delete' ? 'Eliminar producto' : step.startsWith('success') ? '¡Listo!' : esEdicion ? 'Editar producto' : 'Nuevo producto'}
                </p>
                <span className="prod-header-sub">
                {step === 'confirm-delete' ? 'Esta acción no se puede deshacer' : step.startsWith('success') ? 'Operación completada' : esEdicion ? 'Modifica la ficha del producto' : 'Añade un nuevo producto al inventario'}
                </span>
                </div>
                </div>
                <button className="prod-close-btn" onClick={onClose} type="button"><X size={16} /></button>
                </div>

                <AnimatePresence mode="wait">
                {step === 'form' && (
                    <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                    <div className="prod-body">

                    {/* Ficha del Producto */}
                    <div className="prod-section">
                    <div className="prod-section-title"><ListFilter size={14} /> Ficha del Producto</div>
                    <div className="prod-grid2">
                    <div>
                    <label className="prod-label">Código / SKU</label>
                    <input type="text" required disabled={loading} value={sku} onChange={e => setSku(e.target.value.toUpperCase())} placeholder="Ej. PIN-AJO-01" className="prod-input uppercase" />
                    </div>
                    <div>
                    <label className="prod-label">Nombre</label>
                    <input type="text" required disabled={loading} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Pin de Ajolote" className="prod-input" />
                    </div>
                    <div>
                    <label className="prod-label">Categoría</label>
                    <select required disabled={loading || categorias.length === 0} value={categoriaId} onChange={e => setCategoriaId(Number(e.target.value))} className="prod-input" style={{ cursor: 'pointer' }}>
                    <option value="" disabled>Seleccione...</option>
                    {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                    </select>
                    </div>
                    <div>
                    <label className="prod-label">Tamaño</label>
                    <select required disabled={loading || tamanos.length === 0} value={tamanoId} onChange={e => setTamanoId(Number(e.target.value))} className="prod-input" style={{ cursor: 'pointer' }}>
                    <option value="" disabled>Seleccione...</option>
                    {tamanos.map(t => <option key={t.id_tamano} value={t.id_tamano}>{t.descripcion}</option>)}
                    </select>
                    </div>
                    </div>
                    </div>

                    {/* Precios y Costos */}
                    <div className="prod-section" style={{ background: 'rgba(6,214,160,0.05)', borderColor: 'rgba(6,214,160,0.2)' }}>
                    <div className="prod-section-title" style={{ color: '#06d6a0' }}><DollarSign size={14} /> Precios y Costos</div>
                    <div className="prod-grid2">
                    <div>
                    <label className="prod-label">Precio Unitario ($)</label>
                    <input type="number" step="0.01" required disabled={loading} value={precioUnitario} onChange={e => setPrecioUnitario(Number(e.target.value))} className="prod-input" />
                    </div>
                    <div>
                    <label className="prod-label">Costo de Producción ($)</label>
                    <input type="number" step="0.01" disabled={loading} value={costoProduccion} onChange={e => setCostoProduccion(Number(e.target.value))} placeholder="Opcional" className="prod-input" />
                    </div>
                    <div>
                    <label className="prod-label">Precio Mayoreo ($)</label>
                    <input type="number" step="0.01" disabled={loading} value={precioMayoreo} onChange={e => setPrecioMayoreo(Number(e.target.value))} placeholder="Opcional" className="prod-input" />
                    </div>
                    <div>
                    <label className="prod-label">Mínimo para Mayoreo</label>
                    <input type="number" required disabled={loading} value={cantidadMinima} onChange={e => setCantidadMinima(Number(e.target.value))} className="prod-input" />
                    </div>
                    </div>
                    </div>

                    </div>

                    <div className="prod-footer">
                    <motion.button type="submit" className="me-save-btn" disabled={loading} whileHover={!loading ? { scale:1.01 } : {}} whileTap={!loading ? { scale:0.97 } : {}}>
                    {loading ? <><span className="animate-spin inline-block"><RefreshCw size={16} /></span> Guardando...</> : <><Save size={16} /> {esEdicion ? 'Actualizar' : 'Guardar'} producto</>}
                    </motion.button>
                    {esEdicion && onDelete && (
                        <button type="button" className="me-delete-btn" onClick={() => setStep('confirm-delete')} disabled={loading}>
                        <Trash2 size={14} /> Eliminar este producto
                        </button>
                    )}
                    </div>
                    </motion.form>
                )}

                {/* CONFIRM DELETE, SUCCESS, ETC (Reciclando CSS de escuelas) */}
                {step === 'confirm-delete' && (
                    <motion.div key="confirm" className="me-confirm" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }} transition={{ type:'spring', stiffness:300, damping:22 }}>
                    <motion.div className="me-confirm-icon" initial={{ rotate:-15, scale:0.7 }} animate={{ rotate:0, scale:1 }} transition={{ type:'spring', stiffness:280, damping:16 }}>
                    <AlertTriangle size={28} />
                    </motion.div>
                    <p className="me-confirm-title">¿Eliminar producto?</p>
                    <p className="me-confirm-sub">Esta acción es permanente y no se puede deshacer.</p>
                    <div className="me-confirm-name">[{sku}] {nombre}</div>
                    <div className="me-confirm-btns">
                    <button className="me-btn-cancel" onClick={() => setStep('form')}>Cancelar</button>
                    <button className="me-btn-delete-confirm" onClick={handleDelete} disabled={loading}>
                    {loading ? <span className="animate-spin inline-block"><RefreshCw size={14} /></span> : 'Sí, eliminar'}
                    </button>
                    </div>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div key="success" className="me-success" initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ type:'spring', stiffness:260, damping:18 }}>
                    <motion.div className="me-success-icon green" initial={{ scale:0, rotate:-20 }} animate={{ scale:[0,1.25,1], rotate:[0,10,0] }} transition={{ type:'spring', stiffness:240, damping:14, delay:0.05 }}>
                    <Check size={36} />
                    </motion.div>
                    <p className="me-success-title">{esEdicion ? '¡Producto actualizado!' : '¡Producto registrado!'}</p>
                    <p className="me-success-sub">{nombre} se guardó correctamente.</p>
                    </motion.div>
                )}

                {step === 'success-delete' && (
                    <motion.div key="success-delete" className="me-success" initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ type:'spring', stiffness:260, damping:18 }}>
                    <motion.div className="me-success-icon red" initial={{ scale:0 }} animate={{ scale:[0,1.2,1] }} transition={{ type:'spring', stiffness:240, damping:14, delay:0.05 }}>
                    <Trash2 size={32} />
                    </motion.div>
                    <p className="me-success-title">Producto eliminado</p>
                    <p className="me-success-sub">El registro fue eliminado permanentemente.</p>
                    </motion.div>
                )}
                </AnimatePresence>
                </motion.div>
                </div>
            )}
            </AnimatePresence>
            </>
    );
}
