import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserGreeting from '../components/ui/UserGreeting';
import { Users, Package, ShoppingCart, TrendingUp, ArrowRight, Scissors, Star } from 'lucide-react';

export default function DashboardHome() {
    const rolId = Number(localStorage.getItem('rol_id'));

    const cards = [
        {
            show:    rolId === 1,
            to:      '/catalogos', // <-- Actualizado a la nueva ruta
            bg:      '#cc55ff',
            accent:  '#1a0060',
            textCol: '#fff',
            subCol:  'rgba(255,255,255,0.75)',
            icon:    <Users size={28} />,
            label:   'Administración',
            title:   'Añadir (Catálogos)', // <-- Actualizado según tu petición
            sub:     'Escuelas, Empleados, Cuentas Bancarias, Eventos, Vendedores', // <-- Actualizado
            tag:     'Gestión',
            tagBg:   'rgba(255,255,255,0.22)',
            tagCol:  '#fff',
            stat:    '5 Entidades',
            statIcon:<Star size={12} />,
        },
        {
            show:    rolId === 1 || rolId === 2,
            to:      '/pos',
            bg:      '#06d6a0',
            accent:  '#1a0060',
            textCol: '#1a0060',
            subCol:  'rgba(26,0,96,0.6)',
            icon:    <ShoppingCart size={28} />,
            label:   'Ventas',
            title:   'Punto de Venta',
            sub:     'Registra y gestiona nuevas ventas',
            tag:     'POS',
            tagBg:   'rgba(26,0,96,0.12)',
            tagCol:  '#1a0060',
            stat:    'Tiempo real',
            statIcon:<TrendingUp size={12} />,
        },
        {
            show:    rolId === 1 || rolId === 3,
            to:      '/inventario',
            bg:      '#ffe144',
            accent:  '#1a0060',
            textCol: '#1a0060',
            subCol:  'rgba(26,0,96,0.6)',
            icon:    <Package size={28} />,
            label:   'Stock',
            title:   'Inventario',
            sub:     'Control de stock y prendas',
            tag:     'Logística',
            tagBg:   'rgba(26,0,96,0.1)',
            tagCol:  '#1a0060',
            stat:    'En vivo',
            statIcon:<Package size={12} />,
        },
        {
            show:    rolId === 1 || rolId === 3,
            to:      '/produccion',
            bg:      '#1a0060',
            accent:  '#cc55ff',
            textCol: '#fff',
            subCol:  'rgba(255,255,255,0.55)',
            icon:    <Scissors size={28} />,
            label:   'Producción',
            title:   'Producción',
            sub:     'Seguimiento de prendas en proceso',
            tag:     'Taller',
            tagBg:   'rgba(204,85,255,0.18)',
            tagCol:  '#cc55ff',
            stat:    'En proceso',
            statIcon:<Scissors size={12} />,
        },
    ].filter(c => c.show);

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

            .dh-root {
                display: flex;
                flex-direction: column;
                gap: 32px;
                font-family: 'DM Sans', sans-serif;
            }

            /* ── Section header ── */
            .dh-section-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 12px;
            }
            .dh-section-title {
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: clamp(13px, 1.2vw, 16px);
                color: rgba(26,0,96,0.4);
                text-transform: uppercase;
                letter-spacing: .14em;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .dh-section-title::before {
                content: '';
    display: block;
    width: 24px; height: 3px;
    border-radius: 3px;
    background: #cc55ff;
            }
            .dh-section-count {
                background: rgba(204,85,255,0.12);
                border: 1.5px solid rgba(204,85,255,0.25);
                border-radius: 8px;
                padding: 3px 10px;
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 11px;
                color: #cc55ff;
            }

            /* ── Grid ── */
            .dh-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                gap: 20px;
            }

            /* ── Card ── */
            .dh-card {
                position: relative;
                border: 3px solid #1a0060;
                border-radius: 24px;
                padding: 28px 24px 22px;
                display: flex;
                flex-direction: column;
                gap: 0;
                overflow: hidden;
                text-decoration: none;
                cursor: pointer;
                transition: box-shadow .15s, transform .15s;
                box-shadow: 6px 6px 0px #1a0060;
            }
            .dh-card:hover {
                box-shadow: 9px 9px 0px #1a0060;
                transform: translate(-2px, -2px);
            }
            .dh-card:active {
                box-shadow: 3px 3px 0px #1a0060;
                transform: translate(3px, 3px);
            }

            /* Dot pattern on card */
            .dh-card::before {
                content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.18) 1.5px, transparent 1.5px);
    background-size: 20px 20px;
    pointer-events: none;
            }

            /* Deco circle */
            .dh-card::after {
                content: '';
    position: absolute;
    bottom: -40px; right: -40px;
    width: 140px; height: 140px;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.18);
    pointer-events: none;
            }

            /* Tag */
            .dh-tag {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                border-radius: 8px;
                padding: 4px 10px;
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 10px;
                letter-spacing: .1em;
                text-transform: uppercase;
                width: fit-content;
                margin-bottom: 18px;
                position: relative;
                z-index: 1;
            }

            /* Icon circle */
            .dh-icon-wrap {
                width: 60px; height: 60px;
                border-radius: 18px;
                border: 2.5px solid rgba(255,255,255,0.35);
                background: rgba(255,255,255,0.18);
                display: flex; align-items: center; justify-content: center;
                margin-bottom: 16px;
                position: relative;
                z-index: 1;
                backdrop-filter: blur(4px);
            }

            .dh-card-title {
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: clamp(18px, 1.8vw, 22px);
                line-height: 1.1;
                margin-bottom: 6px;
                position: relative;
                z-index: 1;
            }
            .dh-card-sub {
                font-size: 13px;
                font-weight: 500;
                line-height: 1.5;
                margin-bottom: 20px;
                position: relative;
                z-index: 1;
            }

            /* Bottom row */
            .dh-card-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: auto;
                position: relative;
                z-index: 1;
            }
            .dh-stat {
                display: flex;
                align-items: center;
                gap: 5px;
                font-family: 'Syne', sans-serif;
                font-weight: 700;
                font-size: 11px;
                letter-spacing: .06em;
                opacity: .65;
            }
            .dh-arrow {
                width: 32px; height: 32px;
                border-radius: 10px;
                border: 2px solid rgba(255,255,255,0.35);
                background: rgba(255,255,255,0.18);
                display: flex; align-items: center; justify-content: center;
                transition: background .18s, border-color .18s;
            }
            .dh-card:hover .dh-arrow {
                background: rgba(255,255,255,0.32);
                border-color: rgba(255,255,255,0.55);
            }

            /* ── Quick info strip ── */
            .dh-strip {
                display: flex;
                gap: 14px;
                flex-wrap: wrap;
            }
            .dh-strip-chip {
                flex: 1;
                min-width: 120px;
                background: rgba(255,255,255,0.65);
                border: 2px solid rgba(26,0,96,0.1);
                border-radius: 16px;
                padding: 16px 20px;
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .dh-strip-icon {
                width: 38px; height: 38px;
                border-radius: 12px;
                display: flex; align-items: center; justify-content: center;
                flex-shrink: 0;
                background: rgba(204,85,255,0.12);
                border: 1.5px solid rgba(204,85,255,0.2);
                color: #cc55ff;
            }
            .dh-strip-text { display: flex; flex-direction: column; }
            .dh-strip-num {
                font-family: 'Syne', sans-serif;
                font-weight: 900;
                font-size: 20px;
                color: #1a0060;
                line-height: 1;
            }
            .dh-strip-label {
                font-size: 10.5px;
                font-weight: 600;
                color: rgba(26,0,96,0.45);
                text-transform: uppercase;
                letter-spacing: .08em;
            }

            @media (max-width: 640px) {
                .dh-grid { grid-template-columns: 1fr; }
            }
            `}</style>

            <div className="dh-root">

            {/* Greeting - Ya incluido como pediste */}
            <UserGreeting />

            {/* Info strip */}
            <motion.div
            className="dh-strip"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            >
            {[
                { icon: <TrendingUp size={18} />, num: 'Hoy',  label: 'Actividad'    },
            { icon: <Users      size={18} />, num: rolId === 1 ? 'Admin' : rolId === 2 ? 'Ventas' : 'Prod.', label: 'Tu rol' },
            { icon: <Package   size={18} />, num: cards.length, label: 'Módulos disponibles' },
            ].map((chip, i) => (
                <motion.div
                key={i}
                className="dh-strip-chip"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 200 }}
                >
                <div className="dh-strip-icon">{chip.icon}</div>
                <div className="dh-strip-text">
                <span className="dh-strip-num">{chip.num}</span>
                <span className="dh-strip-label">{chip.label}</span>
                </div>
                </motion.div>
            ))}
            </motion.div>

            {/* Section header */}
            <motion.div
            className="dh-section-head"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            >
            <p className="dh-section-title">Accesos rápidos</p>
            <span className="dh-section-count">{cards.length} módulos</span>
            </motion.div>

            {/* Cards grid */}
            <div className="dh-grid">
            {cards.map((card, i) => (
                <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 180, damping: 18 }}
                >
                <Link
                to={card.to}
                className="dh-card"
                style={{ background: card.bg }}
                >
                {/* Tag */}
                <span
                className="dh-tag"
                style={{ background: card.tagBg, color: card.tagCol }}
                >
                {card.tag}
                </span>

                {/* Icon */}
                <div className="dh-icon-wrap" style={{ color: card.textCol }}>
                {card.icon}
                </div>

                {/* Text */}
                <h3 className="dh-card-title" style={{ color: card.textCol }}>
                {card.title}
                </h3>
                <p className="dh-card-sub" style={{ color: card.subCol }}>
                {card.sub}
                </p>

                {/* Footer */}
                <div className="dh-card-footer">
                <span className="dh-stat" style={{ color: card.textCol }}>
                {card.statIcon} {card.stat}
                </span>
                <div className="dh-arrow" style={{ color: card.textCol }}>
                <ArrowRight size={15} />
                </div>
                </div>
                </Link>
                </motion.div>
            ))}
            </div>

            </div>
            </>
    );
}
