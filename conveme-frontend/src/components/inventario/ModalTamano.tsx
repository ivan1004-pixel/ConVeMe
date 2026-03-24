import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Save, Ruler, Trash2, AlertTriangle, RefreshCw, Check } from 'lucide-react';

interface ModalTamanoProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { descripcion: string }) => Promise<void>;
    onDelete?: () => Promise<void>;
    tamanoAEditar?: any | null;
}

type ModalStep = 'form' | 'confirm-delete' | 'success' | 'success-delete';

export default function ModalTamano({ isOpen, onClose, onSave, onDelete, tamanoAEditar }: ModalTamanoProps) {
    const dragControls = useDragControls();
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<ModalStep>('form');

    const esEdicion = Boolean(tamanoAEditar);

    useEffect(() => {
        if (isOpen) {
            setStep('form');
            if (tamanoAEditar) {
                setDescripcion(String(tamanoAEditar.descripcion || ''));
            } else {
                setDescripcion('');
            }
        } else {
            setDescripcion('');
        }
    }, [isOpen, tamanoAEditar]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ descripcion: String(descripcion).trim() });
            setStep('success');
            setTimeout(() => { onClose(); setStep('form'); }, 2200);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        setLoading(true);
        try {
            await onDelete();
            setStep('success-delete');
            setTimeout(() => { onClose(); setStep('form'); }, 2000);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <>
        <style>{`
            /* Se usan las mismas clases de la escuela, pero ajustando colores al VERDE (#06d6a0) */
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
            .tam-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: 'DM Sans', sans-serif; }
            .tam-backdrop { position: absolute; inset: 0; background: rgba(26,0,96,0.45); backdrop-filter: blur(6px); }
            .tam-modal { position: relative; background: #fff; border: 3px solid #1a0060; border-radius: 28px; width: 100%; max-width: 480px; box-shadow: 8px 8px 0px #1a0060; overflow: visible; z-index: 2; }
            .tam-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 2.5px solid rgba(26,0,96,0.1); background: rgba(6,214,160,0.6); border-radius: 25px 25px 0 0; }
            .tam-header.delete { background: rgba(255,80,80,0.1); }
            .tam-header-left { display: flex; align-items: center; gap: 12px; }
            .tam-header-icon { width: 42px; height: 42px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            .tam-header-title { font-family: 'Syne', sans-serif; font-weight: 900; font-size: 16px; color: #1a0060; text-transform: uppercase; letter-spacing: .05em; line-height: 1.1; }
            .tam-header-sub { font-size: 11px; font-weight: 500; color: rgba(26,0,96,0.45); display: block; margin-top: 2px; }
            .tam-close-btn { width: 36px; height: 36px; border-radius: 10px; border: 2px solid rgba(26,0,96,0.15); background: rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(26,0,96,0.5); transition: background .18s, color .18s, border-color .18s; flex-shrink: 0; }
            .tam-close-btn:hover { background: #ff5050; color: #fff; border-color: #ff5050; }
            .tam-body { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
            .tam-label { display: flex; align-items: center; gap: 5px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: #1a0060; margin-bottom: 7px; }
            .tam-label svg { color: #06d6a0; }
            .tam-input { width: 100%; background: #faf5ff; border: 2.5px solid #d4b8f0; border-radius: 12px; padding: 12px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: #1a0060; outline: none; transition: border-color .18s, box-shadow .18s; }
            .tam-input::placeholder { color: #b9a0d4; font-weight: 400; }
            .tam-input:focus { border-color: #06d6a0; box-shadow: 0 0 0 3px rgba(6,214,160,0.15), 3px 3px 0px #1a0060; background: #fff; }
            .tam-input:disabled { opacity: .6; cursor: not-allowed; }

            /* Botones, confirm y success reutilizan la misma lógica que las escuelas */
            .me-save-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; background: #1a0060; color: #ffe144; font-family: 'Syne', sans-serif; font-weight: 900; font-size: 14px; letter-spacing: .1em; text-transform: uppercase; border: 2.5px solid #1a0060; border-radius: 14px; padding: 15px; cursor: pointer; box-shadow: 4px 4px 0px rgba(0,0,0,0.3); transition: transform .12s, box-shadow .12s; }
            .me-save-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px rgba(0,0,0,0.3); }
            .me-delete-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: none; color: rgba(255,80,80,0.8); font-family: 'Syne', sans-serif; font-weight: 800; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; border: 2px solid rgba(255,80,80,0.25); border-radius: 12px; padding: 10px; cursor: pointer; transition: background .18s, color .18s, border-color .18s; }
            .me-delete-btn:hover { background: rgba(255,80,80,0.08); color: #ff5050; border-color: rgba(255,80,80,0.45); }

            .me-confirm { padding: 32px 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
            .me-confirm-icon { width: 64px; height: 64px; border-radius: 20px; background: rgba(255,80,80,0.1); border: 2px solid rgba(255,80,80,0.25); display: flex; align-items: center; justify-content: center; color: #ff5050; }
            .me-confirm-title { font-family: 'Syne', sans-serif; font-weight: 900; font-size: 18px; color: #1a0060; }
            .me-confirm-sub { font-size: 13px; font-weight: 500; color: rgba(26,0,96,0.55); max-width: 280px; line-height: 1.5; }
            .me-confirm-name { background: rgba(255,80,80,0.08); border: 1.5px solid rgba(255,80,80,0.2); border-radius: 10px; padding: 8px 16px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px; color: #ff5050; }
            .me-confirm-btns { display: flex; gap: 10px; width: 100%; margin-top: 4px; }
            .me-btn-cancel { flex: 1; background: none; border: 2.5px solid rgba(26,0,96,0.18); border-radius: 12px; padding: 12px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 12px; text-transform: uppercase; color: rgba(26,0,96,0.5); cursor: pointer; transition: background .18s, color .18s; }
            .me-btn-cancel:hover { background: rgba(26,0,96,0.05); color: #1a0060; }
            .me-btn-delete-confirm { flex: 1; background: #ff5050; border: 2.5px solid #1a0060; border-radius: 12px; padding: 12px; font-family: 'Syne', sans-serif; font-weight: 900; font-size: 12px; text-transform: uppercase; color: #fff; cursor: pointer; box-shadow: 3px 3px 0px #1a0060; transition: transform .12s, box-shadow .12s; }
            .me-btn-delete-confirm:hover { transform: translate(-1px,-1px); box-shadow: 5px 5px 0px #1a0060; }

            .me-success { padding: 48px 24px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
            .me-success-icon { width: 80px; height: 80px; border-radius: 24px; display: flex; align-items: center; justify-content: center; }
            .me-success-icon.green { background: rgba(6,214,160,0.12); border: 2px solid rgba(6,214,160,0.25); color: #06d6a0; }
            .me-success-icon.red { background: rgba(255,80,80,0.1); border: 2px solid rgba(255,80,80,0.2); color: #ff5050; }
            .me-success-title { font-family: 'Syne', sans-serif; font-weight: 900; font-size: 20px; color: #1a0060; }
            .me-success-sub { font-size: 13px; font-weight: 500; color: rgba(26,0,96,0.5); }
            `}</style>

            <AnimatePresence>
            {isOpen && (
                <div className="tam-overlay">
                <motion.div className="tam-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => step === 'form' ? onClose() : undefined} />

                <motion.div className="tam-modal" initial={{ opacity: 0, scale: 0.88, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.88, y: 24 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
                <div className={`tam-header ${step === 'confirm-delete' ? 'delete' : ''}`} onPointerDown={(e) => dragControls.start(e)} style={{ touchAction: 'none' }}>
                <div className="tam-header-left">
                <div className="tam-header-icon" style={{
                    background: step === 'confirm-delete' ? 'rgba(255,80,80,0.1)' : 'rgba(6,214,160,0.12)',
                        border: `1.5px solid ${step === 'confirm-delete' ? 'rgba(255,80,80,0.25)' : 'rgba(6,214,160,0.3)'}`,
                        color: step === 'confirm-delete' ? '#ff5050' : '#1a0060',
                }}>
                {step === 'confirm-delete' ? <Trash2 size={20} /> : <Ruler size={20} />}
                </div>
                <div>
                <p className="tam-header-title">
                {step === 'confirm-delete' ? 'Eliminar tamaño' : step.startsWith('success') ? '¡Listo!' : esEdicion ? 'Editar tamaño' : 'Nuevo tamaño'}
                </p>
                <span className="tam-header-sub">
                {step === 'confirm-delete' ? 'Esta acción no se puede deshacer' : step.startsWith('success') ? 'Operación completada' : esEdicion ? 'Modifica los datos del tamaño' : 'Registra una nueva dimensión'}
                </span>
                </div>
                </div>
                <button className="tam-close-btn" onClick={onClose} type="button"><X size={16} /></button>
                </div>

                <AnimatePresence mode="wait">
                {step === 'form' && (
                    <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                    <div className="tam-body">
                    <div>
                    <label className="tam-label"><Ruler size={13} style={{color:'#06d6a0'}}/> Descripción del Tamaño</label>
                    <input type="text" className="tam-input" placeholder="Ej. Chico, Mediano, Grande, 5cm..." value={descripcion} onChange={e => setDescripcion(e.target.value)} required disabled={loading} />
                    </div>

                    <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:4 }}>
                    <motion.button type="submit" className="me-save-btn" disabled={loading} whileHover={!loading ? { scale:1.01 } : {}} whileTap={!loading ? { scale:0.97 } : {}}>
                    {loading ? <><span className="animate-spin inline-block"><RefreshCw size={16} /></span> Guardando...</> : <><Save size={16} /> {esEdicion ? 'Actualizar' : 'Guardar'} tamaño</>}
                    </motion.button>
                    {esEdicion && onDelete && (
                        <button type="button" className="me-delete-btn" onClick={() => setStep('confirm-delete')} disabled={loading}>
                        <Trash2 size={14} /> Eliminar este tamaño
                        </button>
                    )}
                    </div>
                    </div>
                    </motion.form>
                )}

                {step === 'confirm-delete' && (
                    <motion.div key="confirm" className="me-confirm" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }} transition={{ type:'spring', stiffness:300, damping:22 }}>
                    <motion.div className="me-confirm-icon" initial={{ rotate:-15, scale:0.7 }} animate={{ rotate:0, scale:1 }} transition={{ type:'spring', stiffness:280, damping:16 }}>
                    <AlertTriangle size={28} />
                    </motion.div>
                    <p className="me-confirm-title">¿Eliminar tamaño?</p>
                    <p className="me-confirm-sub">Esta acción es permanente y no se puede deshacer.</p>
                    <div className="me-confirm-name">{descripcion}</div>
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
                    <p className="me-success-title">{esEdicion ? '¡Tamaño actualizado!' : '¡Tamaño registrado!'}</p>
                    <p className="me-success-sub">{descripcion} se guardó correctamente.</p>
                    </motion.div>
                )}

                {step === 'success-delete' && (
                    <motion.div key="success-delete" className="me-success" initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ type:'spring', stiffness:260, damping:18 }}>
                    <motion.div className="me-success-icon red" initial={{ scale:0 }} animate={{ scale:[0,1.2,1] }} transition={{ type:'spring', stiffness:240, damping:14, delay:0.05 }}>
                    <Trash2 size={32} />
                    </motion.div>
                    <p className="me-success-title">Tamaño eliminado</p>
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
