import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UserGreeting from '../components/ui/UserGreeting';
import ModalEscuela  from '../components/catalogos/ModalEscuela';
import ModalVendedor from '../components/catalogos/ModalVendedor';
import { getEscuelas,   createEscuela,   updateEscuela,   deleteEscuela   } from '../services/escuela.service';
import { getVendedores, createVendedor,  updateVendedor,  deleteVendedor  } from '../services/vendedor.service';
import {
    Plus, ChevronDown, School, Users, UserCheck,
    CreditCard, Calendar, ChevronRight,
    Pencil, Trash2, Search, X, CheckCircle,
    ArrowUpDown, Loader2
} from 'lucide-react';

import '../styles/Catalogos.css';

/* ── Tab config ── */
const TABS = [
    { id: 'escuelas',   label: 'Escuelas',          icon: <School     size={16} /> },
{ id: 'empleados',  label: 'Empleados',          icon: <Users      size={16} /> },
{ id: 'vendedores', label: 'Vendedores',         icon: <UserCheck  size={16} /> },
{ id: 'cuentas',    label: 'Cuentas Bancarias',  icon: <CreditCard size={16} /> },
{ id: 'eventos',    label: 'Eventos',             icon: <Calendar   size={16} /> },
];

const COLUMNAS: Record<string, { key: string; label: string; sortable?: boolean }[]> = {
    escuelas: [
        { key: 'id_escuela', label: 'ID'        },
        { key: 'nombre',     label: 'Nombre',    sortable: true },
        { key: 'siglas',     label: 'Siglas'    },
        { key: 'municipio',  label: 'Municipio', sortable: true },
        { key: 'estado',     label: 'Estado',    sortable: true },
    ],
    empleados: [
        { key: 'id',       label: 'ID'               },
        { key: 'nombre',   label: 'Nombre Completo',  sortable: true },
        { key: 'puesto',   label: 'Puesto',           sortable: true },
        { key: 'telefono', label: 'Teléfono'          },
        { key: 'email',    label: 'Email'             },
    ],
    vendedores: [
        { key: 'id_vendedor', label: 'ID'                },
        { key: 'nombre',      label: 'Nombre Completo',  sortable: true },
        { key: 'escuela',     label: 'Escuela Asignada', sortable: true },
        { key: 'instagram',   label: 'Instagram'         },
        { key: 'comisiones',  label: 'Comisiones',       sortable: true },
    ],
    cuentas: [
        { key: 'id',       label: 'ID'       },
        { key: 'vendedor', label: 'Vendedor', sortable: true },
        { key: 'banco',    label: 'Banco',    sortable: true },
        { key: 'titular',  label: 'Titular'  },
        { key: 'clabe',    label: 'CLABE'    },
    ],
    eventos: [
        { key: 'id',      label: 'ID'            },
        { key: 'nombre',  label: 'Nombre Evento', sortable: true },
        { key: 'fechas',  label: 'Fechas'         },
        { key: 'escuela', label: 'Escuela Sede',  sortable: true },
        { key: 'estado',  label: 'Estado',        sortable: true },
    ],
};

interface Toast { msg: string; type: 'success' | 'delete' | 'error' }

/* ── Toast Portal ─────────────────────────────────────────────────────────
 *  Renderizamos el toast directamente en document.body para que quede fuera
 *  de cualquier stacking context creado por backdrop-filter del modal.
 ─ *─ */
function ToastPortal({ toast }: { toast: Toast | null }) {
    return createPortal(
        <AnimatePresence>
        {toast && (
            <motion.div
            className="cat-toast"
            initial={{ opacity:0, y:-50, scale:0.9 }}
            animate={{ opacity:1, y:0,   scale:1   }}
            exit={{ opacity:0,   y:-40,  scale:0.9 }}
            transition={{ type:'spring', stiffness:300, damping:22 }}
            >
            <span className="cat-toast-icon" style={{
                color: toast.type === 'success' ? '#06d6a0' : '#ff5050'
            }}>
            {toast.type === 'success'
                ? <CheckCircle size={16} />
                : <Trash2 size={16} />
            }
            </span>
            {toast.msg}
            <div className="cat-toast-bar" />
            </motion.div>
        )}
        </AnimatePresence>,
        document.body
    );
}

export default function Catalogos() {
    const [tabActiva, setTabActiva] = useState('escuelas');
    const [dropOpen,  setDropOpen]  = useState(false);
    const [addOpen,   setAddOpen]   = useState(false);

    // Modales
    const [isModalEscuelaOpen,  setIsModalEscuelaOpen]  = useState(false);
    const [escuelaEditando,     setEscuelaEditando]     = useState<any | null>(null);
    const [isModalVendedorOpen, setIsModalVendedorOpen] = useState(false);
    const [vendedorEditando,    setVendedorEditando]    = useState<any | null>(null);

    // Data
    const [datosEscuelas,   setDatosEscuelas]   = useState<any[]>([]);
    const [datosVendedores, setDatosVendedores] = useState<any[]>([]);
    const [loadingDatos,    setLoadingDatos]    = useState(false);

    // Search & sort
    const [search,  setSearch]  = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState(true);

    // Toast — null cuando no hay nada que mostrar
    const [toast, setToast] = useState<Toast | null>(null);

    // Refs for outside-click
    const selectorRef = useRef<HTMLDivElement>(null);
    const addRef      = useRef<HTMLDivElement>(null);

    const tabActual = TABS.find(t => t.id === tabActiva)!;
    const columnas  = COLUMNAS[tabActiva] ?? [];

    /* ── Outside click ── */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) setDropOpen(false);
            if (addRef.current      && !addRef.current.contains(e.target as Node))      setAddOpen(false);
        };
            document.addEventListener('mousedown', handler);
            return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* ── Load data on tab change ── */
    useEffect(() => {
        if (tabActiva === 'escuelas')   cargarEscuelas();
        if (tabActiva === 'vendedores') cargarVendedores();
        setSearch(''); setSortKey(null); setSortAsc(true);
    }, [tabActiva]);

    /* ── Toast helper ── */
    const showToast = (msg: string, type: Toast['type'] = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2600);
    };

    /* ── Sort ── */
    const handleSort = (key: string) => {
        if (sortKey === key) setSortAsc(v => !v);
        else { setSortKey(key); setSortAsc(true); }
    };

    /* ══ ESCUELAS CRUD ══ */
    const cargarEscuelas = async () => {
        setLoadingDatos(true);
        try { setDatosEscuelas(await getEscuelas()); }
        catch (err) { console.error(err); showToast('Error al cargar los datos', 'error'); }
        finally { setLoadingDatos(false); }
    };

    const handleGuardarEscuela = async (data: any) => {
        try {
            if (escuelaEditando) {
                await updateEscuela({ id_escuela: escuelaEditando.id_escuela, ...data });
                showToast(`"${data.nombre}" actualizada correctamente`);
            } else {
                await createEscuela(data);
                showToast(`"${data.nombre}" creada correctamente`);
            }
            await cargarEscuelas();
            setEscuelaEditando(null);
        } catch (err: any) { throw err; }
    };

    const handleOpenDeleteEscuela = (escuela: any) => {
        setEscuelaEditando(escuela);
        setIsModalEscuelaOpen(true);
    };

    const handleConfirmDeleteEscuela = async () => {
        if (!escuelaEditando) return;
        try {
            await deleteEscuela(escuelaEditando.id_escuela);
            showToast(`"${escuelaEditando.nombre}" eliminada`, 'delete');
            await cargarEscuelas();
            setEscuelaEditando(null);
        } catch (err: any) { throw err; }
    };

    /* ══ VENDEDORES CRUD ══ */
    const cargarVendedores = async () => {
        setLoadingDatos(true);
        try { setDatosVendedores(await getVendedores()); }
        catch (err) { console.error(err); showToast('Error al cargar los datos', 'error'); }
        finally { setLoadingDatos(false); }
    };

    const handleGuardarVendedor = async (data: any) => {
        try {
            if (vendedorEditando) {
                await updateVendedor({ id_vendedor: vendedorEditando.id_vendedor, ...data });
                showToast(`"${data.nombre_completo}" actualizado correctamente`);
            } else {
                await createVendedor(data);
                showToast(`"${data.nombre_completo}" creado correctamente`);
            }
            await cargarVendedores();
            setVendedorEditando(null);
        } catch (err: any) { throw err; }
    };

    const handleOpenDeleteVendedor = (vendedor: any) => {
        setVendedorEditando(vendedor);
        setIsModalVendedorOpen(true);
    };

    const handleConfirmDeleteVendedor = async () => {
        if (!vendedorEditando) return;
        try {
            await deleteVendedor(vendedorEditando.id_vendedor);
            showToast(`"${vendedorEditando.nombre_completo}" eliminado`, 'delete');
            await cargarVendedores();
            setVendedorEditando(null);
        } catch (err: any) { throw err; }
    };

    /* ── Filtered & sorted data ── */
    const datosTablaActual = tabActiva === 'escuelas'   ? datosEscuelas
    : tabActiva === 'vendedores' ? datosVendedores
    : [];

    const datosActuales = datosTablaActual
    .filter(e => {
        const text = tabActiva === 'escuelas'
    ? [e.nombre, e.siglas, e.municipio?.nombre, e.municipio?.estado?.nombre].join(' ').toLowerCase()
    : tabActiva === 'vendedores'
    ? [e.nombre_completo, e.instagram_handle, e.escuela?.nombre].join(' ').toLowerCase()
    : '';
    return text.includes(search.toLowerCase());
    })
    .sort((a, b) => {
        if (!sortKey) return 0;
        const val = (obj: any) => {
            if (tabActiva === 'escuelas') {
                return sortKey === 'municipio' ? obj.municipio?.nombre ?? ''
                : sortKey === 'estado'    ? obj.municipio?.estado?.nombre ?? ''
                : obj[sortKey] ?? '';
            }
            if (tabActiva === 'vendedores') {
                return sortKey === 'escuela'    ? obj.escuela?.nombre ?? ''
                : sortKey === 'nombre'     ? obj.nombre_completo ?? ''
    : sortKey === 'comisiones' ? obj.comision_fija_menudeo ?? 0
    : obj[sortKey] ?? '';
            }
            return '';
        };
        const vA = val(a), vB = val(b);
        if (typeof vA === 'number' && typeof vB === 'number')
            return sortAsc ? vA - vB : vB - vA;
        return sortAsc
        ? String(vA).localeCompare(String(vB))
        : String(vB).localeCompare(String(vA));
    });

    const totalRegistros = datosTablaActual.length;

    return (
        <>
        {/* ── Toast — portaled to document.body, fuera de cualquier stacking context ── */}
        <ToastPortal toast={toast} />

        <div className="cat-root">
        <UserGreeting />

        {/* ── Page header ── */}
        <div className="cat-header">
        <div className="cat-header-text">
        <h1>Catálogos</h1>
        <p>Administra los registros de cada categoría del sistema.</p>
        </div>

        {/* Add button + dropdown */}
        <div className="cat-add-wrap" ref={addRef}>
        <motion.button
        className="cat-add-btn"
        onClick={() => setAddOpen(v => !v)}
        whileHover={{ scale:1.02 }}
        whileTap={{ scale:0.97 }}
        >
        <Plus size={17} />
        Añadir registro
        <ChevronDown size={14} style={{ transition:'transform .2s', transform: addOpen ? 'rotate(180deg)' : 'none' }} />
        </motion.button>

        <AnimatePresence>
        {addOpen && (
            <motion.div
            className="cat-add-dropdown"
            initial={{ opacity:0, y:-10, scale:0.96 }}
            animate={{ opacity:1, y:0,   scale:1    }}
            exit={{ opacity:0,   y:-10,  scale:0.96 }}
            transition={{ duration:.18 }}
            >
            <p className="cat-add-drop-header">¿Qué deseas registrar?</p>
            {TABS.map(tab => (
                <button
                key={tab.id}
                className="cat-add-drop-item"
                onClick={() => {
                    setTabActiva(tab.id);
                    setAddOpen(false);
                    if (tab.id === 'escuelas') {
                        setEscuelaEditando(null);
                        setIsModalEscuelaOpen(true);
                    } else if (tab.id === 'vendedores') {
                        setVendedorEditando(null);
                        setIsModalVendedorOpen(true);
                    }
                    // TODO: otros modales (empleados, cuentas, eventos)
                }}
                >
                <span className="cat-add-drop-icon">{tab.icon}</span>
                <span>
                <span className="cat-add-drop-label">{tab.label}</span>
                <span className="cat-add-drop-sub">Nuevo registro</span>
                </span>
                <ChevronRight size={13} className="cat-add-drop-arrow" />
                </button>
            ))}
            </motion.div>
        )}
        </AnimatePresence>
        </div>
        </div>

        {/* ── Category selector ── */}
        <div className="cat-selector-wrap" ref={selectorRef}>
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
            initial={{ opacity:0, y:-10, scale:0.97 }}
            animate={{ opacity:1, y:0,   scale:1    }}
            exit={{ opacity:0,   y:-10,  scale:0.97 }}
            transition={{ duration:.2, ease:[0.22,1,0.36,1] }}
            >
            {TABS.map(tab => (
                <button
                key={tab.id}
                className={`cat-drop-item${tabActiva === tab.id ? ' active' : ''}`}
                onClick={() => { setTabActiva(tab.id); setDropOpen(false); }}
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

        {/* ── Table card ── */}
        <AnimatePresence mode="wait">
        <motion.div
        key={tabActiva}
        className="cat-card"
        initial={{ opacity:0, y:18 }}
        animate={{ opacity:1, y:0  }}
        exit={{ opacity:0,   y:-10 }}
        transition={{ duration:.28, ease:[0.22,1,0.36,1] }}
        >
        {/* Card header */}
        <div className="cat-card-header">
        <div className="cat-card-header-left">
        <span className="cat-card-title-icon">{tabActual.icon}</span>
        <span className="cat-card-title">{tabActual.label}</span>
        <span className="cat-count-badge">{totalRegistros} registros</span>
        </div>

        <div className="cat-card-header-right">
        {['escuelas','vendedores'].includes(tabActiva) && (
            <div className="cat-search-wrap">
            <Search size={13} />
            <input
            className="cat-search-input"
            placeholder={`Buscar ${tabActual.label.toLowerCase()}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            />
            {search && (
                <button
                onClick={() => setSearch('')}
                style={{ background:'none', border:'none', cursor:'pointer', display:'flex', color:'rgba(26,0,96,0.3)', padding:0 }}
                >
                <X size={12} />
                </button>
            )}
            </div>
        )}
        </div>
        </div>

        {/* Table */}
        <div className="cat-table-scroll">
        <table className="cat-table">
        <thead>
        <tr>
        {columnas.map(col => (
            <th
            key={col.key}
            className={col.sortable ? 'cat-th-sortable' : ''}
            onClick={() => col.sortable && handleSort(col.key)}
            >
            {col.sortable ? (
                <div className="cat-th-inner">
                {col.label}
                <ArrowUpDown size={11} className="cat-sort-icon"
                style={{ opacity: sortKey === col.key ? 1 : 0.35 }}
                />
                </div>
            ) : col.label}
            </th>
        ))}
        <th style={{ textAlign:'right', paddingRight:20 }}>Acciones</th>
        </tr>
        </thead>
        <tbody>

        {/* Loading */}
        {loadingDatos && (
            <tr>
            <td colSpan={columnas.length + 1} style={{ padding:'48px 24px', textAlign:'center' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, color:'rgba(26,0,96,0.4)' }}>
            <Loader2 size={18} style={{ animation:'cat-spin 1s linear infinite' }} />
            <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:13 }}>Cargando datos...</span>
            </div>
            <style>{`@keyframes cat-spin{to{transform:rotate(360deg)}}`}</style>
            </td>
            </tr>
        )}

        {/* Escuelas rows */}
        {!loadingDatos && tabActiva === 'escuelas' && datosActuales.length > 0 &&
            datosActuales.map((escuela, i) => (
                <motion.tr
                key={escuela.id_escuela}
                initial={{ opacity:0, x:-8 }}
                animate={{ opacity:1, x:0  }}
                transition={{ delay: i * 0.03 }}
                >
                <td>#{escuela.id_escuela}</td>
                <td style={{ fontWeight:600, color:'#1a0060' }}>{escuela.nombre}</td>
                <td>{escuela.siglas}</td>
                <td>{escuela.municipio?.nombre || '—'}</td>
                <td>{escuela.municipio?.estado?.nombre || '—'}</td>
                <td>
                <div className="cat-actions">
                <button className="cat-action-btn" title="Editar" onClick={() => { setEscuelaEditando(escuela); setIsModalEscuelaOpen(true); }}>
                <Pencil size={13} />
                </button>
                <button className="cat-action-btn danger" title="Eliminar" onClick={() => handleOpenDeleteEscuela(escuela)}>
                <Trash2 size={13} />
                </button>
                </div>
                </td>
                </motion.tr>
            ))
        }

        {/* Vendedores rows */}
        {!loadingDatos && tabActiva === 'vendedores' && datosActuales.length > 0 &&
            datosActuales.map((vendedor, i) => (
                <motion.tr
                key={vendedor.id_vendedor}
                initial={{ opacity:0, x:-8 }}
                animate={{ opacity:1, x:0  }}
                transition={{ delay: i * 0.03 }}
                >
                <td>#{vendedor.id_vendedor}</td>
                <td style={{ fontWeight:600, color:'#1a0060' }}>{vendedor.nombre_completo}</td>
                <td>{vendedor.escuela?.nombre || '—'}</td>
                <td style={{ color:'#cc55ff' }}>
                {vendedor.instagram_handle ? `@${vendedor.instagram_handle}` : '—'}
                </td>
                <td>
                <span style={{
                    background:'#06d6a0', color:'#fff',
                    padding:'3px 8px', borderRadius:6,
                    fontSize:11, fontWeight:800,
                    fontFamily:'Syne,sans-serif',
                }}>
                {vendedor.comision_fija_menudeo}% / {vendedor.comision_fija_mayoreo}%
                </span>
                </td>
                <td>
                <div className="cat-actions">
                <button className="cat-action-btn" title="Editar" onClick={() => { setVendedorEditando(vendedor); setIsModalVendedorOpen(true); }}>
                <Pencil size={13} />
                </button>
                <button className="cat-action-btn danger" title="Eliminar" onClick={() => handleOpenDeleteVendedor(vendedor)}>
                <Trash2 size={13} />
                </button>
                </div>
                </td>
                </motion.tr>
            ))
        }

        {/* Empty state */}
        {!loadingDatos && datosActuales.length === 0 && (
            <tr>
            <td colSpan={columnas.length + 1} style={{ padding:0, border:'none' }}>
            <div className="cat-empty">
            <div className="cat-empty-icon">{tabActual.icon}</div>
            <p className="cat-empty-title">
            {search ? 'Sin resultados' : 'Sin registros todavía'}
            </p>
            <p className="cat-empty-sub">
            {search
                ? `No se encontraron ${tabActual.label.toLowerCase()} con "${search}".`
                : `No hay ${tabActual.label.toLowerCase()} registrados. Usa "Añadir registro" para crear el primero.`
            }
            </p>
            {!search && (tabActiva === 'escuelas' || tabActiva === 'vendedores') && (
                <button
                className="cat-empty-cta"
                onClick={() => {
                    if (tabActiva === 'escuelas')   { setEscuelaEditando(null);  setIsModalEscuelaOpen(true);  }
                    if (tabActiva === 'vendedores') { setVendedorEditando(null); setIsModalVendedorOpen(true); }
                }}
                >
                <Plus size={14} /> Añadir {tabActual.label.toLowerCase()}
                </button>
            )}
            </div>
            </td>
            </tr>
        )}

        </tbody>
        </table>
        </div>
        </motion.div>
        </AnimatePresence>

        {/* ── Modales ── */}
        <ModalEscuela
        isOpen={isModalEscuelaOpen}
        onClose={() => { setIsModalEscuelaOpen(false); setEscuelaEditando(null); }}
        onSave={handleGuardarEscuela}
        onDelete={escuelaEditando ? handleConfirmDeleteEscuela : undefined}
        escuelaAEditar={escuelaEditando}
        />

        <ModalVendedor
        isOpen={isModalVendedorOpen}
        onClose={() => { setIsModalVendedorOpen(false); setVendedorEditando(null); }}
        onSave={handleGuardarVendedor}
        onDelete={vendedorEditando ? handleConfirmDeleteVendedor : undefined}
        vendedorAEditar={vendedorEditando}
        />

        </div>
        </>
    );
}
