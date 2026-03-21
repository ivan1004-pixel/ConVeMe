import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserGreeting from '../components/ui/UserGreeting';
import {
    Plus, ChevronDown, School, Users, UserCheck,
    CreditCard, Calendar, ChevronRight
} from 'lucide-react';

/* ── Tab config ── */
const TABS = [
    { id: 'escuelas',  label: 'Escuelas',         icon: <School     size={16} /> },
{ id: 'empleados', label: 'Empleados',         icon: <Users      size={16} /> },
{ id: 'vendedores',label: 'Vendedores',        icon: <UserCheck  size={16} /> },
{ id: 'cuentas',   label: 'Cuentas Bancarias', icon: <CreditCard size={16} /> },
{ id: 'eventos',   label: 'Eventos',            icon: <Calendar   size={16} /> },
];

const COLUMNAS: Record<string, { key: string; label: string }[]> = {
    escuelas:  [
        { key: 'id',        label: 'ID'       },
        { key: 'nombre',    label: 'Nombre'   },
        { key: 'siglas',    label: 'Siglas'   },
        { key: 'municipio', label: 'Municipio'},
        { key: 'estado',    label: 'Estado'   },
    ],
    empleados: [
        { key: 'id',       label: 'ID'             },
        { key: 'nombre',   label: 'Nombre Completo'},
        { key: 'puesto',   label: 'Puesto'         },
        { key: 'telefono', label: 'Teléfono'       },
        { key: 'email',    label: 'Email'          },
    ],
    vendedores: [
        { key: 'id',       label: 'ID'               },
        { key: 'nombre',   label: 'Nombre Completo'  },
        { key: 'escuela',  label: 'Escuela Asignada' },
        { key: 'instagram',label: 'Instagram'        },
        { key: 'comisiones',label:'Comisiones'       },
    ],
    cuentas: [
        { key: 'id',       label: 'ID'       },
        { key: 'vendedor', label: 'Vendedor' },
        { key: 'banco',    label: 'Banco'    },
        { key: 'titular',  label: 'Titular'  },
        { key: 'clabe',    label: 'CLABE'    },
    ],
    eventos: [
        { key: 'id',      label: 'ID'           },
        { key: 'nombre',  label: 'Nombre Evento'},
        { key: 'fechas',  label: 'Fechas'       },
        { key: 'escuela', label: 'Escuela Sede' },
        { key: 'estado',  label: 'Estado'       },
    ],
};

export default function Catalogos() {
    const [tabActiva, setTabActiva]     = useState('escuelas');
    const [dropOpen,  setDropOpen]      = useState(false);
    const [addOpen,   setAddOpen]       = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    const tabActual = TABS.find(t => t.id === tabActiva)!;
    const columnas  = COLUMNAS[tabActiva] ?? [];

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

            .cat-root {
                display: flex;
                flex-direction: column;
                gap: 24px;
                font-family: 'DM Sans', sans-serif;
            }

            /* ══ PAGE HEADER ══ */
            .cat-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 16px;
                flex-wrap: wrap;
            }
            .cat-header-text h1 {
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: clamp(22px, 3vw, 32px);
                color: #1a0060;
                line-height: 1.05;
                margin-bottom: 4px;
            }
            .cat-header-text p {
                font-size: 13px;
                font-weight: 500;
                color: rgba(26,0,96,0.5);
            }

            /* Add button */
            .cat-add-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: #06d6a0;
                color: #fff;
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: 13px;
                letter-spacing: .08em;
                text-transform: uppercase;
                border: 2.5px solid #1a0060;
                border-radius: 12px;
                padding: 12px 20px;
                cursor: pointer;
                box-shadow: 4px 4px 0px #1a0060;
                transition: transform .12s, box-shadow .12s;
                white-space: nowrap;
            }
            .cat-add-btn:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px #1a0060; }
            .cat-add-btn:active{ transform: translate(2px,2px);   box-shadow: 2px 2px 0px #1a0060; }

            /* ══ SELECTOR DROPDOWN ══ */
            .cat-selector-wrap {
                position: relative;
            }
            .cat-selector-btn {
                display: flex;
                align-items: center;
                gap: 10px;
                width: 100%;
                background: #fff;
                border: 2.5px solid #1a0060;
                border-radius: 14px;
                padding: 14px 18px;
                cursor: pointer;
                box-shadow: 4px 4px 0px #1a0060;
                transition: box-shadow .15s, transform .15s;
                font-family: 'DM Sans', sans-serif;
            }
            .cat-selector-btn:hover { transform: translate(-1px,-1px); box-shadow: 5px 5px 0px #1a0060; }
            .cat-selector-icon {
                width: 36px; height: 36px;
                border-radius: 10px;
                background: rgba(204,85,255,0.12);
                border: 1.5px solid rgba(204,85,255,0.22);
                display: flex; align-items: center; justify-content: center;
                color: #cc55ff;
                flex-shrink: 0;
            }
            .cat-selector-label {
                flex: 1;
                text-align: left;
            }
            .cat-selector-sublabel {
                font-size: 10px;
                font-weight: 600;
                letter-spacing: .1em;
                text-transform: uppercase;
                color: rgba(26,0,96,0.4);
                display: block;
                margin-bottom: 2px;
            }
            .cat-selector-name {
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 15px;
                color: #1a0060;
            }
            .cat-chevron {
                color: rgba(26,0,96,0.4);
                transition: transform .22s;
                flex-shrink: 0;
            }
            .cat-chevron.open { transform: rotate(180deg); }

            /* Dropdown menu */
            .cat-dropdown {
                position: absolute;
                top: calc(100% + 8px);
                left: 0; right: 0;
                background: #fff;
                border: 2.5px solid #1a0060;
                border-radius: 16px;
                box-shadow: 6px 6px 0px #1a0060;
                overflow: hidden;
                z-index: 50;
            }
            .cat-drop-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 13px 16px;
                cursor: pointer;
                border: none;
                background: none;
                width: 100%;
                text-align: left;
                border-bottom: 1.5px solid rgba(26,0,96,0.06);
                transition: background .15s;
                font-family: 'DM Sans', sans-serif;
            }
            .cat-drop-item:last-child { border-bottom: none; }
            .cat-drop-item:hover { background: rgba(204,85,255,0.07); }
            .cat-drop-item.active { background: #ffe144; }
            .cat-drop-item-icon {
                width: 30px; height: 30px;
                border-radius: 8px;
                display: flex; align-items: center; justify-content: center;
                flex-shrink: 0;
                background: rgba(204,85,255,0.1);
                color: #cc55ff;
            }
            .cat-drop-item.active .cat-drop-item-icon {
                background: rgba(26,0,96,0.12);
                color: #1a0060;
            }
            .cat-drop-item-label {
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 13px;
                color: #1a0060;
                flex: 1;
            }
            .cat-drop-check {
                color: #1a0060;
                opacity: 0;
                transition: opacity .15s;
            }
            .cat-drop-item.active .cat-drop-check { opacity: 1; }

            /* ══ MAIN CARD ══ */
            .cat-card {
                background: #fff;
                border: 3px solid #1a0060;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 6px 6px 0px #1a0060;
            }
            .cat-card-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                background: rgba(237,233,254,0.6);
                border-bottom: 2px solid rgba(26,0,96,0.1);
                gap: 12px;
                flex-wrap: wrap;
            }
            .cat-card-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: 15px;
                color: #1a0060;
                text-transform: uppercase;
                letter-spacing: .06em;
            }
            .cat-card-title-icon {
                width: 32px; height: 32px;
                border-radius: 10px;
                background: rgba(204,85,255,0.12);
                border: 1.5px solid rgba(204,85,255,0.2);
                display: flex; align-items: center; justify-content: center;
                color: #cc55ff;
            }
            .cat-count-badge {
                background: rgba(204,85,255,0.1);
                border: 1.5px solid rgba(204,85,255,0.2);
                border-radius: 8px;
                padding: 3px 10px;
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 11px;
                color: #cc55ff;
            }

            /* ══ TABLE — horizontal scroll wrapper ══ */
            .cat-table-scroll {
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: thin;
                scrollbar-color: rgba(204,85,255,0.3) transparent;
            }
            .cat-table-scroll::-webkit-scrollbar { height: 5px; }
            .cat-table-scroll::-webkit-scrollbar-track { background: transparent; }
            .cat-table-scroll::-webkit-scrollbar-thumb { background: rgba(204,85,255,0.3); border-radius: 4px; }

            .cat-table {
                width: 100%;
                min-width: 560px;        /* fuerza scroll horizontal en móvil */
                border-collapse: collapse;
                font-family: 'DM Sans', sans-serif;
            }

            /* Column headers */
            .cat-table thead tr {
                background: #1a0060;
            }
            .cat-table thead th {
                padding: 14px 20px;
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 10.5px;
                letter-spacing: .12em;
                text-transform: uppercase;
                color: rgba(255,255,255,0.7);
                white-space: nowrap;
                border-right: 1px solid rgba(255,255,255,0.08);
            }
            .cat-table thead th:last-child { border-right: none; }
            .cat-table thead th:first-child {
                color: #ffe144;
                width: 60px;
            }

            /* Rows */
            .cat-table tbody tr {
                border-bottom: 1.5px solid rgba(26,0,96,0.07);
                transition: background .15s;
            }
            .cat-table tbody tr:last-child { border-bottom: none; }
            .cat-table tbody tr:hover { background: rgba(204,85,255,0.05); }

            .cat-table tbody td {
                padding: 14px 20px;
                font-size: 13.5px;
                font-weight: 500;
                color: rgba(26,0,96,0.7);
                white-space: nowrap;
                border-right: 1px solid rgba(26,0,96,0.05);
            }
            .cat-table tbody td:last-child { border-right: none; }
            .cat-table tbody td:first-child {
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 12px;
                color: rgba(26,0,96,0.35);
            }

            /* ── Acciones column ── */
            .cat-actions {
                display: flex;
                align-items: center;
                gap: 6px;
                justify-content: flex-end;
            }
            .cat-action-btn {
                width: 30px; height: 30px;
                border-radius: 8px;
                border: 1.5px solid rgba(26,0,96,0.14);
                background: rgba(26,0,96,0.04);
                display: flex; align-items: center; justify-content: center;
                cursor: pointer;
                color: rgba(26,0,96,0.5);
                transition: background .15s, color .15s, border-color .15s;
            }
            .cat-action-btn:hover { background: rgba(204,85,255,0.12); color: #cc55ff; border-color: rgba(204,85,255,0.25); }
            .cat-action-btn.danger:hover { background: rgba(255,80,80,0.1); color: #ff5050; border-color: rgba(255,80,80,0.25); }

            /* ── Empty state ── */
            .cat-empty {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px 24px;
                gap: 12px;
            }
            .cat-empty-icon {
                width: 64px; height: 64px;
                border-radius: 20px;
                background: rgba(204,85,255,0.08);
                border: 2px solid rgba(204,85,255,0.15);
                display: flex; align-items: center; justify-content: center;
                color: rgba(204,85,255,0.5);
                margin-bottom: 4px;
            }
            .cat-empty-title {
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: 16px;
                color: #1a0060;
            }
            .cat-empty-sub {
                font-size: 13px;
                font-weight: 500;
                color: rgba(26,0,96,0.45);
                text-align: center;
                max-width: 320px;
            }

            /* ══ ADD DROPDOWN (what to register) ══ */
            .cat-add-wrap {
                position: relative;
            }
            .cat-add-dropdown {
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                min-width: 220px;
                background: #fff;
                border: 2.5px solid #1a0060;
                border-radius: 16px;
                box-shadow: 6px 6px 0px #1a0060;
                overflow: hidden;
                z-index: 50;
            }
            .cat-add-drop-header {
                padding: 12px 16px 8px;
                font-family: 'Syne', sans-serif;
                font-weight: 700;
                font-size: 10px;
                letter-spacing: .12em;
                text-transform: uppercase;
                color: rgba(26,0,96,0.35);
                border-bottom: 1.5px solid rgba(26,0,96,0.06);
            }
            .cat-add-drop-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 16px;
                cursor: pointer;
                border: none;
                background: none;
                width: 100%;
                text-align: left;
                border-bottom: 1px solid rgba(26,0,96,0.05);
                transition: background .15s;
                font-family: 'DM Sans', sans-serif;
            }
            .cat-add-drop-item:last-child { border-bottom: none; }
            .cat-add-drop-item:hover { background: rgba(6,214,160,0.07); }
            .cat-add-drop-icon {
                width: 28px; height: 28px;
                border-radius: 8px;
                background: rgba(6,214,160,0.12);
                display: flex; align-items: center; justify-content: center;
                color: #06d6a0;
                flex-shrink: 0;
            }
            .cat-add-drop-label {
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 12.5px;
                color: #1a0060;
            }
            .cat-add-drop-sub {
                font-size: 10.5px;
                font-weight: 500;
                color: rgba(26,0,96,0.4);
            }

            /* ══ RESPONSIVE ══ */
            @media (max-width: 640px) {
                .cat-header { flex-direction: column; align-items: stretch; }
                .cat-add-btn { width: 100%; justify-content: center; }
                .cat-add-dropdown { left: 0; right: 0; }
            }
            `}</style>

            <div className="cat-root">
            <UserGreeting />

            {/* ── Page header ── */}
            <div className="cat-header">
            <div className="cat-header-text">
            <h1>Catálogos</h1>
            <p>Administra los registros de cada categoría del sistema.</p>
            </div>

            {/* Add button with dropdown list */}
            <div className="cat-add-wrap" ref={dropRef}>
            <motion.button
            className="cat-add-btn"
            onClick={() => setAddOpen(v => !v)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            >
            <Plus size={18} />
            Añadir registro
            <ChevronDown size={15} style={{ transform: addOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
            </motion.button>

            <AnimatePresence>
            {addOpen && (
                <motion.div
                className="cat-add-dropdown"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                >
                <p className="cat-add-drop-header">¿Qué deseas registrar?</p>
                {TABS.map(tab => (
                    <button
                    key={tab.id}
                    className="cat-add-drop-item"
                    onClick={() => {
                        setTabActiva(tab.id);
                        setAddOpen(false);
                        // TODO: abrir modal de creación para tab.id
                    }}
                    >
                    <span className="cat-add-drop-icon">{tab.icon}</span>
                    <span>
                    <span className="cat-add-drop-label">{tab.label}</span>
                    <span className="cat-add-drop-sub" style={{ display:'block' }}>
                    Nuevo registro
                    </span>
                    </span>
                    <ChevronRight size={13} style={{ color:'rgba(26,0,96,0.25)', marginLeft:'auto' }} />
                    </button>
                ))}
                </motion.div>
            )}
            </AnimatePresence>
            </div>
            </div>

            {/* ── Category selector dropdown ── */}
            <div className="cat-selector-wrap">
            <button
            className="cat-selector-btn"
            onClick={() => setDropOpen(v => !v)}
            >
            <span className="cat-selector-icon">{tabActual.icon}</span>
            <span className="cat-selector-label">
            <span className="cat-selector-sublabel">Categoría activa</span>
            <span className="cat-selector-name">{tabActual.label}</span>
            </span>
            <ChevronDown size={18} className={`cat-chevron${dropOpen ? ' open' : ''}`} />
            </button>

            <AnimatePresence>
            {dropOpen && (
                <motion.div
                className="cat-dropdown"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                >
                {TABS.map(tab => (
                    <button
                    key={tab.id}
                    className={`cat-drop-item${tabActiva === tab.id ? ' active' : ''}`}
                    onClick={() => {
                        setTabActiva(tab.id);
                        setDropOpen(false);
                    }}
                    >
                    <span className="cat-drop-item-icon">{tab.icon}</span>
                    <span className="cat-drop-item-label">{tab.label}</span>
                    <ChevronRight size={14} className="cat-drop-check" />
                    </button>
                ))}
                </motion.div>
            )}
            </AnimatePresence>
            </div>

            {/* ── Main table card ── */}
            <AnimatePresence mode="wait">
            <motion.div
            key={tabActiva}
            className="cat-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22,1,0.36,1] }}
            >
            {/* Card header */}
            <div className="cat-card-header">
            <div className="cat-card-title">
            <span className="cat-card-title-icon">{tabActual.icon}</span>
            {tabActual.label}
            </div>
            <span className="cat-count-badge">0 registros</span>
            </div>

            {/* Table with horizontal scroll */}
            <div className="cat-table-scroll">
            <table className="cat-table">
            <thead>
            <tr>
            {columnas.map(col => (
                <th key={col.key}>{col.label}</th>
            ))}
            <th style={{ textAlign:'right', paddingRight:20 }}>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {/* ── Empty state ──
                Cuando tengas datos, reemplaza esto con:
                datos.map(row => (
                    <tr key={row.id}>
                    {columnas.map(col => <td key={col.key}>{row[col.key]}</td>)}
                    <td>... acciones ...</td>
                    </tr>
    ))
    */}
    <tr>
    <td colSpan={columnas.length + 1} style={{ padding:0, border:'none' }}>
    <div className="cat-empty">
    <div className="cat-empty-icon">{tabActual.icon}</div>
    <p className="cat-empty-title">Sin registros aún</p>
    <p className="cat-empty-sub">
    No hay {tabActual.label.toLowerCase()} cargados. Usa el botón
    "Añadir registro" para crear el primero.
    </p>
    </div>
    </td>
    </tr>
    </tbody>
    </table>
    </div>
    </motion.div>
    </AnimatePresence>

    </div>
    </>
    );
}
