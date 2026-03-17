import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

import mascotaImg from '../assets/mascota.jpg';
import letrasImg from '../assets/logob.png';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const { loading, error, exito, iniciarSesion } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // ESTO LLAMA A LA LÓGICA REAL DEL HOOK
        const fueExitoso = await iniciarSesion(username, password);
        if (fueExitoso) {
            setTimeout(() => navigate('/dashboard'), 2000);
        }
    };

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

            html, body, #root {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            /* ══════════════════════════════
             *              ROOT — full viewport split
             *           ══════════════════════════════ */
            .login-root {
                display: grid;
                grid-template-columns: 1fr 1fr;
                width: 100vw;
                height: 100vh;
                font-family: 'DM Sans', sans-serif;
                overflow: hidden;
            }

            /* ══════════════════════════════
             *              LEFT PANEL
             *           ══════════════════════════════ */
            .panel-left {
                position: relative;
                background: #cc55ff;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                padding: 48px;
            }

            /* Dot-grid background */
            .panel-left::before {
                content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.25) 1.5px, transparent 1.5px);
    background-size: 28px 28px;
    pointer-events: none;
            }

            /* Decorative blobs */
            .blob {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
            }
            .blob-1 {
                width: 340px; height: 340px;
                background: rgba(255,255,255,0.12);
                top: -80px; left: -80px;
                border: 4px solid rgba(255,255,255,0.18);
            }
            .blob-2 {
                width: 220px; height: 220px;
                background: rgba(26,0,96,0.12);
                bottom: -60px; right: -60px;
                border: 4px solid rgba(26,0,96,0.14);
            }
            .blob-3 {
                width: 120px; height: 120px;
                background: rgba(255,225,68,0.18);
                bottom: 100px; left: 40px;
                border: 3px solid rgba(255,225,68,0.28);
            }

            .left-content {
                position: relative;
                z-index: 2;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 28px;
                text-align: center;
            }

            /* Logo banner */
            .logo-banner {
                background: #1a0060;
                border-radius: 20px;
                padding: 16px 32px;
                box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
            }
            .logo-banner img {
                height: 52px;
                width: auto;
                display: block;
                filter: brightness(10);
            }

            /* Mascot */
            @keyframes pulse-ring {
                0%   { transform: scale(1);   opacity: 0.7; }
                100% { transform: scale(1.7); opacity: 0; }
            }
            .mascot-wrap {
                position: relative;
                width: 148px;
                height: 148px;
                border-radius: 50%;
                border: 4px solid #1a0060;
                background: #fff;
                overflow: visible;
                box-shadow: 6px 6px 0px #1a0060, 0 0 0 6px rgba(255,255,255,0.3);
            }
            .mascot-wrap img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
                display: block;
            }
            .mascot-wrap::after {
                content: '';
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.6);
    animation: pulse-ring 2.4s ease-out infinite;
    pointer-events: none;
            }

            /* Welcome text */
            .welcome-heading {
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: clamp(28px, 3.5vw, 44px);
                color: #1a0060;
                line-height: 1.1;
                text-shadow: 3px 3px 0px rgba(255,255,255,0.35);
            }
            .welcome-sub {
                font-size: clamp(13px, 1.2vw, 16px);
                font-weight: 500;
                color: rgba(26,0,96,0.7);
                max-width: 280px;
                line-height: 1.55;
            }

            /* Tag pill */
            .tag-pill {
                background: #ffe144;
                border: 2.5px solid #1a0060;
                border-radius: 40px;
                padding: 6px 20px;
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 12px;
                color: #1a0060;
                letter-spacing: .08em;
                box-shadow: 3px 3px 0px #1a0060;
            }

            /* ══════════════════════════════
             *              RIGHT PANEL
             *           ══════════════════════════════ */
            .panel-right {
                position: relative;
                background: #ede9fe;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                padding: 48px;
            }

            /* Subtle dot grid on right too */
            .panel-right::before {
                content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, #c084fc33 1.5px, transparent 1.5px);
    background-size: 28px 28px;
    pointer-events: none;
            }

            /* Decorative corner accent */
            .panel-right::after {
                content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 240px; height: 240px;
    border-radius: 50%;
    border: 4px solid rgba(204,85,255,0.18);
    pointer-events: none;
            }

            .corner-accent-br {
                position: absolute;
                bottom: -80px; left: -80px;
                width: 300px; height: 300px;
                border-radius: 50%;
                border: 4px solid rgba(204,85,255,0.12);
                pointer-events: none;
            }

            /* Form card */
            .form-card {
                position: relative;
                z-index: 2;
                width: 100%;
                max-width: 400px;
                display: flex;
                flex-direction: column;
                gap: 0;
            }

            /* Back button */
            .btn-back {
                display: inline-flex;
                align-items: center;
                gap: 7px;
                background: none;
                border: none;
                cursor: pointer;
                color: rgba(26,0,96,0.45);
                font-family: 'DM Sans', sans-serif;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: .04em;
                padding: 0;
                margin-bottom: 32px;
                transition: color .18s, transform .18s;
            }
            .btn-back:hover {
                color: #cc55ff;
                transform: translateX(-3px);
            }
            .btn-back svg {
                transition: transform .18s;
            }
            .btn-back:hover svg {
                transform: translateX(-2px);
            }

            .form-eyebrow {
                font-family: 'Syne', sans-serif;
                font-weight: 700;
                font-size: 11px;
                letter-spacing: .14em;
                text-transform: uppercase;
                color: #cc55ff;
                margin-bottom: 10px;
            }

            .form-title {
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: clamp(28px, 3vw, 42px);
                color: #1a0060;
                line-height: 1.05;
                margin-bottom: 14px;
            }

            .form-subtitle {
                font-size: 14px;
                font-weight: 400;
                color: rgba(26,0,96,0.55);
                margin-bottom: 22px;
                line-height: 1.6;
                max-width: 320px;
            }

            /* Divider */
            .form-divider {
                width: 48px;
                height: 4px;
                background: #cc55ff;
                border-radius: 4px;
                margin-bottom: 36px;
            }

            /* Fields */
            .field-group {
                display: flex;
                flex-direction: column;
                gap: 18px;
                margin-bottom: 12px;
            }

            .field-label {
                display: block;
                font-family: 'Syne', sans-serif;
                font-weight: 700;
                font-size: 10.5px;
                letter-spacing: .1em;
                text-transform: uppercase;
                color: #1a0060;
                margin-bottom: 6px;
            }

            .field-wrap { position: relative; }

            .field-input {
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
            .field-input::placeholder { color: #b9a0d4; font-weight: 400; }
            .field-input:focus {
                border-color: #cc55ff;
                box-shadow: 0 0 0 3px rgba(204,85,255,0.15), 3px 3px 0px #1a0060;
                background: #fdf6ff;
            }
            .field-input:disabled { opacity: .6; cursor: not-allowed; }

            .pass-toggle {
                position: absolute;
                right: 12px; top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: #b39dcc;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                transition: color .18s, background .18s;
            }
            .pass-toggle:hover {
                color: #7c22cc;
                background: rgba(204,85,255,0.1);
            }

            .forgot-link {
                text-align: right;
                font-size: 11.5px;
                font-weight: 600;
                color: #7c22cc;
                text-decoration: underline dotted;
                cursor: pointer;
                transition: opacity .15s;
                margin-top: -10px;
                margin-bottom: 8px;
                display: block;
            }
            .forgot-link:hover { opacity: .7; }

            /* Error */
            .error-msg {
                background: #ffe5e8;
                border: 2px solid #ff4d6d;
                border-radius: 10px;
                padding: 10px 14px;
                color: #c1002b;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 4px;
                text-align: center;
            }

            /* Button */
            .btn-login {
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
                margin-top: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .btn-login:hover:not(:disabled) {
                transform: translate(-2px, -2px);
                box-shadow: 7px 7px 0px rgba(0,0,0,0.35);
            }
            .btn-login:active:not(:disabled) {
                transform: translate(3px, 3px);
                box-shadow: 2px 2px 0px rgba(0,0,0,0.3);
            }
            .btn-login:disabled { opacity: .75; cursor: not-allowed; }
            .btn-login.success { background: #06d6a0; color: #fff; border-color: #05b589; }

            @keyframes spin { to { transform: rotate(360deg); } }
            .spinner { display: inline-block; animation: spin 1s linear infinite; }

            .form-footer {
                font-size: 11px;
                font-weight: 500;
                color: rgba(26,0,96,0.4);
                text-align: center;
                margin-top: 22px;
            }

            /* ══════════════════════════════
             *              SUCCESS OVERLAY
             *           ══════════════════════════════ */
            .success-overlay {
                position: fixed;
                inset: 0;
                background: rgba(237,233,254,0.97);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 14px;
                z-index: 999;
            }

            @keyframes dot-bounce {
                0%,80%,100% { transform: translateY(0);  opacity: .4; }
                40%          { transform: translateY(-6px); opacity: 1; }
            }
            .dot { display: inline-block; animation: dot-bounce 1.2s ease-in-out infinite; }
            .dot:nth-child(2) { animation-delay: .2s; }
            .dot:nth-child(3) { animation-delay: .4s; }

            /* ══════════════════════════════
             *              RESPONSIVE — stack on mobile
             *           ══════════════════════════════ */
            @media (max-width: 768px) {
                .login-root {
                    grid-template-columns: 1fr;
                    grid-template-rows: auto 1fr;
                    overflow-y: auto;
                    height: auto;
                    min-height: 100vh;
                }
                .panel-left {
                    padding: 36px 24px 32px;
                    min-height: auto;
                }
                .mascot-wrap {
                    width: 110px;
                    height: 110px;
                }
                .welcome-heading { font-size: 28px; }
                .panel-right {
                    padding: 40px 24px;
                }
                html, body, #root { overflow: auto; }
            }
            `}</style>

            {/* SUCCESS OVERLAY */}
            <AnimatePresence>
            {exito && (
                <motion.div
                className="success-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                >
                <motion.span
                style={{ fontSize: 80 }}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: [0, 1.3, 1], rotate: [0, 14, 0] }}
                transition={{ type: 'spring', stiffness: 240, damping: 12, delay: 0.1 }}
                >
                🎉
                </motion.span>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 28, color: '#1a0060' }}>
                ¡Acceso Concedido!
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(26,0,96,0.55)', fontWeight: 500 }}>
                Cargando ERP<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                </p>
                </motion.div>
            )}
            </AnimatePresence>

            <div className="login-root">

            {/* ══ LEFT PANEL ══ */}
            <motion.div
            className="panel-left"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />

            <div className="left-content">
            {/* Logo */}
            <motion.div
            className="logo-banner"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            >
            <img src={letrasImg} alt="NoManches Mx" />
            </motion.div>

            {/* Mascot */}
            <motion.div
            className="mascot-wrap"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.2 }}
            >
            <img src={mascotaImg} alt="Mascota NoManches" />
            </motion.div>

            {/* Heading */}
            <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.55 }}
            >
            <p className="welcome-heading">¡Hola,<br />NoMancherito!</p>
            </motion.div>

            <motion.p
            className="welcome-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.56 }}
            >
            Tu ERP favorito te espera. Inicia sesión para continuar.
            </motion.p>

            <motion.span
            className="tag-pill"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65, type: 'spring', stiffness: 200 }}
            >
            © 2026 NoManches Mx
            </motion.span>
            </div>
            </motion.div>

            {/* ══ RIGHT PANEL ══ */}
            <motion.div
            className="panel-right"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
            <div className="corner-accent-br" />

            <div className="form-card">
            {/* Back button */}
            <motion.button
            type="button"
            className="btn-back"
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Regresar
            </motion.button>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55 }}
            >
            <p className="form-eyebrow">Sistema ERP</p>
            <h1 className="form-title">Iniciar<br />sesión</h1>
            <p className="form-subtitle">Ingresa tus credenciales para acceder al sistema.</p>
            <div className="form-divider" />
            </motion.div>

            <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
            >
            {error && (
                <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>
            )}

            <div className="field-group">
            {/* Usuario */}
            <div>
            <label className="field-label">Usuario</label>
            <div className="field-wrap">
            <input
            type="text"
            className="field-input"
            placeholder="tu_usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={loading || exito}
            autoComplete="username"
            />
            </div>
            </div>

            {/* Contraseña */}
            <div>
            <label className="field-label">Contraseña</label>
            <div className="field-wrap">
            <input
            type={showPass ? 'text' : 'password'}
            className="field-input"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading || exito}
            autoComplete="current-password"
            />
            <button
            type="button"
            className="pass-toggle"
            onClick={() => setShowPass(v => !v)}
            tabIndex={-1}
            aria-label="Mostrar contraseña"
            >
            {showPass ? (
                /* Eye-off icon */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
            ) : (
                /* Eye icon */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
                </svg>
            )}
            </button>
            </div>
            </div>
            </div>

            <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>

            <motion.button
            type="submit"
            className={`btn-login${exito ? ' success' : ''}`}
            disabled={loading || exito}
            whileHover={!loading && !exito ? { scale: 1.01 } : {}}
            whileTap={!loading && !exito ? { scale: 0.97 } : {}}
            >
            {loading ? (
                <><span className="spinner">⚙️</span> Verificando...</>
            ) : exito ? (
                <> ¡Listo!</>
            ) : (
                <>Entrar →</>
            )}
            </motion.button>

            <p className="form-footer">Acceso restringido al personal autorizado.</p>
            </motion.form>
            </div>
            </motion.div>

            </div>
            </>
    );
}
