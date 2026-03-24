import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UserGreeting from '../components/ui/UserGreeting';
import ModalProducto from '../components/inventario/ModalProducto';
import ModalCategoria from '../components/inventario/ModalCategoria';
import ModalTamano from '../components/inventario/ModalTamano';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/producto.service';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../services/categoria.service';
import { getTamanos, createTamano, updateTamano, deleteTamano } from '../services/tamano.service';
import { Plus, ChevronDown, Package, Tags, Ruler, ChevronRight, Pencil, Trash2, Search, X, CheckCircle, ArrowUpDown, Loader2 } from 'lucide-react';

import '../styles/Catalogos.css'; // 👈 Reutilizamos tu CSS de catálogos para que se vea idéntico

const TABS = [
    { id: 'productos',  label: 'Productos',  icon: <Package size={16} /> },
{ id: 'categorias', label: 'Categorías', icon: <Tags size={16} /> },
{ id: 'tamanos',    label: 'Tamaños',    icon: <Ruler size={16} /> },
];

const COLUMNAS: Record<string, { key: string; label: string; sortable?: boolean }[]> = {
    productos: [
        { key: 'sku',       label: 'SKU',      sortable: true },
        { key: 'nombre',    label: 'Nombre',   sortable: true },
        { key: 'categoria', label: 'Categoría',sortable: true },
        { key: 'tamano',    label: 'Tamaño',   sortable: true },
        { key: 'precio',    label: 'Precio Unit.', sortable: true },
    ],
    categorias: [
        { key: 'id_categoria', label: 'ID' },
        { key: 'nombre',       label: 'Nombre de la Categoría', sortable: true },
    ],
    tamanos: [
        { key: 'id_tamano',    label: 'ID' },
        { key: 'descripcion',  label: 'Descripción del Tamaño', sortable: true },
    ],
};

interface Toast { msg: string; type: 'success' | 'delete' | 'error' }

function ToastPortal({ toast }: { toast: Toast | null }) {
    return createPortal(
        <AnimatePresence>
        {toast && (
            <motion.div className="cat-toast" initial={{ opacity:0, y:-50, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-40, scale:0.9 }} transition={{ type:'spring', stiffness:300, damping:22 }}>
            <span className="cat-toast-icon" style={{ color: toast.type === 'success' ? '#06d6a0' : '#ff5050' }}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <Trash2 size={16} />}
            </span>
            {toast.msg}
            <div className="cat-toast-bar" />
            </motion.div>
        )}
        </AnimatePresence>,
        document.body
    );
}

export default function Inventario() {
    const [tabActiva, setTabActiva] = useState('productos');
    const [dropOpen,  setDropOpen]  = useState(false);
    const [addOpen,   setAddOpen]   = useState(false);

    const [isModalProductoOpen,  setIsModalProductoOpen]  = useState(false);
    const [productoEditando,     setProductoEditando]     = useState<any | null>(null);
    const [isModalCategoriaOpen, setIsModalCategoriaOpen] = useState(false);
    const [categoriaEditando,    setCategoriaEditando]    = useState<any | null>(null);
    const [isModalTamanoOpen,    setIsModalTamanoOpen]    = useState(false);
    const [tamanoEditando,       setTamanoEditando]       = useState<any | null>(null);

    const [datosProductos,  setDatosProductos]  = useState<any[]>([]);
    const [datosCategorias, setDatosCategorias] = useState<any[]>([]);
    const [datosTamanos,    setDatosTamanos]    = useState<any[]>([]);
    const [loadingDatos,    setLoadingDatos]    = useState(false);

    const [search,  setSearch]  = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [toast, setToast] = useState<Toast | null>(null);

    const selectorRef = useRef<HTMLDivElement>(null);
    const addRef      = useRef<HTMLDivElement>(null);

    const tabActual = TABS.find(t => t.id === tabActiva)!;
    const columnas  = COLUMNAS[tabActiva] ?? [];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) setDropOpen(false);
            if (addRef.current      && !addRef.current.contains(e.target as Node))      setAddOpen(false);
        };
            document.addEventListener('mousedown', handler);
            return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (tabActiva === 'productos')  cargarProductos();
        if (tabActiva === 'categorias') cargarCategorias();
        if (tabActiva === 'tamanos')    cargarTamanos();
        setSearch(''); setSortKey(null); setSortAsc(true);
    }, [tabActiva]);

    const showToast = (msg: string, type: Toast['type'] = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2600);
    };

    const handleSort = (key: string) => {
        if (sortKey === key) setSortAsc(v => !v);
        else { setSortKey(key); setSortAsc(true); }
    };

    /* ══ PRODUCTOS CRUD ══ */
    const cargarProductos = async () => {
        setLoadingDatos(true);
        try { setDatosProductos(await getProductos()); } catch (err) { console.error(err); showToast('Error al cargar', 'error'); } finally { setLoadingDatos(false); }
    };
    const handleGuardarProducto = async (data: any) => {
        try {
            if (productoEditando) { await updateProducto({ id_producto: productoEditando.id_producto, ...data }); showToast(`Producto "${data.nombre}" actualizado`); }
            else { await createProducto(data); showToast(`Producto "${data.nombre}" creado`); }
            await cargarProductos(); setProductoEditando(null); setIsModalProductoOpen(false);
        } catch (err: any) { throw err; }
    };
    const handleConfirmDeleteProducto = async (prod: any) => {
        if(window.confirm(`¿Seguro que deseas eliminar el producto ${prod.sku}?`)) {
            try { await deleteProducto(prod.id_producto); showToast(`Producto eliminado`, 'delete'); await cargarProductos(); } catch(err: any) { showToast(err.message, 'error'); }
        }
    };

    /* ══ CATEGORÍAS CRUD ══ */
    const cargarCategorias = async () => {
        setLoadingDatos(true);
        try { setDatosCategorias(await getCategorias()); } catch (err) { console.error(err); showToast('Error al cargar', 'error'); } finally { setLoadingDatos(false); }
    };
    const handleGuardarCategoria = async (data: any) => {
        try {
            if (categoriaEditando) { await updateCategoria({ id_categoria: categoriaEditando.id_categoria, ...data }); showToast(`Categoría actualizada`); }
            else { await createCategoria(data); showToast(`Categoría creada`); }
            await cargarCategorias(); setCategoriaEditando(null); setIsModalCategoriaOpen(false);
        } catch (err: any) { throw err; }
    };
    const handleConfirmDeleteCategoria = async (cat: any) => {
        if(window.confirm(`¿Seguro que deseas eliminar la categoría ${cat.nombre}?`)) {
            try { await deleteCategoria(cat.id_categoria); showToast(`Categoría eliminada`, 'delete'); await cargarCategorias(); } catch(err: any) { showToast(err.message, 'error'); }
        }
    };

    /* ══ TAMAÑOS CRUD ══ */
    const cargarTamanos = async () => {
        setLoadingDatos(true);
        try { setDatosTamanos(await getTamanos()); } catch (err) { console.error(err); showToast('Error al cargar', 'error'); } finally { setLoadingDatos(false); }
    };
    const handleGuardarTamano = async (data: any) => {
        try {
            if (tamanoEditando) { await updateTamano({ id_tamano: tamanoEditando.id_tamano, ...data }); showToast(`Tamaño actualizado`); }
            else { await createTamano(data); showToast(`Tamaño creado`); }
            await cargarTamanos(); setTamanoEditando(null); setIsModalTamanoOpen(false);
        } catch (err: any) { throw err; }
    };
    const handleConfirmDeleteTamano = async (tam: any) => {
        if(window.confirm(`¿Seguro que deseas eliminar el tamaño ${tam.descripcion}?`)) {
            try { await deleteTamano(tam.id_tamano); showToast(`Tamaño eliminado`, 'delete'); await cargarTamanos(); } catch(err: any) { showToast(err.message, 'error'); }
        }
    };

    /* ── Filtered & sorted data ── */
    const datosTablaActual = tabActiva === 'productos' ? datosProductos : tabActiva === 'categorias' ? datosCategorias : tabActiva === 'tamanos' ? datosTamanos : [];

    const datosActuales = datosTablaActual
    .filter(e => {
        const text = tabActiva === 'productos' ? [e.sku, e.nombre, e.categoria?.nombre, e.tamano?.descripcion].join(' ').toLowerCase()
        : tabActiva === 'categorias' ? [e.nombre].join(' ').toLowerCase()
        : tabActiva === 'tamanos' ? [e.descripcion].join(' ').toLowerCase() : '';
        return text.includes(search.toLowerCase());
    })
    .sort((a, b) => {
        if (!sortKey) return 0;
        const val = (obj: any) => {
            if (tabActiva === 'productos') {
                return sortKey === 'categoria' ? obj.categoria?.nombre ?? '' : sortKey === 'tamano' ? obj.tamano?.descripcion ?? '' : sortKey === 'precio' ? obj.precio_unitario ?? 0 : obj[sortKey] ?? '';
            }
            return obj[sortKey] ?? '';
        };
        const vA = val(a), vB = val(b);
        if (typeof vA === 'number' && typeof vB === 'number') return sortAsc ? vA - vB : vB - vA;
        return sortAsc ? String(vA).localeCompare(String(vB)) : String(vB).localeCompare(String(vA));
    });

    return (
        <>
        <ToastPortal toast={toast} />

        <div className="cat-root">
        <UserGreeting />

        {/* Header */}
        <div className="cat-header">
        <div className="cat-header-text">
        <h1>Inventario</h1>
        <p>Controla tus productos, categorías y stock disponible.</p>
        </div>

        <div className="cat-add-wrap" ref={addRef}>
        <motion.button className="cat-add-btn" onClick={() => setAddOpen(v => !v)} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
        <Plus size={17} /> Añadir registro
        <ChevronDown size={14} style={{ transition:'transform .2s', transform: addOpen ? 'rotate(180deg)' : 'none' }} />
        </motion.button>
        <AnimatePresence>
        {addOpen && (
            <motion.div className="cat-add-dropdown" initial={{ opacity:0, y:-10, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-10, scale:0.96 }} transition={{ duration:.18 }}>
            <p className="cat-add-drop-header">¿Qué deseas registrar?</p>
            {TABS.map(tab => (
                <button key={tab.id} className="cat-add-drop-item" onClick={() => {
                    setTabActiva(tab.id); setAddOpen(false);
                    if (tab.id === 'productos') { setProductoEditando(null); setIsModalProductoOpen(true); }
                    if (tab.id === 'categorias') { setCategoriaEditando(null); setIsModalCategoriaOpen(true); }
                    if (tab.id === 'tamanos') { setTamanoEditando(null); setIsModalTamanoOpen(true); }
                }}>
                <span className="cat-add-drop-icon">{tab.icon}</span>
                <span><span className="cat-add-drop-label">{tab.label}</span><span className="cat-add-drop-sub">Nuevo registro</span></span>
                <ChevronRight size={13} className="cat-add-drop-arrow" />
                </button>
            ))}
            </motion.div>
        )}
        </AnimatePresence>
        </div>
        </div>

        {/* Selectores */}
        <div className="cat-selector-wrap" ref={selectorRef}>
        <button className="cat-selector-btn" onClick={() => setDropOpen(v => !v)}>
        <span className="cat-selector-icon">{tabActual.icon}</span>
        <span className="cat-selector-label"><span className="cat-selector-sublabel">Categoría activa</span><span className="cat-selector-name">{tabActual.label}</span></span>
        <ChevronDown size={18} className={`cat-chevron${dropOpen ? ' open' : ''}`} />
        </button>
        <AnimatePresence>
        {dropOpen && (
            <motion.div className="cat-dropdown" initial={{ opacity:0, y:-10, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-10, scale:0.97 }} transition={{ duration:.2 }}>
            {TABS.map(tab => (
                <button key={tab.id} className={`cat-drop-item${tabActiva === tab.id ? ' active' : ''}`} onClick={() => { setTabActiva(tab.id); setDropOpen(false); }}>
                <span className="cat-drop-item-icon">{tab.icon}</span>
                <span className="cat-drop-item-label">{tab.label}</span>
                <ChevronRight size={14} className="cat-drop-check" />
                </button>
            ))}
            </motion.div>
        )}
        </AnimatePresence>
        </div>

        {/* Table */}
        <AnimatePresence mode="wait">
        <motion.div key={tabActiva} className="cat-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:.28 }}>
        <div className="cat-card-header">
        <div className="cat-card-header-left">
        <span className="cat-card-title-icon">{tabActual.icon}</span>
        <span className="cat-card-title">{tabActual.label}</span>
        <span className="cat-count-badge">{datosTablaActual.length} registros</span>
        </div>
        <div className="cat-card-header-right">
        <div className="cat-search-wrap">
        <Search size={13} />
        <input className="cat-search-input" placeholder={`Buscar ${tabActual.label.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(26,0,96,0.3)', padding:0 }}><X size={12} /></button>}
        </div>
        </div>
        </div>

        <div className="cat-table-scroll">
        <table className="cat-table">
        <thead>
        <tr>
        {columnas.map(col => (
            <th key={col.key} className={col.sortable ? 'cat-th-sortable' : ''} onClick={() => col.sortable && handleSort(col.key)}>
            {col.sortable ? <div className="cat-th-inner">{col.label} <ArrowUpDown size={11} className="cat-sort-icon" style={{ opacity: sortKey === col.key ? 1 : 0.35 }} /></div> : col.label}
            </th>
        ))}
        <th style={{ textAlign:'right', paddingRight:20 }}>Acciones</th>
        </tr>
        </thead>
        <tbody>
        {loadingDatos && <tr><td colSpan={columnas.length + 1} style={{ padding:'48px 24px', textAlign:'center' }}><div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, color:'rgba(26,0,96,0.4)' }}><Loader2 size={18} style={{ animation:'cat-spin 1s linear infinite' }} /> <span style={{ fontFamily:'Syne', fontWeight:700, fontSize:13 }}>Cargando...</span></div></td></tr>}

        {/* Productos */}
        {!loadingDatos && tabActiva === 'productos' && datosActuales.map((p, i) => (
            <motion.tr key={p.id_producto} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.03 }}>
            <td style={{ fontWeight: 800, color: '#1a0060' }}>{p.sku}</td>
            <td style={{ fontWeight: 600 }}>{p.nombre}</td>
            <td><span style={{ background:'#cc55ff', color:'#fff', padding:'3px 8px', borderRadius:6, fontSize:10, fontWeight:800 }}>{p.categoria?.nombre || '—'}</span></td>
            <td>{p.tamano?.descripcion || '—'}</td>
            <td style={{ color: '#06d6a0', fontWeight: 'bold' }}>${p.precio_unitario}</td>
            <td>
            <div className="cat-actions">
            <button className="cat-action-btn" title="Editar" onClick={() => { setProductoEditando(p); setIsModalProductoOpen(true); }}><Pencil size={13} /></button>
            <button className="cat-action-btn danger" title="Eliminar" onClick={() => handleConfirmDeleteProducto(p)}><Trash2 size={13} /></button>
            </div>
            </td>
            </motion.tr>
        ))}

        {/* Categorías */}
        {!loadingDatos && tabActiva === 'categorias' && datosActuales.map((c, i) => (
            <motion.tr key={c.id_categoria} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.03 }}>
            <td>#{c.id_categoria}</td>
            <td style={{ fontWeight:600, color:'#1a0060' }}>{c.nombre}</td>
            <td>
            <div className="cat-actions">
            <button className="cat-action-btn" title="Editar" onClick={() => { setCategoriaEditando(c); setIsModalCategoriaOpen(true); }}><Pencil size={13} /></button>
            <button className="cat-action-btn danger" title="Eliminar" onClick={() => handleConfirmDeleteCategoria(c)}><Trash2 size={13} /></button>
            </div>
            </td>
            </motion.tr>
        ))}

        {/* Tamaños */}
        {!loadingDatos && tabActiva === 'tamanos' && datosActuales.map((t, i) => (
            <motion.tr key={t.id_tamano} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.03 }}>
            <td>#{t.id_tamano}</td>
            <td style={{ fontWeight:600, color:'#1a0060' }}>{t.descripcion}</td>
            <td>
            <div className="cat-actions">
            <button className="cat-action-btn" title="Editar" onClick={() => { setTamanoEditando(t); setIsModalTamanoOpen(true); }}><Pencil size={13} /></button>
            <button className="cat-action-btn danger" title="Eliminar" onClick={() => handleConfirmDeleteTamano(t)}><Trash2 size={13} /></button>
            </div>
            </td>
            </motion.tr>
        ))}

        {/* Vacio */}
        {!loadingDatos && datosActuales.length === 0 && (
            <tr>
            <td colSpan={columnas.length + 1} style={{ padding:0, border:'none' }}>
            <div className="cat-empty">
            <div className="cat-empty-icon">{tabActual.icon}</div>
            <p className="cat-empty-title">{search ? 'Sin resultados' : 'Sin registros todavía'}</p>
            {!search && (
                <button className="cat-empty-cta" onClick={() => {
                    if (tabActiva === 'productos') { setProductoEditando(null); setIsModalProductoOpen(true); }
                    if (tabActiva === 'categorias') { setCategoriaEditando(null); setIsModalCategoriaOpen(true); }
                    if (tabActiva === 'tamanos') { setTamanoEditando(null); setIsModalTamanoOpen(true); }
                }}><Plus size={14} /> Añadir {tabActual.label.toLowerCase()}</button>
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

        {/* Modales */}
        <ModalProducto isOpen={isModalProductoOpen} onClose={() => setIsModalProductoOpen(false)} onSave={handleGuardarProducto} productoAEditar={productoEditando} />
        <ModalCategoria isOpen={isModalCategoriaOpen} onClose={() => setIsModalCategoriaOpen(false)} onSave={handleGuardarCategoria} categoriaAEditar={categoriaEditando} />
        <ModalTamano isOpen={isModalTamanoOpen} onClose={() => setIsModalTamanoOpen(false)} onSave={handleGuardarTamano} tamanoAEditar={tamanoEditando} />
        </div>
        </>
    );
}
