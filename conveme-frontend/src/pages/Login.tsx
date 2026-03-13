import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import mascotaImg from '../assets/mascota.jpg';
import letrasImg from '../assets/logob.png';

export default function Login() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);
    const [exito, setExito]       = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setExito(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        }, 1500);
    };

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

            .login-root {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'DM Sans', sans-serif;
                padding: 20px;
                background-color: #ede9fe;
                background-image: radial-gradient(circle, #c084fc44 1.5px, transparent 1.5px);
                background-size: 28px 28px;
            }

            /* ── PHONE SHELL ── */
            .phone {
                position: relative;
                width: 340px;
                min-height: 680px;
                background: #cc55ff;
                border-radius: 44px;
                border: 4px solid #1a0060;
                box-shadow:
                0 0 0 7px #e8b4ff,
                0 0 0 11px #1a0060,
                18px 22px 0px #1a0060,
                28px 32px 50px rgba(100,0,200,0.3);
                overflow: hidden;
                display: flex;
            }

            /* ── LEFT COLUMN ── */
            .left-col {
                width: 68px;
                flex-shrink: 0;
                background: #cc55ff;
                display: flex;
                align-items: center;
                justify-content: center;
                border-right: 3px solid rgba(26,0,96,0.2);
                position: relative;
                z-index: 2;
                overflow: hidden;
            }

            /* Deco circles on left */
            .left-col::before {
                content: '';
    position: absolute;
    top: 28px; left: 50%;
    transform: translateX(-50%);
    width: 46px; height: 46px;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.3);
    pointer-events: none;
            }
            .left-col::after {
                content: '';
    position: absolute;
    bottom: 36px; left: 50%;
    transform: translateX(-50%);
    width: 28px; height: 28px;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.25);
    pointer-events: none;
            }

            .logo-img {
                /* Fit the full logo text vertically rotated */
                width: 580px;
                max-width: none;
                height: 60px;
                object-fit: contain;
                object-position: center;
                transform: rotate(-90deg);
                filter: drop-shadow(2px 3px 0px rgba(26,0,96,0.55));
            }

            /* ── RIGHT COLUMN ── */
            .right-col {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 26px 20px 22px 14px;
                position: relative;
                overflow: hidden;
            }

            /* Big circle deco behind form */
            .right-col::before {
                content: '';
    position: absolute;
    bottom: -50px; right: -50px;
    width: 170px; height: 170px;
    border-radius: 50%;
    border: 4px solid rgba(255,255,255,0.25);
    pointer-events: none;
            }
            .right-col::after {
                content: '';
    position: absolute;
    bottom: 30px; right: 24px;
    width: 80px; height: 80px;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.18);
    pointer-events: none;
            }

            /* ── MASCOT ── */
            .mascot-wrap {
                position: relative;
                width: 96px;
                height: 96px;
                border-radius: 50%;
                border: 3.5px solid #1a0060;
                background: #fff;
                overflow: hidden;
                box-shadow: 4px 4px 0px #1a0060, 0 0 0 5px rgba(255,255,255,0.35);
            }
            .mascot-wrap img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            @keyframes pulse-ring {
                0%   { transform: scale(1);   opacity: 0.65; }
                100% { transform: scale(1.6); opacity: 0; }
            }
            .mascot-wrap::after {
                content: '';
    position: absolute;
    inset: -7px;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.6);
    animation: pulse-ring 2.3s ease-out infinite;
    pointer-events: none;
            }

            /* ── WELCOME BADGE ── */
            .welcome-badge {
                position: relative;
                background: #ffe144;
                border: 2.5px solid #1a0060;
                border-radius: 12px;
                box-shadow: 3px 3px 0px #1a0060;
                padding: 8px 22px;
                margin: 12px 0 4px;
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 13px;
                color: #1a0060;
                text-align: center;
                line-height: 1.3;
            }
            .welcome-badge::before,
            .welcome-badge::after {
                content: '';
    position: absolute;
    top: 50%; transform: translateY(-50%);
    width: 13px; height: 13px;
    border-radius: 50%;
    background: #cc55ff;
    border: 2.5px solid #1a0060;
            }
            .welcome-badge::before { left: -7px; }
            .welcome-badge::after  { right: -7px; }

            /* ── TITLE ── */
            .section-title {
                font-family: 'Syne', sans-serif;
                font-weight: 700;
                font-size: 15px;
                color: #1a0060;
                align-self: flex-start;
                margin: 14px 0 10px;
            }

            /* ── FORM ── */
            .form-wrap {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .field-label {
                display: block;
                font-family: 'Syne', sans-serif;
                font-weight: 700;
                font-size: 10px;
                letter-spacing: .09em;
                text-transform: uppercase;
                color: #1a0060;
                margin-bottom: 4px;
            }

            .field-wrap { position: relative; }

            .field-input {
                width: 100%;
                background: #f3e8ff;
                border: 2.5px solid #1a0060;
                border-radius: 10px;
                padding: 10px 36px 10px 12px;
                font-family: 'DM Sans', sans-serif;
                font-size: 13px;
                font-weight: 500;
                color: #1a0060;
                outline: none;
                box-shadow: 2px 2px 0px #1a0060;
                transition: background .15s, border-color .15s, box-shadow .15s;
            }
            .field-input::placeholder { color: #a78abe; font-weight: 400; }
            .field-input:focus {
                background: #fff;
                border-color: #7c22cc;
                box-shadow: 3px 3px 0px #7c22cc;
            }
            .field-input:disabled { opacity: .6; cursor: not-allowed; }

            .pass-toggle {
                position: absolute;
                right: 10px; top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                line-height: 1;
                padding: 2px;
                color: #7c22cc;
            }

            .forgot-link {
                text-align: right;
                font-family: 'DM Sans', sans-serif;
                font-size: 11px;
                font-weight: 600;
                color: #1a0060;
                text-decoration: underline dotted;
                cursor: pointer;
                opacity: .7;
                transition: opacity .15s;
                margin-top: -4px;
            }
            .forgot-link:hover { opacity: 1; }

            /* ── BUTTON ── */
            .btn-login {
                width: 100%;
                background: #1a0060;
                color: #ffe144;
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: 14px;
                letter-spacing: .14em;
                text-transform: uppercase;
                border: 2.5px solid #1a0060;
                border-radius: 12px;
                padding: 13px;
                cursor: pointer;
                box-shadow: 4px 4px 0px rgba(0,0,0,0.4);
                transition: transform .12s, box-shadow .12s, background .18s;
                margin-top: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .btn-login:hover:not(:disabled) {
                transform: translate(-2px,-2px);
                box-shadow: 6px 6px 0px rgba(0,0,0,0.4);
            }
            .btn-login:active:not(:disabled) {
                transform: translate(3px,3px);
                box-shadow: 1px 1px 0px rgba(0,0,0,0.4);
            }
            .btn-login:disabled { opacity: .75; cursor: not-allowed; }
            .btn-login.success  { background: #06d6a0; color: #fff; border-color: #05b589; }

            @keyframes spin { to { transform: rotate(360deg); } }
            .spinner { display: inline-block; animation: spin 1s linear infinite; }

            .login-footer {
                font-family: 'DM Sans', sans-serif;
                font-size: 9.5px;
                font-weight: 500;
                color: rgba(26,0,96,0.45);
                text-align: center;
                margin-top: 14px;
            }

            /* ── SUCCESS OVERLAY ── */
            .success-overlay {
                position: absolute;
                inset: 0;
                background: rgba(237,220,255,0.97);
                border-radius: 40px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
                z-index: 100;
            }

            @keyframes dot-bounce {
                0%,80%,100% { transform: translateY(0);  opacity: .4; }
                40%          { transform: translateY(-5px); opacity: 1; }
            }
            .dot { display:inline-block; animation: dot-bounce 1.2s ease-in-out infinite; }
            .dot:nth-child(2) { animation-delay:.2s; }
            .dot:nth-child(3) { animation-delay:.4s; }
            `}</style>

            <div className="login-root">
            <motion.div
            className="phone"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
            {/* ── SUCCESS OVERLAY ── */}
            <AnimatePresence>
            {exito && (
                <motion.div
                className="success-overlay"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                >
                <motion.span
                style={{ fontSize: 62 }}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: [0, 1.3, 1], rotate: [0, 12, 0] }}
                transition={{ type: 'spring', stiffness: 240, damping: 12, delay: 0.1 }}
                >
                🎉
                </motion.span>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 21, color: '#1a0060' }}>
                ¡Acceso Concedido!
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(26,0,96,0.55)', fontWeight: 500 }}>
                Cargando ERP<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                </p>
                </motion.div>
            )}
            </AnimatePresence>

            {/* ── LEFT COLUMN ── */}
            <div className="left-col">
            <motion.img
            className="logo-img"
            src={letrasImg}
            alt="NoManches Mx"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            />
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="right-col">

            {/* Mascot */}
            <motion.div
            className="mascot-wrap"
            initial={{ scale: 0, rotate: -200 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 190, damping: 13, delay: 0.2 }}
            >
            <img src={mascotaImg} alt="Mascota NoManches" />
            </motion.div>

            {/* Welcome badge */}
            <motion.div
            className="welcome-badge"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, type: 'spring', stiffness: 200, damping: 16 }}
            >
            ¡Bienvenido<br />NoMancherito!
            </motion.div>

            {/* Section title */}
            <motion.p
            className="section-title"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.52 }}
            >
            Iniciar sesión
            </motion.p>

            {/* Form */}
            <motion.form
            className="form-wrap"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58 }}
            >
            {/* Email */}
            <div>
            <label className="field-label">Email</label>
            <div className="field-wrap">
            <input
            type="email"
            className="field-input"
            placeholder="tu@correo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading || exito}
            autoComplete="email"
            />
            </div>
            </div>

            {/* Password */}
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
            {showPass ? '🙈' : '👁️'}
            </button>
            </div>
            </div>

            {/* Forgot */}
            <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>

            {/* Submit */}
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
                <>✅ ¡Listo!</>
            ) : (
                <>Entrar →</>
            )}
            </motion.button>
            </motion.form>

            {/* Footer */}
            <motion.p
            className="login-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            >
            © 2025 NoManches Mx · ERP v2.0
            </motion.p>
            </div>
            </motion.div>
            </div>
            </>
    );
}
