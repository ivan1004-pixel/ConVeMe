import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Save, CreditCard, User, Building, Search, ChevronDown, Check } from 'lucide-react';
import { getVendedores } from '../../services/vendedor.service';

interface ModalCuentaProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    cuentaAEditar?: any | null;
}

export default function ModalCuentaBancaria({ isOpen, onClose, onSave, cuentaAEditar }: ModalCuentaProps) {
    const dragControls = useDragControls();

    const [vendedorId, setVendedorId] = useState<number | ''>('');
    const [banco, setBanco] = useState('');
    const [titularCuenta, setTitularCuenta] = useState('');
    const [numeroCuenta, setNumeroCuenta] = useState('');
    const [clabe, setClabe] = useState('');

    const [vendedoresLista, setVendedoresLista] = useState<any[]>([]);
    const [showVendedorDrop, setShowVendedorDrop] = useState(false);
    const [searchVendedor, setSearchVendedor] = useState('');

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    // Calcula el progreso (0-3 secciones completadas)
    const progressStep = [
        vendedorId !== '',
        banco.trim() !== '' && titularCuenta.trim() !== '',
        numeroCuenta.trim() !== '',
    ];

    useEffect(() => {
        if (isOpen) {
            cargarVendedores();
            if (cuentaAEditar) {
                setVendedorId(cuentaAEditar.vendedor?.id_vendedor || '');
                setBanco(cuentaAEditar.banco || '');
                setTitularCuenta(cuentaAEditar.titular_cuenta || '');
                setNumeroCuenta(cuentaAEditar.numero_cuenta || '');
                setClabe(cuentaAEditar.clabe_interbancaria || '');
            }
        } else {
            limpiarFormulario();
        }
    }, [isOpen, cuentaAEditar]);

    const cargarVendedores = async () => {
        try {
            const data = await getVendedores();
            setVendedoresLista(data);
        } catch (error) {
            console.error('Error cargando vendedores:', error);
        }
    };

    const limpiarFormulario = () => {
        setVendedorId(''); setBanco(''); setTitularCuenta('');
        setNumeroCuenta(''); setClabe('');
        setShowVendedorDrop(false); setSearchVendedor('');
        setSaved(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendedorId) return alert('Por favor enlaza esta cuenta con un Vendedor.');
        if (clabe && !/^\d{18}$/.test(clabe)) return alert('La CLABE debe contener exactamente 18 dígitos numéricos.');
        if (!/^\d+$/.test(numeroCuenta)) return alert('El número de cuenta solo debe contener números.');

        setLoading(true);
        try {
            await onSave({
                vendedor_id: Number(vendedorId),
                         banco: banco.trim(),
                         titular_cuenta: titularCuenta.trim(),
                         numero_cuenta: numeroCuenta.trim(),
                         clabe_interbancaria: clabe.trim() || undefined,
            });
            setSaved(true);
            setTimeout(() => { onClose(); }, 900);
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Error al procesar la cuenta bancaria.');
        } finally {
            setLoading(false);
        }
    };

    const vendedoresFiltrados = vendedoresLista.filter(v =>
    v.nombre_completo.toLowerCase().includes(searchVendedor.toLowerCase()) ||
    String(v.id_vendedor).includes(searchVendedor)
    );
    const vendedorSeleccionado = vendedoresLista.find(v => v.id_vendedor === vendedorId);

    return (
        <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center py-6 px-4 overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {/* Backdrop */}
            <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: 'rgba(26,0,96,0.38)' }}
            onClick={onClose}
            />

            {/* Modal */}
            <motion.div
            drag dragControls={dragControls} dragListener={false} dragMomentum={false}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full flex flex-col"
            style={{
                maxWidth: 480,
                maxHeight: '92vh',
                background: '#fff',
                border: '3.5px solid #1a0060',
                borderRadius: 24,
                boxShadow: '7px 7px 0 #1a0060',
            }}
            >
            {/* ── HEADER ── */}
            <div
            className="flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing"
            style={{ background: '#ffe144', borderBottom: '3.5px solid #1a0060', borderRadius: '20px 20px 0 0', padding: '14px 18px', touchAction: 'none' }}
            onPointerDown={(e) => dragControls.start(e)}
            >
            <div className="flex items-center gap-3 pointer-events-none">
            {/* Icono */}
            <div style={{ background: '#fff', border: '2px solid #1a0060', borderRadius: 12, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={18} color="#1a0060" />
            </div>
            {/* Título */}
            <span style={{ fontWeight: 900, color: '#1a0060', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {cuentaAEditar ? 'Editar Cuenta' : 'Añadir Cuenta'}
            </span>
            {/* Badge */}
            <span style={{ background: '#1a0060', color: '#ffe144', fontSize: 9, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999 }}>
            {cuentaAEditar ? 'Editar' : 'Nuevo'}
            </span>
            </div>
            <button
            onClick={onClose}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ background: 'none', border: '2px solid transparent', borderRadius: 8, padding: 4, cursor: 'pointer', color: '#1a0060', display: 'flex' }}
            className="hover:bg-[#1a0060] hover:text-[#ffe144] transition-colors"
            >
            <X size={20} />
            </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* ── BARRA DE PROGRESO ── */}
            <div style={{ display: 'flex', gap: 5 }}>
            {progressStep.map((done, i) => (
                <motion.div
                key={i}
                animate={{ background: done ? '#06d6a0' : i === progressStep.filter(Boolean).length ? '#cc55ff' : 'rgba(26,0,96,0.12)' }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1, height: 5, borderRadius: 999 }}
                />
            ))}
            </div>

            {/* ── SECCIÓN 1: PROPIETARIO ── */}
            <div style={{ background: '#f7f5ff', border: '2px solid #e0d8ff', borderRadius: 18, padding: 16, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#cc55ff', flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#cc55ff' }}>
            Propietario de la cuenta
            </span>
            </div>

            <label style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a0060', marginBottom: 6 }}>
            Enlazar con Vendedor
            </label>

            {/* Selector */}
            <div
            onClick={() => { if (!loading) setShowVendedorDrop(!showVendedorDrop); }}
            style={{
                background: '#fff', border: '2px solid #1a0060', borderRadius: 12,
                padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1a0060',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                opacity: loading ? 0.5 : 1,
                transition: 'box-shadow 0.15s',
            }}
            className="hover:shadow-[3px_3px_0px_#cc55ff]"
            >
            <span style={{ color: vendedorSeleccionado ? '#1a0060' : 'rgba(26,0,96,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {vendedorSeleccionado
                ? `ID: ${vendedorSeleccionado.id_vendedor} — ${vendedorSeleccionado.nombre_completo}`
                : 'Seleccione vendedor...'}
                </span>
                <motion.div animate={{ rotate: showVendedorDrop ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={15} style={{ flexShrink: 0 }} />
                </motion.div>
                </div>

                {/* Dropdown */}
                <AnimatePresence>
                {showVendedorDrop && (
                    <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    style={{
                        position: 'absolute', zIndex: 50, top: 'calc(100% - 10px)',
                                      left: 16, right: 16,
                                      background: '#fff', border: '2px solid #1a0060',
                                      borderRadius: 14, boxShadow: '5px 5px 0 #1a0060', overflow: 'hidden',
                    }}
                    >
                    {/* Buscador */}
                    <div style={{ background: '#f3e8ff', borderBottom: '2px solid #1a0060', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Search size={14} color="rgba(26,0,96,0.5)" style={{ flexShrink: 0 }} />
                    <input
                    autoFocus
                    type="text"
                    placeholder="Buscar por nombre o ID..."
                    value={searchVendedor}
                    onChange={(e) => setSearchVendedor(e.target.value)}
                    style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#1a0060', width: '100%' }}
                    />
                    </div>
                    {/* Lista */}
                    <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                    {vendedoresFiltrados.length > 0 ? vendedoresFiltrados.map(v => (
                        <div
                        key={v.id_vendedor}
                        onClick={() => { setVendedorId(v.id_vendedor); setShowVendedorDrop(false); setSearchVendedor(''); }}
                        style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, color: '#1a0060', cursor: 'pointer', borderBottom: '1px solid rgba(26,0,96,0.08)' }}
                        className="hover:bg-[#ffe144] transition-colors"
                        >
                        <span style={{ fontSize: 10, fontWeight: 900, color: '#cc55ff', marginRight: 4 }}>ID:{v.id_vendedor}</span>
                        {v.nombre_completo}
                        </div>
                    )) : (
                        <div style={{ padding: 16, textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'rgba(26,0,96,0.4)' }}>
                        Sin resultados
                        </div>
                    )}
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>
                </div>

                {/* ── SECCIÓN 2: DATOS BANCARIOS ── */}
                <div style={{ background: '#f0fdf8', border: '2px solid #c0f0e4', borderRadius: 18, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#06d6a0', flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#06d6a0' }}>
                Datos Bancarios
                </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Banco */}
                <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a0060', marginBottom: 6 }}>Banco</label>
                <input
                type="text" required disabled={loading}
                value={banco} onChange={(e) => setBanco(e.target.value)}
                placeholder="Ej. BBVA, Santander, Nu..."
                style={{ width: '100%', background: '#fff', border: '2px solid #1a0060', borderRadius: 12, padding: '10px 12px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#1a0060', outline: 'none', boxSizing: 'border-box', transition: 'box-shadow 0.15s' }}
                className="focus:shadow-[4px_4px_0px_#06d6a0]"
                />
                {banco && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#06d6a0' }} />
                    <span style={{ fontSize: 10, color: 'rgba(26,0,96,0.55)', fontWeight: 600 }}>Banco registrado</span>
                    </motion.div>
                )}
                </div>

                {/* Titular */}
                <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a0060', marginBottom: 6 }}>Titular de la cuenta</label>
                <div style={{ position: 'relative' }}>
                <input
                type="text" required disabled={loading}
                value={titularCuenta} onChange={(e) => setTitularCuenta(e.target.value)}
                placeholder="Nombre exacto en la tarjeta"
                style={{ width: '100%', background: '#fff', border: '2px solid #1a0060', borderRadius: 12, padding: '10px 40px 10px 12px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#1a0060', outline: 'none', boxSizing: 'border-box', transition: 'box-shadow 0.15s' }}
                className="focus:shadow-[4px_4px_0px_#06d6a0]"
                />
                <AnimatePresence>
                {titularCuenta && (
                    <motion.div
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: '#06d6a0', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                    <Check size={11} color="#fff" strokeWidth={3} />
                    </motion.div>
                )}
                </AnimatePresence>
                </div>
                </div>

                {/* Número de cuenta + CLABE en grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a0060', marginBottom: 6 }}>N° de Cuenta</label>
                <input
                type="text" required disabled={loading}
                value={numeroCuenta} onChange={(e) => setNumeroCuenta(e.target.value.replace(/\D/g, ''))}
                maxLength={20} placeholder="Solo números"
                style={{ width: '100%', background: '#fff', border: '2px solid #1a0060', borderRadius: 12, padding: '10px 12px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#1a0060', outline: 'none', boxSizing: 'border-box', transition: 'box-shadow 0.15s' }}
                className="focus:shadow-[4px_4px_0px_#06d6a0]"
                />
                </div>
                <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a0060', marginBottom: 6 }}>
                CLABE
                <span style={{ background: '#ffe144', color: '#1a0060', border: '1.5px solid #1a0060', borderRadius: 999, fontSize: 8, fontWeight: 900, padding: '1px 6px', letterSpacing: '0.05em' }}>Opcional</span>
                </label>
                <input
                type="text" disabled={loading}
                value={clabe} onChange={(e) => setClabe(e.target.value.replace(/\D/g, ''))}
                maxLength={18} placeholder="18 dígitos"
                style={{ width: '100%', background: '#fff', border: '2px solid #1a0060', borderRadius: 12, padding: '10px 12px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#1a0060', outline: 'none', boxSizing: 'border-box', transition: 'box-shadow 0.15s' }}
                className="focus:shadow-[4px_4px_0px_#06d6a0]"
                />
                </div>
                </div>

                {/* Hint CLABE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#06d6a0', flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: 'rgba(26,0,96,0.55)', fontWeight: 600 }}>La CLABE debe contener exactamente 18 dígitos</span>
                </div>

                </div>
                </div>

                </div>

                {/* ── FOOTER ── */}
                <div style={{ padding: '14px 20px', borderTop: '3.5px solid #1a0060', background: '#fff', borderRadius: '0 0 20px 20px', flexShrink: 0 }}>
                <motion.button
                type="submit" disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!loading ? { scale: 0.98, y: 2 } : {}}
                animate={{ background: saved ? '#06d6a0' : '#1a0060', color: saved ? '#1a0060' : '#06d6a0' }}
                transition={{ duration: 0.25 }}
                style={{
                    width: '100%', fontFamily: 'inherit', fontSize: 13, fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '0.12em',
                    border: '3px solid #1a0060', borderRadius: 14, padding: 14,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '4px 4px 0 rgba(0,0,0,0.22)',
                    opacity: loading && !saved ? 0.75 : 1,
                }}
                >
                {saved
                    ? <><Check size={18} strokeWidth={3} /> ¡Cuenta Guardada!</>
                    : loading
                    ? 'Guardando...'
        : <><Save size={17} /> {cuentaAEditar ? 'Actualizar' : 'Guardar'} Cuenta</>
                }
                </motion.button>
                </div>

                </form>
                </motion.div>
                </div>
        )}
        </AnimatePresence>
    );
}
