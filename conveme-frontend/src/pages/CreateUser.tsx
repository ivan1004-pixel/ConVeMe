import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

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
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

            html, body, #root { width: 100%; height: 100%; overflow: hidden; }

            /* ══ ROOT ══ */
            .cu-root {
                display: grid;
                grid-template-columns: 1fr 1fr;
                width: 100vw;
                height: 100vh;
                font-family: 'DM Sans', sans-serif;
                overflow: hidden;
            }

            /* ══ LEFT PANEL ══ */
            .cu-left {
                position: relative;
                background: #1a0060;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                padding: 48px;
            }
            .cu-left::before {
                content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(204,85,255,0.22) 1.5px, transparent 1.5px);
    background-size: 28px 28px;
    pointer-events: none;
            }

            /* blobs */
            .cu-blob {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
            }
            .cu-blob-1 { width: 320px; height: 320px; top: -90px; right: -90px; background: rgba(204,85,255,0.12); border: 4px solid rgba(204,85,255,0.2); }
            .cu-blob-2 { width: 200px; height: 200px; bottom: -50px; left: -50px; background: rgba(255,225,68,0.08); border: 4px solid rgba(255,225,68,0.15); }
            .cu-blob-3 { width: 90px; height: 90px; bottom: 120px; right: 40px; background: rgba(204,85,255,0.1); border: 3px solid rgba(204,85,255,0.2); }

            .cu-left-content {
                position: relative;
                z-index: 2;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 26px;
                text-align: center;
            }

            /* Logo banner */
            .cu-logo-banner {
                background: #cc55ff;
                border-radius: 20px;
                padding: 14px 28px;
                box-shadow: 6px 6px 0px rgba(0,0,0,0.4);
                border: 2.5px solid rgba(255,255,255,0.15);
            }
            .cu-logo-banner img {
                height: 48px; width: auto; display: block;
                filter: brightness(10);
            }

            /* Mascot */
            @keyframes cu-pulse {
                0%   { transform: scale(1);   opacity: 0.7; }
                100% { transform: scale(1.8); opacity: 0; }
            }
            .cu-mascot {
                position: relative;
                width: 138px; height: 138px;
                border-radius: 50%;
                border: 4px solid #cc55ff;
                overflow: visible;
                box-shadow: 6px 6px 0px rgba(204,85,255,0.5), 0 0 0 6px rgba(204,85,255,0.15);
            }
            .cu-mascot img {
                width: 100%; height: 100%;
                border-radius: 50%;
                object-fit: cover;
                display: block;
            }
            .cu-mascot::after {
                content: '';
    position: absolute; inset: -10px;
    border-radius: 50%;
    border: 3px solid rgba(204,85,255,0.5);
    animation: cu-pulse 2.4s ease-out infinite;
    pointer-events: none;
            }

            /* Badge */
            .cu-badge {
                background: #ffe144;
                border: 2.5px solid rgba(255,255,255,0.25);
                border-radius: 40px;
                padding: 7px 22px;
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 12px;
                color: #1a0060;
                letter-spacing: .08em;
                box-shadow: 3px 3px 0px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .cu-left-heading {
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: clamp(26px, 3vw, 40px);
                color: #fff;
                line-height: 1.1;
                text-shadow: 3px 3px 0px rgba(204,85,255,0.4);
            }
            .cu-left-sub {
                font-size: clamp(12px, 1.1vw, 15px);
                font-weight: 500;
                color: rgba(255,255,255,0.55);
                max-width: 280px;
                line-height: 1.6;
            }

            /* Stats strip */
            .cu-stats {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                justify-content: center;
            }
            .cu-stat {
                background: rgba(255,255,255,0.07);
                border: 1.5px solid rgba(255,255,255,0.12);
                border-radius: 12px;
                padding: 10px 16px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
                min-width: 80px;
            }
            .cu-stat-num {
                color: #cc55ff;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px; height: 36px;
                background: rgba(204,85,255,0.15);
                border-radius: 10px;
                border: 1.5px solid rgba(204,85,255,0.25);
            }
            .cu-stat-label {
                font-size: 10px;
                font-weight: 600;
                color: rgba(255,255,255,0.45);
                letter-spacing: .06em;
                text-transform: uppercase;
            }

            /* ══ RIGHT PANEL ══ */
            .cu-right {
                position: relative;
                background: #ede9fe;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                padding: 48px;
            }
            .cu-right::before {
                content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, #c084fc2a 1.5px, transparent 1.5px);
    background-size: 28px 28px;
    pointer-events: none;
            }
            .cu-right::after {
                content: '';
    position: absolute;
    top: -70px; right: -70px;
    width: 260px; height: 260px;
    border-radius: 50%;
    border: 4px solid rgba(204,85,255,0.15);
    pointer-events: none;
            }
            .cu-accent-br {
                position: absolute;
                bottom: -90px; left: -90px;
                width: 320px; height: 320px;
                border-radius: 50%;
                border: 4px solid rgba(26,0,96,0.07);
                pointer-events: none;
            }

            /* Form card */
            .cu-card {
                position: relative;
                z-index: 2;
                width: 100%;
                max-width: 420px;
                display: flex;
                flex-direction: column;
            }

            /* Back button */
            .cu-back {
                display: inline-flex;
                align-items: center;
                gap: 7px;
                background: none;
                border: none;
                cursor: pointer;
                color: rgba(26,0,96,0.4);
                font-family: 'DM Sans', sans-serif;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: .04em;
                padding: 0;
                margin-bottom: 28px;
                transition: color .18s, transform .18s;
            }
            .cu-back:hover { color: #cc55ff; transform: translateX(-3px); }
            .cu-back:hover svg { transform: translateX(-2px); }
            .cu-back svg { transition: transform .18s; }

            .cu-eyebrow {
                font-family: 'Syne', sans-serif;
                font-weight: 700;
                font-size: 11px;
                letter-spacing: .14em;
                text-transform: uppercase;
                color: #cc55ff;
                margin-bottom: 10px;
            }
            .cu-title {
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: clamp(26px, 3vw, 40px);
                color: #1a0060;
                line-height: 1.05;
                margin-bottom: 12px;
            }
            .cu-subtitle {
                font-size: 14px;
                font-weight: 400;
                color: rgba(26,0,96,0.55);
                margin-bottom: 20px;
                line-height: 1.6;
            }
            .cu-divider {
                width: 48px; height: 4px;
                background: #cc55ff;
                border-radius: 4px;
                margin-bottom: 30px;
            }

            /* Field */
            .cu-field-group { display: flex; flex-direction: column; gap: 16px; margin-bottom: 12px; }
            .cu-label {
                display: flex;
                align-items: center;
                gap: 6px;
                font-family: 'Syne', sans-serif;
                font-weight: 700;
                font-size: 10.5px;
                letter-spacing: .1em;
                text-transform: uppercase;
                color: #1a0060;
                margin-bottom: 6px;
            }
            .cu-label svg { color: #cc55ff; }
            .cu-field-wrap { position: relative; }
            .cu-input {
                width: 100%;
                background: #fff;
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
            .cu-input::placeholder { color: #b9a0d4; font-weight: 400; }
            .cu-input:focus {
                border-color: #cc55ff;
                box-shadow: 0 0 0 3px rgba(204,85,255,0.15), 3px 3px 0px #1a0060;
                background: #fdf6ff;
            }
            .cu-input:disabled { opacity: .6; cursor: not-allowed; }

            /* Select */
            .cu-select {
                width: 100%;
                background: #fff;
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
            .cu-select:focus {
                border-color: #cc55ff;
                box-shadow: 0 0 0 3px rgba(204,85,255,0.15), 3px 3px 0px #1a0060;
                background: #fdf6ff;
            }
            .cu-select:disabled { opacity: .6; cursor: not-allowed; }

            .cu-select-icon {
                position: absolute;
                right: 13px; top: 50%;
                transform: translateY(-50%);
                pointer-events: none;
                color: #b39dcc;
            }

            /* Pass toggle */
            .cu-pass-toggle {
                position: absolute;
                right: 12px; top: 50%;
                transform: translateY(-50%);
                background: none; border: none; cursor: pointer;
                padding: 4px;
                color: #b39dcc;
                display: flex; align-items: center; justify-content: center;
                border-radius: 6px;
                transition: color .18s, background .18s;
            }
            .cu-pass-toggle:hover { color: #7c22cc; background: rgba(204,85,255,0.1); }

            /* Error */
            .cu-error {
                background: #ffe5e8;
                border: 2px solid #ff4d6d;
                border-radius: 10px;
                padding: 10px 14px;
                color: #c1002b;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 14px;
                text-align: center;
            }

            /* Submit button */
            .cu-btn {
                width: 100%;
                background: #1a0060;
                color: #ffe144;
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: 15px;
                letter-spacing: .12em;
                text-transform: uppercase;
                border: 2.5px solid #1a0060;
                border-radius: 14px;
                padding: 16px;
                cursor: pointer;
                box-shadow: 5px 5px 0px rgba(0,0,0,0.35);
                transition: transform .12s, box-shadow .12s, background .2s, color .2s;
                margin-top: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            .cu-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 7px 7px 0px rgba(0,0,0,0.35); }
            .cu-btn:active:not(:disabled) { transform: translate(3px,3px); box-shadow: 2px 2px 0px rgba(0,0,0,0.3); }
            .cu-btn:disabled { opacity: .75; cursor: not-allowed; }
            .cu-btn.success { background: #06d6a0; color: #fff; border-color: #05b589; }

            @keyframes spin { to { transform: rotate(360deg); } }
            .cu-spinner { display: inline-block; animation: spin 1s linear infinite; }

            .cu-footer {
                font-size: 11px; font-weight: 500;
                color: rgba(26,0,96,0.38);
                text-align: center;
                margin-top: 20px;
            }

            /* ══ TOAST ══ */
            .cu-toast {
                position: fixed;
                top: 28px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                background: #fff;
                border: 3px solid #1a0060;
                border-radius: 20px;
                box-shadow: 6px 6px 0px #1a0060, 0 20px 60px rgba(26,0,96,0.25);
                padding: 18px 28px 18px 20px;
                display: flex;
                align-items: center;
                gap: 16px;
                min-width: 320px;
                max-width: 480px;
            }
            .cu-toast-avatar {
                width: 52px; height: 52px;
                border-radius: 50%;
                border: 3px solid #cc55ff;
                overflow: hidden;
                flex-shrink: 0;
                box-shadow: 3px 3px 0px #1a0060;
            }
            .cu-toast-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
            .cu-toast-body { flex: 1; }
            .cu-toast-title {
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: 14px;
                color: #1a0060;
                margin-bottom: 3px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .cu-toast-sub {
                font-size: 12px;
                font-weight: 500;
                color: rgba(26,0,96,0.55);
                line-height: 1.4;
            }
            .cu-toast-tag {
                background: #ffe144;
                border: 2px solid #1a0060;
                border-radius: 8px;
                padding: 6px 12px;
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 11px;
                color: #1a0060;
                flex-shrink: 0;
                box-shadow: 2px 2px 0px #1a0060;
                display: flex;
                align-items: center;
            }

            /* Progress bar inside toast */
            @keyframes cu-progress {
                from { width: 100%; }
                to   { width: 0%; }
            }
            .cu-toast-bar {
                position: absolute;
                bottom: 0; left: 0;
                height: 4px;
                background: linear-gradient(90deg, #cc55ff, #ffe144);
                border-radius: 0 0 17px 17px;
                animation: cu-progress 3.5s linear forwards;
            }

            /* Stars confetti */
            @keyframes cu-float-1 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(-30px,-60px) rotate(180deg);opacity:0} }
            @keyframes cu-float-2 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(20px,-70px) rotate(-120deg);opacity:0} }
            @keyframes cu-float-3 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(40px,-50px) rotate(90deg);opacity:0} }
            .cu-star { position: absolute; pointer-events: none; }
            .cu-star-1 { top: 10px; right: 50px; color: #ffe144; animation: cu-float-1 1.4s ease-out 0.2s forwards; }
            .cu-star-2 { top: 14px; right: 30px; color: #cc55ff; animation: cu-float-2 1.6s ease-out 0.4s forwards; }
            .cu-star-3 { top: 8px;  right: 70px; color: #06d6a0; animation: cu-float-3 1.2s ease-out 0.1s forwards; }

            /* Responsive */
            @media (max-width: 768px) {
                .cu-root { grid-template-columns: 1fr; grid-template-rows: auto 1fr; overflow-y: auto; height: auto; min-height: 100vh; }
                .cu-left { padding: 36px 24px 30px; min-height: auto; }
                .cu-right { padding: 40px 24px; }
                .cu-mascot { width: 100px; height: 100px; }
                html, body, #root { overflow: auto; }
            }
            `}</style>

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
            Registra a los miembros de tu equipo y asígnales roles dentro del sistema.
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
            <IconLock /> Contraseña temporal
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
