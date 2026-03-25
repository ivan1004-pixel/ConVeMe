import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
    X, Receipt, Trash2, Search, Loader2,
    TrendingUp, ShoppingBag, CreditCard, Banknote,
    GripHorizontal, AlertTriangle, RefreshCw, Check,
    ChevronDown, Filter
} from 'lucide-react';
import { getVentas, deleteVenta } from '../../services/venta.service';

interface ModalHistorialProps {
    isOpen:  boolean;
    onClose: () => void;
}

type DeleteStep = 'idle' | 'confirming' | 'deleting' | 'done';

/* ── payment method label + style ── */
const METODO_STYLES: Record<string, { bg: string; color: string; icon: JSX.Element; label: string }> = {
    efectivo:    { bg: 'rgba(6,214,160,0.12)',  color: '#05b589', icon: <Banknote   size={11} />, label: 'Efectivo'    },
    tarjeta:     { bg: 'rgba(204,85,255,0.12)', color: '#9b30cc', icon: <CreditCard size={11} />, label: 'Tarjeta'     },
    transferencia:{ bg: 'rgba(3,1,255,0.1)',    color: '#0301ff', icon: <TrendingUp size={11} />, label: 'Transferencia'},
};
const metodoStyle = (m: string) =>
METODO_STYLES[m?.toLowerCase()] ?? { bg: 'rgba(26,0,96,0.07)', color: '#1a0060', icon: <Receipt size={11} />, label: m ?? '—' };

export default function ModalHistorialVentas({ isOpen, onClose }: ModalHistorialProps) {
    const dragControls = useDragControls();

    const [ventas,     setVentas]     = useState<any[]>([]);
    const [loading,    setLoading]    = useState(false);
    const [search,     setSearch]     = useState('');
    const [filterMetodo, setFilterMetodo] = useState('todos');
    const [showFilter,   setShowFilter]   = useState(false);

    /* delete flow */
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [deleteStep,   setDeleteStep]   = useState<DeleteStep>('idle');

    useEffect(() => {
        if (isOpen) { cargarVentas(); setSearch(''); setFilterMetodo('todos'); }
    }, [isOpen]);

    const cargarVentas = async () => {
        setLoading(true);
        try {
            const data = await getVentas();
            setVentas(data.sort((a: any, b: any) => b.id_venta - a.id_venta));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleDeleteClick = (venta: any) => {
        setDeleteTarget(venta);
        setDeleteStep('confirming');
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleteStep('deleting');
        try {
            await deleteVenta(deleteTarget.id_venta);
            await cargarVentas();
            setDeleteStep('done');
            setTimeout(() => { setDeleteStep('idle'); setDeleteTarget(null); }, 2000);
        } catch (e) { console.error(e); setDeleteStep('idle'); }
    };

    const formatFecha = (s: string) => {
        if (!s) return '—';
        return new Date(s).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    /* ── Stats ── */
    const stats = useMemo(() => {
        const total   = ventas.reduce((s, v) => s + Number(v.monto_total || 0), 0);
        const byMetodo: Record<string, number> = {};
        ventas.forEach(v => { const m = (v.metodo_pago || 'otro').toLowerCase(); byMetodo[m] = (byMetodo[m] || 0) + 1; });
        return { total, count: ventas.length, byMetodo };
    }, [ventas]);

    /* ── Filtered ventas ── */
    const metodos = useMemo(() => ['todos', ...Array.from(new Set(ventas.map(v => (v.metodo_pago || '').toLowerCase())))], [ventas]);

    const ventasFiltradas = useMemo(() =>
    ventas.filter(v => {
        const matchSearch  = String(v.id_venta).includes(search) || (v.vendedor?.nombre_completo || '').toLowerCase().includes(search.toLowerCase());
        const matchMetodo  = filterMetodo === 'todos' || (v.metodo_pago || '').toLowerCase() === filterMetodo;
        return matchSearch && matchMetodo;
    }),
    [ventas, search, filterMetodo]
    );

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

            .mhv-overlay {
                position: fixed; inset: 0; z-index: 50;
                display: flex; align-items: flex-start; justify-content: center;
                padding: 10px 12px;
                font-family: 'DM Sans', sans-serif;
                overflow-y: auto;
            }
            .mhv-backdrop {
                position: fixed; inset: 0;
                background: rgba(26,0,96,0.45);
                backdrop-filter: blur(6px);
            }
            .mhv-modal {
                position: relative; z-index: 2;
                background: #fff;
                border: 3px solid #1a0060;
                border-radius: 22px;
                width: 100%; max-width: 760px;
                box-shadow: 6px 6px 0px #1a0060;
                display: flex; flex-direction: column;
                max-height: calc(100dvh - 20px);
                margin: 0 auto;
            }

            /* ── Drag handle ── */
            .mhv-drag {
                display: flex; align-items: center; justify-content: space-between;
                padding: 12px 18px;
                border-bottom: 2px solid rgba(26,0,96,0.1);
                background: rgba(237,233,254,0.6);
                border-radius: 19px 19px 0 0;
                cursor: grab; flex-shrink: 0;
                user-select: none;
            }
            .mhv-drag:active { cursor: grabbing; }
            .mhv-drag-left   { display: flex; align-items: center; gap: 10px; pointer-events: none; }
            .mhv-drag-icon   {
                width: 36px; height: 36px; border-radius: 11px;
                display: flex; align-items: center; justify-content: center;
                flex-shrink: 0;
                background: rgba(204,85,255,0.12);
                border: 1.5px solid rgba(204,85,255,0.2);
                color: #cc55ff;
            }
            .mhv-drag-title  { font-family: 'Syne', sans-serif; font-weight: 900; font-size: 14px; color: #1a0060; text-transform: uppercase; letter-spacing: .05em; line-height: 1.1; }
            .mhv-drag-sub    { font-size: 10px; font-weight: 500; color: rgba(26,0,96,0.45); display: block; margin-top: 1px; }
            .mhv-drag-right  { display: flex; align-items: center; gap: 6px; }
            .mhv-close-btn {
                width: 32px; height: 32px; border-radius: 9px;
                border: 2px solid rgba(26,0,96,0.15); background: rgba(255,255,255,0.8);
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; color: rgba(26,0,96,0.5); pointer-events: auto;
                transition: background .18s, color .18s, border-color .18s;
            }
            .mhv-close-btn:hover { background: #ff5050; color: #fff; border-color: #ff5050; }

            /* ── Stats strip ── */
            .mhv-stats {
                display: flex; gap: 0;
                border-bottom: 2px solid rgba(26,0,96,0.08);
                flex-shrink: 0;
                overflow-x: auto;
                scrollbar-width: none;
            }
            .mhv-stats::-webkit-scrollbar { display: none; }
            .mhv-stat {
                flex: 1; min-width: 120px;
                display: flex; flex-direction: column;
                padding: 12px 18px;
                border-right: 1.5px solid rgba(26,0,96,0.07);
            }
            .mhv-stat:last-child { border-right: none; }
            .mhv-stat-label {
                font-family: 'Syne', sans-serif; font-weight: 700;
                font-size: 9px; letter-spacing: .12em; text-transform: uppercase;
                color: rgba(26,0,96,0.38); margin-bottom: 4px;
                display: flex; align-items: center; gap: 5px;
            }
            .mhv-stat-value {
                font-family: 'Syne', sans-serif; font-weight: 900;
                font-size: 20px; color: #1a0060; line-height: 1;
            }
            .mhv-stat-value.green  { color: #06d6a0; }
            .mhv-stat-value.purple { color: #cc55ff; }

            /* ── Toolbar ── */
            .mhv-toolbar {
                display: flex; align-items: center; gap: 10px;
                padding: 12px 16px;
                border-bottom: 2px solid rgba(26,0,96,0.07);
                background: rgba(237,233,254,0.25);
                flex-shrink: 0; flex-wrap: wrap;
            }
            .mhv-search-wrap {
                flex: 1; min-width: 180px;
                display: flex; align-items: center; gap: 8px;
                background: #fff;
                border: 2px solid #d4b8f0;
                border-radius: 10px; padding: 7px 12px;
                transition: border-color .18s, box-shadow .18s;
            }
            .mhv-search-wrap:focus-within {
                border-color: #cc55ff;
                box-shadow: 0 0 0 3px rgba(204,85,255,0.12);
            }
            .mhv-search-wrap svg { color: rgba(26,0,96,0.3); flex-shrink: 0; }
            .mhv-search-input {
                flex: 1; border: none; outline: none; background: transparent;
                font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #1a0060;
            }
            .mhv-search-input::placeholder { color: rgba(26,0,96,0.3); }

            /* filter dropdown */
            .mhv-filter-wrap { position: relative; }
            .mhv-filter-btn {
                display: flex; align-items: center; gap: 7px;
                background: #fff; border: 2px solid #d4b8f0; border-radius: 10px;
                padding: 7px 14px; cursor: pointer; font-family: 'Syne', sans-serif;
                font-weight: 700; font-size: 11px; letter-spacing: .06em; text-transform: uppercase;
                color: rgba(26,0,96,0.6);
                transition: border-color .18s, box-shadow .18s;
                white-space: nowrap;
            }
            .mhv-filter-btn:hover, .mhv-filter-btn.open {
                border-color: #cc55ff;
                box-shadow: 0 0 0 3px rgba(204,85,255,0.1);
                color: #1a0060;
            }
            .mhv-filter-dropdown {
                position: absolute; top: calc(100% + 6px); right: 0;
                min-width: 180px; background: #fff;
                border: 2.5px solid #1a0060; border-radius: 14px;
                box-shadow: 5px 5px 0px #1a0060; overflow: hidden; z-index: 10;
            }
            .mhv-filter-item {
                display: flex; align-items: center; gap: 8px;
                padding: 10px 14px; cursor: pointer;
                font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
                color: rgba(26,0,96,0.75); border-bottom: 1px solid rgba(26,0,96,0.05);
                transition: background .13s;
            }
            .mhv-filter-item:last-child { border-bottom: none; }
            .mhv-filter-item:hover { background: rgba(204,85,255,0.07); }
            .mhv-filter-item.active { background: #ffe144; font-weight: 700; color: #1a0060; }

            /* count badge */
            .mhv-count {
                background: rgba(204,85,255,0.1); border: 1.5px solid rgba(204,85,255,0.2);
                border-radius: 8px; padding: 3px 10px;
                font-family: 'Syne', sans-serif; font-weight: 800; font-size: 11px; color: #cc55ff;
                white-space: nowrap;
            }

            /* ── List body ── */
            .mhv-body {
                flex: 1; overflow-y: auto; padding: 14px 16px;
                display: flex; flex-direction: column; gap: 10px;
                scrollbar-width: thin; scrollbar-color: rgba(204,85,255,0.3) transparent;
                background: rgba(237,233,254,0.2);
            }
            .mhv-body::-webkit-scrollbar       { width: 4px; }
            .mhv-body::-webkit-scrollbar-thumb { background: rgba(204,85,255,0.3); border-radius: 4px; }

            /* ── Ticket card ── */
            .mhv-ticket {
                background: #fff;
                border: 2px solid rgba(26,0,96,0.1);
                border-radius: 16px;
                overflow: hidden;
                transition: border-color .18s, box-shadow .18s;
            }
            .mhv-ticket:hover {
                border-color: rgba(204,85,255,0.3);
                box-shadow: 3px 3px 0px rgba(204,85,255,0.2);
            }
            .mhv-ticket-header {
                display: flex; align-items: center; justify-content: space-between;
                padding: 12px 16px; gap: 12px; flex-wrap: wrap;
                border-bottom: 1.5px solid rgba(26,0,96,0.06);
            }
            .mhv-ticket-id {
                font-family: 'Syne', sans-serif; font-weight: 900; font-size: 16px; color: #1a0060;
                display: flex; align-items: center; gap: 8px;
            }
            .mhv-ticket-id-num {
                font-size: 11px; font-weight: 700; color: rgba(26,0,96,0.35);
                font-family: 'DM Sans', sans-serif;
            }
            .mhv-metodo-chip {
                display: inline-flex; align-items: center; gap: 5px;
                border-radius: 8px; padding: 3px 10px;
                font-family: 'Syne', sans-serif; font-weight: 700;
                font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase;
            }
            .mhv-ticket-meta {
                font-size: 11.5px; font-weight: 500; color: rgba(26,0,96,0.45);
                display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
            }
            .mhv-ticket-meta .vendedor { color: #cc55ff; font-weight: 600; }
            .mhv-ticket-meta .dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(26,0,96,0.25); flex-shrink: 0; }

            .mhv-ticket-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
            .mhv-total-label { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: rgba(26,0,96,0.38); display: block; text-align: right; }
            .mhv-total-value { font-family: 'Syne', sans-serif; font-weight: 900; font-size: 22px; color: #06d6a0; line-height: 1; }

            /* delete btn */
            .mhv-del-btn {
                width: 34px; height: 34px; border-radius: 9px;
                border: 1.5px solid rgba(255,80,80,0.2);
                background: rgba(255,80,80,0.06);
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; color: rgba(255,80,80,0.7);
                transition: background .15s, color .15s, border-color .15s, transform .12s;
                flex-shrink: 0;
            }
            .mhv-del-btn:hover {
                background: #ff5050; color: #fff; border-color: #ff5050;
                transform: scale(1.08);
            }

            /* Products list */
            .mhv-products {
                padding: 10px 16px 12px;
                display: flex; flex-direction: column; gap: 4px;
            }
            .mhv-product-row {
                display: flex; align-items: center; justify-content: space-between;
                padding: 5px 10px;
                border-radius: 8px;
                background: rgba(237,233,254,0.35);
                font-size: 12.5px;
            }
            .mhv-product-row:nth-child(odd)  { background: rgba(237,233,254,0.35); }
            .mhv-product-row:nth-child(even) { background: rgba(255,255,255,0.6); }
            .mhv-product-name { font-weight: 500; color: rgba(26,0,96,0.75); }
            .mhv-product-qty  { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 10px; color: #cc55ff; background: rgba(204,85,255,0.1); border-radius: 5px; padding: 2px 7px; }
            .mhv-product-price{ font-family: 'Syne', sans-serif; font-weight: 800; font-size: 12px; color: #1a0060; }

            /* ── Empty / loading ── */
            .mhv-empty {
                display: flex; flex-direction: column; align-items: center;
                justify-content: center; padding: 60px 24px; gap: 12px; text-align: center;
            }
            .mhv-empty-icon {
                width: 64px; height: 64px; border-radius: 20px;
                background: rgba(204,85,255,0.07); border: 2px solid rgba(204,85,255,0.12);
                display: flex; align-items: center; justify-content: center; color: rgba(204,85,255,0.5);
                margin-bottom: 4px;
            }
            .mhv-empty-title { font-family: 'Syne', sans-serif; font-weight: 900; font-size: 16px; color: #1a0060; }
            .mhv-empty-sub   { font-size: 13px; font-weight: 500; color: rgba(26,0,96,0.42); max-width: 260px; line-height: 1.5; }

            @keyframes mhv-spin { to { transform: rotate(360deg); } }
            .mhv-spinner { animation: mhv-spin 1s linear infinite; }

            /* ── Confirm / Success overlay inside modal ── */
            .mhv-overlay-screen {
                position: absolute; inset: 0;
                background: rgba(237,233,254,0.97);
                border-radius: 19px;
                display: flex; flex-direction: column; align-items: center;
                justify-content: center; gap: 14px; text-align: center;
                padding: 40px 24px;
                z-index: 10;
            }
            .mhv-screen-icon {
                width: 72px; height: 72px; border-radius: 22px;
                display: flex; align-items: center; justify-content: center;
            }
            .mhv-screen-title { font-family: 'Syne', sans-serif; font-weight: 900; font-size: 20px; color: #1a0060; }
            .mhv-screen-sub   { font-size: 13px; font-weight: 500; color: rgba(26,0,96,0.5); max-width: 280px; line-height: 1.55; }
            .mhv-name-chip    { border-radius: 10px; padding: 7px 16px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px; }
            .mhv-confirm-btns { display: flex; gap: 10px; width: 100%; max-width: 320px; margin-top: 4px; }
            .mhv-btn-cancel {
                flex: 1; background: none; border: 2.5px solid rgba(26,0,96,0.18);
                border-radius: 12px; padding: 12px;
                font-family: 'Syne', sans-serif; font-weight: 800; font-size: 12px;
                text-transform: uppercase; color: rgba(26,0,96,0.5); cursor: pointer;
                transition: background .18s, color .18s;
            }
            .mhv-btn-cancel:hover { background: rgba(26,0,96,0.05); color: #1a0060; }
            .mhv-btn-delete-confirm {
                flex: 1; background: #ff5050; border: 2.5px solid #1a0060;
                border-radius: 12px; padding: 12px;
                font-family: 'Syne', sans-serif; font-weight: 900; font-size: 12px;
                text-transform: uppercase; color: #fff; cursor: pointer;
                box-shadow: 3px 3px 0px #1a0060;
                transition: transform .12s, box-shadow .12s;
                display: flex; align-items: center; justify-content: center; gap: 6px;
            }
            .mhv-btn-delete-confirm:hover    { transform: translate(-1px,-1px); box-shadow: 5px 5px 0px #1a0060; }
            .mhv-btn-delete-confirm:disabled { opacity: .7; cursor: not-allowed; }
            `}</style>

            <AnimatePresence>
            {isOpen && (
                <div className="mhv-overlay">
                <motion.div
                className="mhv-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                />

                <motion.div
                className="mhv-modal"
                drag dragControls={dragControls} dragListener={false} dragMomentum={false}
                initial={{ opacity: 0, scale: 0.88, y: 24 }}
                animate={{ opacity: 1, scale: 1,    y: 0  }}
                exit={{   opacity: 0, scale: 0.88,  y: 24 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                >
                {/* ── Confirm / Success screen (overlay inside modal) ── */}
                <AnimatePresence>
                {(deleteStep === 'confirming' || deleteStep === 'deleting' || deleteStep === 'done') && (
                    <motion.div
                    className="mhv-overlay-screen"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1   }}
                    exit={{ opacity: 0,   scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    >
                    {deleteStep !== 'done' ? (
                        <>
                        <motion.div
                        className="mhv-screen-icon"
                        style={{ background: 'rgba(255,80,80,0.1)', border: '2px solid rgba(255,80,80,0.25)', color: '#ff5050' }}
                        initial={{ rotate: -15, scale: 0.7 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                        >
                        <AlertTriangle size={30} />
                        </motion.div>
                        <p className="mhv-screen-title">¿Eliminar este ticket?</p>
                        <p className="mhv-screen-sub">Esta acción es permanente. Se borrará el ticket y todos sus detalles de productos.</p>
                        {deleteTarget && (
                            <span className="mhv-name-chip" style={{ background: 'rgba(255,80,80,0.08)', border: '1.5px solid rgba(255,80,80,0.2)', color: '#ff5050' }}>
                            Ticket #{deleteTarget.id_venta} · ${Number(deleteTarget.monto_total).toFixed(2)}
                            </span>
                        )}
                        <div className="mhv-confirm-btns">
                        <button className="mhv-btn-cancel" onClick={() => { setDeleteStep('idle'); setDeleteTarget(null); }}>
                        Cancelar
                        </button>
                        <button
                        className="mhv-btn-delete-confirm"
                        onClick={handleConfirmDelete}
                        disabled={deleteStep === 'deleting'}
                        >
                        {deleteStep === 'deleting'
                            ? <><RefreshCw size={14} className="mhv-spinner" /> Eliminando...</>
                            : <><Trash2 size={14} /> Sí, eliminar</>
                        }
                        </button>
                        </div>
                        </>
                    ) : (
                        <>
                        <motion.div
                        className="mhv-screen-icon"
                        style={{ background: 'rgba(6,214,160,0.12)', border: '2px solid rgba(6,214,160,0.25)', color: '#06d6a0' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.05 }}
                        >
                        <Check size={34} />
                        </motion.div>
                        <p className="mhv-screen-title">Ticket eliminado</p>
                        <p className="mhv-screen-sub">El registro fue eliminado permanentemente del historial.</p>
                        </>
                    )}
                    </motion.div>
                )}
                </AnimatePresence>

                {/* ── Drag handle / header ── */}
                <div
                className="mhv-drag"
                onPointerDown={e => dragControls.start(e)}
                style={{ touchAction: 'none' }}
                >
                <div className="mhv-drag-left">
                <div className="mhv-drag-icon">
                <Receipt size={18} />
                </div>
                <div>
                <p className="mhv-drag-title">Historial de Ventas</p>
                <span className="mhv-drag-sub">Revisa y gestiona los tickets generados</span>
                </div>
                </div>
                <div className="mhv-drag-right">
                <GripHorizontal size={16} style={{ color: 'rgba(26,0,96,0.25)' }} />
                <button className="mhv-close-btn" onClick={onClose} onPointerDown={e => e.stopPropagation()} type="button">
                <X size={16} />
                </button>
                </div>
                </div>

                {/* ── Stats strip ── */}
                {!loading && ventas.length > 0 && (
                    <motion.div
                    className="mhv-stats"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    >
                    <div className="mhv-stat">
                    <span className="mhv-stat-label"><ShoppingBag size={10} /> Total ventas</span>
                    <span className="mhv-stat-value purple">{ventas.length}</span>
                    </div>
                    <div className="mhv-stat">
                    <span className="mhv-stat-label"><TrendingUp size={10} /> Monto total</span>
                    <span className="mhv-stat-value green">${stats.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    {Object.entries(stats.byMetodo).slice(0, 2).map(([m, cnt]) => {
                        const s = metodoStyle(m);
                        return (
                            <div key={m} className="mhv-stat">
                            <span className="mhv-stat-label" style={{ color: s.color }}>{s.icon} {s.label}</span>
                            <span className="mhv-stat-value" style={{ color: s.color }}>{cnt as number}</span>
                            </div>
                        );
                    })}
                    </motion.div>
                )}

                {/* ── Toolbar ── */}
                <div className="mhv-toolbar">
                <div className="mhv-search-wrap">
                <Search size={14} />
                <input
                className="mhv-search-input"
                placeholder="Buscar por ID o vendedor..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                />
                </div>

                {/* Filter by método */}
                <div className="mhv-filter-wrap">
                <button
                className={`mhv-filter-btn${showFilter ? ' open' : ''}`}
                onClick={() => setShowFilter(v => !v)}
                >
                <Filter size={13} />
                {filterMetodo === 'todos' ? 'Método' : filterMetodo}
                <ChevronDown size={12} style={{ transition: 'transform .2s', transform: showFilter ? 'rotate(180deg)' : 'none' }} />
                </button>
                <AnimatePresence>
                {showFilter && (
                    <motion.div
                    className="mhv-filter-dropdown"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0,   scale: 1    }}
                    exit={{ opacity: 0,   y: -8,   scale: 0.97 }}
                    transition={{ duration: .16 }}
                    >
                    {metodos.map(m => {
                        const s = m === 'todos' ? null : metodoStyle(m);
                        return (
                            <div
                            key={m}
                            className={`mhv-filter-item${filterMetodo === m ? ' active' : ''}`}
                            onClick={() => { setFilterMetodo(m); setShowFilter(false); }}
                            >
                            {s ? <span style={{ color: s.color, display: 'flex' }}>{s.icon}</span> : <Receipt size={11} />}
                            {m === 'todos' ? 'Todos los métodos' : s?.label ?? m}
                            {filterMetodo === m && <Check size={12} style={{ marginLeft: 'auto' }} />}
                            </div>
                        );
                    })}
                    </motion.div>
                )}
                </AnimatePresence>
                </div>

                <span className="mhv-count">{ventasFiltradas.length} resultados</span>
                </div>

                {/* ── List body ── */}
                <div className="mhv-body">
                {loading ? (
                    <div className="mhv-empty">
                    <Loader2 size={32} className="mhv-spinner" style={{ color: '#cc55ff' }} />
                    <p className="mhv-empty-title">Cargando historial...</p>
                    </div>
                ) : ventasFiltradas.length === 0 ? (
                    <div className="mhv-empty">
                    <div className="mhv-empty-icon"><Receipt size={28} /></div>
                    <p className="mhv-empty-title">{search || filterMetodo !== 'todos' ? 'Sin resultados' : 'Sin ventas aún'}</p>
                    <p className="mhv-empty-sub">
                    {search || filterMetodo !== 'todos'
                        ? 'Intenta cambiar los filtros de búsqueda.'
                : 'Aquí aparecerán los tickets una vez que se registren ventas.'}
                </p>
                </div>
                ) : (
                    ventasFiltradas.map((venta, i) => {
                        const ms = metodoStyle(venta.metodo_pago);
                        return (
                            <motion.div
                            key={venta.id_venta}
                            className="mhv-ticket"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            >
                            {/* Ticket header */}
                            <div className="mhv-ticket-header">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span className="mhv-ticket-id">
                            Ticket
                            <span className="mhv-ticket-id-num">#{venta.id_venta}</span>
                            </span>
                            <span
                            className="mhv-metodo-chip"
                            style={{ background: ms.bg, color: ms.color }}
                            >
                            {ms.icon} {ms.label}
                            </span>
                            </div>
                            <div className="mhv-ticket-meta">
                            <span>{formatFecha(venta.fecha_venta)}</span>
                            <span className="dot" />
                            <span>Vendió: <span className="vendedor">{venta.vendedor?.nombre_completo || 'N/A'}</span></span>
                            </div>
                            </div>

                            <div className="mhv-ticket-right">
                            <div style={{ textAlign: 'right' }}>
                            <span className="mhv-total-label">Total</span>
                            <span className="mhv-total-value">${Number(venta.monto_total).toFixed(2)}</span>
                            </div>
                            <button
                            className="mhv-del-btn"
                            onClick={() => handleDeleteClick(venta)}
                            title="Eliminar ticket"
                            >
                            <Trash2 size={15} />
                            </button>
                            </div>
                            </div>

                            {/* Products */}
                            {venta.detalles?.length > 0 && (
                                <div className="mhv-products">
                                {venta.detalles.map((d: any, idx: number) => (
                                    <div key={idx} className="mhv-product-row">
                                    <span className="mhv-product-name">{d.producto?.nombre ?? 'Producto'}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="mhv-product-qty">×{d.cantidad}</span>
                                    <span className="mhv-product-price">${Number(d.precio_unitario).toFixed(2)}</span>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            )}
                            </motion.div>
                        );
                    })
                )}
                </div>
                </motion.div>
                </div>
            )}
            </AnimatePresence>
            </>
    );
}
