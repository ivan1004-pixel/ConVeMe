import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUsuarioPerfil, updateUserService } from '../services/user.service';
import UserGreeting from '../components/ui/UserGreeting';
import {
    Edit2, Save, X, User, Lock, Shield,
    Calendar, CheckCircle, XCircle, ChevronDown,
    AlertTriangle, Star, Truck
} from 'lucide-react';

import '../styles/Profile.css'; // Importamos los estilos aquí
import mascotaImg from '../assets/mascota.jpg';

export default function Profile() {
    const [perfil, setPerfil]           = useState<any>(null);
    const [loading, setLoading]         = useState(true);
    const [isEditing, setIsEditing]     = useState(false);
    const [editUsername, setEditUsername] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editRolId, setEditRolId]     = useState(1);
    const [showPass, setShowPass]       = useState(false);
    const [saving, setSaving]           = useState(false);
    const [errorMsg, setErrorMsg]       = useState<string | null>(null);
    const [savedOk, setSavedOk]         = useState(false);

    const miRol = Number(localStorage.getItem('rol_id'));

    useEffect(() => { cargarPerfil(); }, []);

    const cargarPerfil = async () => {
        try {
            const id   = Number(localStorage.getItem('id_usuario'));
            const data = await getUsuarioPerfil(id);
            setPerfil(data);
            setEditUsername(data.username);
            setEditRolId(data.rol_id);
        } catch (e) {
            console.error('Error al cargar perfil', e);
        } finally {
            setLoading(false);
        }
    };

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg(null);
        try {
            const id          = Number(localStorage.getItem('id_usuario'));
            const passAEnviar = editPassword.trim() !== '' ? editPassword : undefined;
            const updated     = await updateUserService(id, editUsername, passAEnviar, editRolId);
            localStorage.setItem('username', updated.username);
            localStorage.setItem('rol_id',   updated.rol_id.toString());
            setPerfil(updated);
            setIsEditing(false);
            setEditPassword('');
            setSavedOk(true);
            setTimeout(() => setSavedOk(false), 3000);
            window.dispatchEvent(new Event('storage'));
        } catch (err: any) {
            setErrorMsg(err.message || 'Error al actualizar el perfil');
        } finally {
            setSaving(false);
        }
    };

    const rolMap: Record<number, { label: string; color: string; bg: string; icon: JSX.Element }> = {
        1: { label: 'Administrador', color: '#1a0060', bg: '#ffe144', icon: <Shield size={14} /> },
        2: { label: 'Vendedor',      color: '#fff',    bg: '#cc55ff', icon: <Star   size={14} /> },
        3: { label: 'Producción',    color: '#1a0060', bg: '#06d6a0', icon: <Truck  size={14} /> },
    };
    const rolInfo = rolMap[perfil?.rol_id] ?? rolMap[1];

    // SVG eye icons
    const IconEye = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
    );
    const IconEyeOff = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
    );

    if (loading) return (
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:32, fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:18, color:'#1a0060' }}>
        <div style={{ width:20, height:20, border:'3px solid #cc55ff', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
        Cargando perfil...
        </div>
    );

    return (
        <>
        {/* Toast */}
        <AnimatePresence>
        {savedOk && (
            <motion.div
            className="pf-toast"
            initial={{ opacity:0, y:-50, scale:0.9 }}
            animate={{ opacity:1, y:0,   scale:1   }}
            exit={{ opacity:0, y:-40, scale:0.9 }}
            transition={{ type:'spring', stiffness:280, damping:22 }}
            >
            <span className="pf-toast-icon"><CheckCircle size={20} /></span>
            Perfil actualizado correctamente
            </motion.div>
        )}
        </AnimatePresence>

        <div className="pf-root">

        <UserGreeting />

        {/* ── HERO ── */}
        <motion.div
        className="pf-hero"
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
        >
        <div className="pf-hero-blob pf-hero-blob-1" />
        <div className="pf-hero-blob pf-hero-blob-2" />

        {/* Avatar */}
        <div className="pf-avatar-wrap">
        <div className="pf-avatar">
        <img src={mascotaImg} alt="Avatar" />
        </div>
        <div className="pf-avatar-ring" />
        </div>

        {/* Info */}
        <div className="pf-hero-info">
        <span
        className="pf-hero-role"
        style={{ background: rolInfo.bg, color: rolInfo.color }}
        >
        {rolInfo.icon} {rolInfo.label}
        </span>
        <p className="pf-hero-username">{perfil?.username}</p>
        <span className="pf-hero-status">
        <span
        className="pf-status-dot"
        style={{ background: perfil?.activo ? '#06d6a0' : '#ff6b6b' }}
        />
        {perfil?.activo ? 'Cuenta activa' : 'Cuenta inactiva'}
        </span>
        </div>

        {/* Edit / Cancel button */}
        <motion.button
        className={`pf-edit-btn ${isEditing ? 'cancel' : 'edit'}`}
        onClick={() => {
            setIsEditing(v => !v);
            setErrorMsg(null);
            setEditPassword('');
        }}
        whileHover={{ scale:1.02 }}
        whileTap={{ scale:0.97 }}
        >
        {isEditing
            ? <><X size={15} /> Cancelar</>
            : <><Edit2 size={15} /> Editar perfil</>
        }
        </motion.button>
        </motion.div>

        {/* ── CONTENT (read / edit) ── */}
        <AnimatePresence mode="wait">
        {!isEditing ? (

            /* ══ READ VIEW ══ */
            <motion.div
            key="read"
            className="pf-card"
            initial={{ opacity:0, x:-20 }}
            animate={{ opacity:1, x:0  }}
            exit={{ opacity:0, x:20 }}
            transition={{ duration:0.3 }}
            >
            <div className="pf-card-header">
            <div className="pf-card-header-icon"><User size={16} /></div>
            <span className="pf-card-header-title">Información de la cuenta</span>
            </div>
            <div className="pf-card-body">
            {/* Username */}
            <div className="pf-info-block">
            <div className="pf-info-icon"><User size={18} /></div>
            <div className="pf-info-text">
            <span className="pf-info-label">Usuario</span>
            <span className="pf-info-value">{perfil?.username}</span>
            </div>
            </div>

            {/* Role */}
            <div className="pf-info-block">
            <div className="pf-info-icon"><Shield size={18} /></div>
            <div className="pf-info-text">
            <span className="pf-info-label">Rol</span>
            <span className="pf-info-value">{rolInfo.label}</span>
            </div>
            </div>

            {/* Status */}
            <div className="pf-info-block">
            <div className="pf-info-icon" style={{ color: perfil?.activo ? '#06d6a0' : '#ff6b6b', background: perfil?.activo ? 'rgba(6,214,160,0.1)' : 'rgba(255,107,107,0.1)', borderColor: perfil?.activo ? 'rgba(6,214,160,0.2)' : 'rgba(255,107,107,0.2)' }}>
            {perfil?.activo ? <CheckCircle size={18} /> : <XCircle size={18} />}
            </div>
            <div className="pf-info-text">
            <span className="pf-info-label">Estado</span>
            <span className={`pf-info-value ${perfil?.activo ? 'active' : 'inactive'}`}>
            {perfil?.activo ? 'Activa' : 'Inactiva'}
            </span>
            </div>
            </div>

            {/* Member since */}
            <div className="pf-info-block">
            <div className="pf-info-icon"><Calendar size={18} /></div>
            <div className="pf-info-text">
            <span className="pf-info-label">Miembro desde</span>
            <span className="pf-info-value" style={{ fontSize:13 }}>
            {new Date(perfil?.created_at).toLocaleDateString('es-MX', {
                year:'numeric', month:'short', day:'numeric'
            })}
            </span>
            </div>
            </div>
            </div>
            </motion.div>

        ) : (

            /* ══ EDIT VIEW ══ */
            <motion.div
            key="edit"
            className="pf-form-card"
            initial={{ opacity:0, x:20 }}
            animate={{ opacity:1, x:0  }}
            exit={{ opacity:0, x:-20 }}
            transition={{ duration:0.3 }}
            >
            <div className="pf-card-header">
            <div className="pf-card-header-icon" style={{ color:'#ffe144', background:'rgba(255,225,68,0.15)', borderColor:'rgba(255,225,68,0.25)' }}>
            <Edit2 size={16} />
            </div>
            <span className="pf-card-header-title">Editar información</span>
            </div>

            <form onSubmit={handleGuardar} style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:20 }}>
            {errorMsg && (
                <div className="pf-error">
                <AlertTriangle size={16} /> {errorMsg}
                </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {/* Username */}
            <div>
            <label className="pf-field-label"><User size={14} /> Nombre de usuario</label>
            <div className="pf-field-wrap">
            <input
            type="text"
            className="pf-input"
            value={editUsername}
            onChange={e => setEditUsername(e.target.value)}
            required
            disabled={saving}
            autoComplete="username"
            />
            </div>
            </div>

            {/* Password */}
            <div>
            <label className="pf-field-label"><Lock size={14} /> Nueva contraseña</label>
            <p className="pf-hint">Dejar en blanco para no cambiar</p>
            <div className="pf-field-wrap">
            <input
            type={showPass ? 'text' : 'password'}
            className="pf-input"
            placeholder="••••••••"
            value={editPassword}
            onChange={e => setEditPassword(e.target.value)}
            disabled={saving}
            autoComplete="new-password"
            />
            <button
            type="button"
            className="pf-pass-toggle"
            onClick={() => setShowPass(v => !v)}
            tabIndex={-1}
            >
            {showPass ? <IconEyeOff /> : <IconEye />}
            </button>
            </div>
            </div>

            {/* Rol (admin only) */}
            {miRol === 1 && (
                <div style={{ gridColumn:'1 / -1' }}>
                <label className="pf-field-label"><Shield size={14} /> Rol de acceso</label>
                <div className="pf-field-wrap">
                <select
                className="pf-select"
                value={editRolId}
                onChange={e => setEditRolId(Number(e.target.value))}
                disabled={saving}
                >
                <option value={1}>Administrador</option>
                <option value={2}>Vendedor</option>
                <option value={3}>Producción</option>
                </select>
                <span className="pf-select-icon"><ChevronDown size={16} /></span>
                </div>
                </div>
            )}
            </div>

            <motion.button
            type="submit"
            className="pf-save-btn"
            disabled={saving}
            whileHover={!saving ? { scale:1.01 } : {}}
            whileTap={!saving ? { scale:0.97 } : {}}
            >
            {saving
                ? <><span className="pf-spinner"><Save size={16} /></span> Guardando...</>
                : <><Save size={17} /> Guardar cambios</>
            }
            </motion.button>
            </form>
            </motion.div>
        )}
        </AnimatePresence>

        </div>
        </>
    );
}
