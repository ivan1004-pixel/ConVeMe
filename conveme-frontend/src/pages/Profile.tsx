import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUsuarioPerfil, updateUserService } from '../services/user.service';
import UserGreeting from '../components/ui/UserGreeting';
import {
    Edit2, Save, X, User, Lock, Shield,
    Calendar, CheckCircle, XCircle, ChevronDown,
    AlertTriangle, Star, Truck
} from 'lucide-react';

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
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

            .pf-root {
                display: flex;
                flex-direction: column;
                gap: 28px;
                max-width: 860px;
                font-family: 'DM Sans', sans-serif;
            }

            /* ══ HERO CARD ══ */
            .pf-hero {
                position: relative;
                background: #1a0060;
                border: 3px solid #1a0060;
                border-radius: 28px;
                overflow: hidden;
                box-shadow: 7px 7px 0px #1a0060;
                display: flex;
                align-items: center;
                gap: 28px;
                padding: 32px 36px;
            }
            .pf-hero::before {
                content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(204,85,255,0.2) 1.5px, transparent 1.5px);
    background-size: 22px 22px;
    pointer-events: none;
            }
            .pf-hero-blob {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
            }
            .pf-hero-blob-1 { width: 260px; height: 260px; top:-80px; right:-60px; background:rgba(204,85,255,0.1); border:3px solid rgba(204,85,255,0.15); }
            .pf-hero-blob-2 { width: 130px; height: 130px; bottom:-40px; left:180px; background:rgba(255,225,68,0.06); border:2px solid rgba(255,225,68,0.1); }

            /* Avatar */
            @keyframes pf-pulse { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.7);opacity:0} }
            .pf-avatar-wrap {
                position: relative;
                flex-shrink: 0;
                z-index: 2;
            }
            .pf-avatar {
                width: 100px; height: 100px;
                border-radius: 50%;
                border: 4px solid #cc55ff;
                overflow: hidden;
                box-shadow: 6px 6px 0px rgba(0,0,0,0.4), 0 0 0 6px rgba(204,85,255,0.15);
            }
            .pf-avatar img { width:100%;height:100%;object-fit:cover;display:block; }
            .pf-avatar-ring {
                position: absolute; inset:-8px;
                border-radius: 50%;
                border: 2.5px solid rgba(204,85,255,0.5);
                animation: pf-pulse 2.5s ease-out infinite;
                pointer-events: none;
            }

            /* Hero text */
            .pf-hero-info {
                position: relative;
                z-index: 2;
                flex: 1;
                min-width: 0;
            }
            .pf-hero-role {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                border-radius: 8px;
                padding: 4px 12px;
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 10px;
                letter-spacing: .1em;
                text-transform: uppercase;
                margin-bottom: 10px;
            }
            .pf-hero-username {
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: clamp(22px, 3vw, 34px);
                color: #fff;
                line-height: 1.05;
                margin-bottom: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .pf-hero-status {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                font-weight: 600;
                color: rgba(255,255,255,0.5);
            }
            .pf-status-dot {
                width: 8px; height: 8px;
                border-radius: 50%;
            }

            /* Edit/cancel button on hero */
            .pf-edit-btn {
                position: relative;
                z-index: 2;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                border-radius: 14px;
                border: 2.5px solid;
                padding: 10px 20px;
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 12px;
                letter-spacing: .08em;
                text-transform: uppercase;
                cursor: pointer;
                transition: transform .12s, box-shadow .12s;
                box-shadow: 4px 4px 0px rgba(0,0,0,0.35);
                flex-shrink: 0;
                align-self: flex-start;
            }
            .pf-edit-btn:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px rgba(0,0,0,0.35); }
            .pf-edit-btn:active { transform: translate(2px,2px); box-shadow: 2px 2px 0px rgba(0,0,0,0.3); }
            .pf-edit-btn.edit  { background:#ffe144; color:#1a0060; border-color:rgba(255,225,68,0.5); }
            .pf-edit-btn.cancel{ background:rgba(255,80,80,0.18); color:#ff8080; border-color:rgba(255,80,80,0.4); }

            /* ══ INFO CARD (read view) ══ */
            .pf-card {
                background: #fff;
                border: 3px solid #1a0060;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 6px 6px 0px #1a0060;
            }
            .pf-card-header {
                padding: 20px 28px;
                border-bottom: 2px solid rgba(26,0,96,0.08);
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(237,233,254,0.5);
            }
            .pf-card-header-icon {
                width: 32px; height: 32px;
                border-radius: 10px;
                background: rgba(204,85,255,0.12);
                border: 1.5px solid rgba(204,85,255,0.2);
                display: flex; align-items: center; justify-content: center;
                color: #cc55ff;
            }
            .pf-card-header-title {
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 12px;
                letter-spacing: .1em;
                text-transform: uppercase;
                color: rgba(26,0,96,0.5);
            }
            .pf-card-body {
                padding: 24px 28px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .pf-info-block {
                background: #faf5ff;
                border: 2px solid rgba(26,0,96,0.08);
                border-radius: 16px;
                padding: 16px 18px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .pf-info-icon {
                width: 38px; height: 38px;
                border-radius: 12px;
                background: rgba(204,85,255,0.1);
                border: 1.5px solid rgba(204,85,255,0.18);
                display: flex; align-items: center; justify-content: center;
                color: #cc55ff;
                flex-shrink: 0;
            }
            .pf-info-text { display: flex; flex-direction: column; min-width:0; }
            .pf-info-label {
                font-family: 'Syne', sans-serif;
                font-weight: 700;
                font-size: 9.5px;
                letter-spacing: .12em;
                text-transform: uppercase;
                color: rgba(26,0,96,0.4);
                margin-bottom: 3px;
            }
            .pf-info-value {
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 15px;
                color: #1a0060;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .pf-info-value.active { color: #06d6a0; }
            .pf-info-value.inactive { color: #ff6b6b; }

            /* ══ FORM CARD (edit view) ══ */
            .pf-form-card {
                background: #fff;
                border: 3px solid #1a0060;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 6px 6px 0px #1a0060;
            }

            /* Field */
            .pf-field-label {
                display: flex;
                align-items: center;
                gap: 6px;
                font-family: 'Syne', sans-serif;
                font-weight: 700;
                font-size: 10.5px;
                letter-spacing: .1em;
                text-transform: uppercase;
                color: #1a0060;
                margin-bottom: 8px;
            }
            .pf-field-label svg { color: #cc55ff; }
            .pf-field-wrap { position: relative; }
            .pf-input {
                width: 100%;
                background: #faf5ff;
                border: 2.5px solid #d4b8f0;
                border-radius: 12px;
                padding: 13px 42px 13px 16px;
                font-family: 'DM Sans', sans-serif;
                font-size: 14px;
                font-weight: 500;
                color: #1a0060;
                outline: none;
                transition: border-color .18s, box-shadow .18s, background .18s;
            }
            .pf-input::placeholder { color: #b9a0d4; font-weight: 400; }
            .pf-input:focus {
                border-color: #cc55ff;
                box-shadow: 0 0 0 3px rgba(204,85,255,0.15), 3px 3px 0px #1a0060;
                background: #fff;
            }
            .pf-input:disabled { opacity:.6; cursor:not-allowed; }

            .pf-select {
                width: 100%;
                background: #faf5ff;
                border: 2.5px solid #d4b8f0;
                border-radius: 12px;
                padding: 13px 42px 13px 16px;
                font-family: 'DM Sans', sans-serif;
                font-size: 14px;
                font-weight: 500;
                color: #1a0060;
                outline: none;
                appearance: none;
                cursor: pointer;
                transition: border-color .18s, box-shadow .18s, background .18s;
            }
            .pf-select:focus {
                border-color: #cc55ff;
                box-shadow: 0 0 0 3px rgba(204,85,255,0.15), 3px 3px 0px #1a0060;
                background: #fff;
            }
            .pf-select-icon {
                position: absolute; right:13px; top:50%;
                transform: translateY(-50%);
                pointer-events: none; color: #b39dcc;
                display: flex;
            }
            .pf-pass-toggle {
                position: absolute; right:12px; top:50%;
                transform: translateY(-50%);
                background:none; border:none; cursor:pointer;
                padding:4px; color:#b39dcc;
                display:flex; align-items:center; justify-content:center;
                border-radius:6px;
                transition: color .18s, background .18s;
            }
            .pf-pass-toggle:hover { color:#7c22cc; background:rgba(204,85,255,0.1); }

            /* Error */
            .pf-error {
                background: #ffe5e8;
                border: 2px solid #ff4d6d;
                border-radius: 12px;
                padding: 12px 16px;
                color: #c1002b;
                font-size: 13px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* Save button */
            .pf-save-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                width: 100%;
                background: #06d6a0;
                color: #fff;
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: 15px;
                letter-spacing: .1em;
                text-transform: uppercase;
                border: 2.5px solid #1a0060;
                border-radius: 14px;
                padding: 16px;
                cursor: pointer;
                box-shadow: 5px 5px 0px #1a0060;
                transition: transform .12s, box-shadow .12s;
            }
            .pf-save-btn:hover:not(:disabled) { transform:translate(-2px,-2px); box-shadow:7px 7px 0px #1a0060; }
            .pf-save-btn:active:not(:disabled) { transform:translate(3px,3px);  box-shadow:2px 2px 0px #1a0060; }
            .pf-save-btn:disabled { opacity:.7; cursor:not-allowed; }

            @keyframes pf-spin { to { transform: rotate(360deg); } }
            .pf-spinner { display:inline-block; animation:pf-spin 1s linear infinite; }

            /* Toast */
            .pf-toast {
                position: fixed;
                top: 28px; left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                background: #fff;
                border: 3px solid #1a0060;
                border-radius: 18px;
                padding: 14px 24px;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 6px 6px 0px #1a0060;
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 14px;
                color: #1a0060;
                white-space: nowrap;
            }
            .pf-toast-icon { color: #06d6a0; display:flex; }

            /* Optional divider between hint and field */
            .pf-hint {
                font-size: 10.5px;
                font-weight: 500;
                color: rgba(26,0,96,0.4);
                margin-top: -4px;
                margin-bottom: 2px;
            }

            @media (max-width: 640px) {
                .pf-hero { flex-wrap: wrap; }
                .pf-card-body { grid-template-columns: 1fr; }
            }
            `}</style>

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
