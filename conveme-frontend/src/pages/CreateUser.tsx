import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import '../styles/CreateUser.css';

import mascotaImg from '../assets/mascota.jpg';
import letrasImg from '../assets/logob.png';

/* ── SVG Icons ─────────────────────────────── */
const IconUser = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
    </svg>
);
const IconLock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);
const IconShield = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);
const IconEye = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
    </svg>
);
const IconEyeOff = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);
const IconChevron = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 3L5 8L10 13"/>
    </svg>
);
const IconChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6l5 5 5-5"/>
    </svg>
);
const IconRocket = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
);
const IconStar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
);
const IconCrown = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20M4 20L2 8l5 4 5-8 5 8 5-4-2 12H4z"/>
    </svg>
);
const IconTag = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
);
const IconBox = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
);
const IconCheck = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
    </svg>
);

export default function CreateUser() {
    const [username, setUsername]   = useState('');
    const [password, setPassword]   = useState('');
    const [rolId, setRolId]         = useState(1);
    const [showPass, setShowPass]   = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    const { loading, error, exito, crearUsuario, setExito } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fueExitoso = await crearUsuario(username, password, rolId);
        if (fueExitoso) {
            setToastVisible(true);
            setTimeout(() => {
                setUsername('');
                setPassword('');
                setRolId(1);
                setExito(false);
                setToastVisible(false);
            }, 3500);
        }
    };

    const roles = [
        { id: 1, label: 'Administrador',         icon: <IconCrown /> },
        { id: 2, label: 'Vendedor',               icon: <IconTag />   },
        { id: 3, label: 'Logística / Inventario', icon: <IconBox />   },
    ];

    return (
        <>
        {/* ══ TOAST NOTIFICATION ══ */}
        <AnimatePresence>
        {toastVisible && (
            <motion.div
            className="cu-toast"
            initial={{ opacity: 0, y: -80, scale: 0.85 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{ opacity: 0, y: -60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
            {/* Confetti stars */}
            <span className="cu-star cu-star-1"><IconStar /></span>
            <span className="cu-star cu-star-2"><IconStar /></span>
            <span className="cu-star cu-star-3"><IconStar /></span>

            {/* Mascot avatar */}
            <div className="cu-toast-avatar">
            <img src={mascotaImg} alt="Mascota" />
            </div>

            {/* Text */}
            <div className="cu-toast-body">
            <p className="cu-toast-title">
            <span style={{ color: '#06d6a0', display: 'flex' }}><IconCheck /></span> ¡Usuario creado!
            </p>
            <p className="cu-toast-sub">
            <strong style={{ color: '#cc55ff' }}>{username || 'Nuevo usuario'}</strong> ya puede acceder al ERP.
            </p>
            </div>

            {/* Tag */}
            <span className="cu-toast-tag">
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {roles.find(r => r.id === rolId)?.icon}
            {roles.find(r => r.id === rolId)?.label}
            </span>
            </span>

            {/* Progress bar */}
            <div className="cu-toast-bar" />
            </motion.div>
        )}
        </AnimatePresence>

        <div className="cu-root">

        {/* ══ LEFT PANEL ══ */}
        <motion.div
        className="cu-left"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
        <div className="cu-blob cu-blob-1" />
        <div className="cu-blob cu-blob-2" />
        <div className="cu-blob cu-blob-3" />

        <div className="cu-left-content">
        {/* Logo */}
        <motion.div
        className="cu-logo-banner"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        >
        <img src={letrasImg} alt="NoManches Mx" />
        </motion.div>

        {/* Mascot */}
        <motion.div
        className="cu-mascot"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.2 }}
        >
        <img src={mascotaImg} alt="Mascota NoManches" />
        </motion.div>

        {/* Heading */}
        <motion.p
        className="cu-left-heading"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.55 }}
        >
        Nuevo<br />Acceso
        </motion.p>

        <motion.p
        className="cu-left-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.56 }}
        >
        Registra a los miembros de tu equipo y asígnales roles dentro del sistema,
        recuerda decirles que guarden bien su usuario y contraseña
        </motion.p>

        {/* Stats */}
        <motion.div
        className="cu-stats"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        >
        {roles.map((r, i) => (
            <motion.div
            key={r.id}
            className="cu-stat"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.1, type: 'spring', stiffness: 200 }}
            >
            <span className="cu-stat-num">{r.icon}</span>
            <span className="cu-stat-label">{r.label}</span>
            </motion.div>
        ))}
        </motion.div>

        <motion.span
        className="cu-badge"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.85, type: 'spring', stiffness: 200 }}
        >
        © 2026 NoManches Mx
        </motion.span>
        </div>
        </motion.div>

        {/* ══ RIGHT PANEL ══ */}
        <motion.div
        className="cu-right"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
        <div className="cu-accent-br" />

        <div className="cu-card">
        {/* Back */}
        <motion.button
        type="button"
        className="cu-back"
        onClick={() => navigate(-1)}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        >
        <IconChevron /> Regresar
        </motion.button>

        {/* Header */}
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.55 }}
        >
        <p className="cu-eyebrow">Sistema ERP</p>
        <h1 className="cu-title">Crear<br />usuario</h1>
        <p className="cu-subtitle">Completa los datos para registrar un nuevo acceso al sistema.</p>
        <div className="cu-divider" />
        </motion.div>

        {/* Form */}
        <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.44 }}
        >
        {error && <div className="cu-error">{error}</div>}

        <div className="cu-field-group">
        {/* Username */}
        <div>
        <label className="cu-label">
        <IconUser /> Nombre de usuario
        </label>
        <div className="cu-field-wrap">
        <input
        type="text"
        className="cu-input"
        placeholder="ej. ivan_admin"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        disabled={loading}
        autoComplete="username"
        />
        </div>
        </div>

        {/* Password */}
        <div>
        <label className="cu-label">
        <IconLock /> Contraseña
        </label>
        <div className="cu-field-wrap">
        <input
        type={showPass ? 'text' : 'password'}
        className="cu-input"
        placeholder="••••••••"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        disabled={loading}
        autoComplete="new-password"
        />
        <button
        type="button"
        className="cu-pass-toggle"
        onClick={() => setShowPass(v => !v)}
        tabIndex={-1}
        aria-label="Mostrar contraseña"
        >
        {showPass ? <IconEyeOff /> : <IconEye />}
        </button>
        </div>
        </div>

        {/* Rol */}
        <div>
        <label className="cu-label">
        <IconShield /> Rol de acceso
        </label>
        <div className="cu-field-wrap">
        <select
        className="cu-select"
        value={rolId}
        onChange={e => setRolId(Number(e.target.value))}
        disabled={loading}
        >
        {roles.map(r => (
            <option key={r.id} value={r.id}>
            {r.label}
            </option>
        ))}
        </select>
        <span className="cu-select-icon">
        <IconChevronDown />
        </span>
        </div>
        </div>
        </div>

        {/* Submit */}
        <motion.button
        type="submit"
        className={`cu-btn${exito ? ' success' : ''}`}
        disabled={loading || exito}
        whileHover={!loading && !exito ? { scale: 1.01 } : {}}
        whileTap={!loading && !exito ? { scale: 0.97 } : {}}
        >
        {loading ? (
            <><span className="cu-spinner"><IconRocket /></span> Guardando...</>
        ) : exito ? (
            <><IconCheck /> ¡Usuario listo!</>
        ) : (
            <><IconRocket /> Crear usuario</>
        )}
        </motion.button>

        <p className="cu-footer">Acceso restringido al personal autorizado.</p>
        </motion.form>
        </div>
        </motion.div>

        </div>
        </>
    );
}
