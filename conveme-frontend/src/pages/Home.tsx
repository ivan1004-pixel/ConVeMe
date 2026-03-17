import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Tus imágenes
import mascotaImg from '../assets/mascota.jpg';
import letrasImg from '../assets/logob.png';

export default function Home() {
    // Arreglo temporal de imágenes para tu carrusel.
    // ¡Luego las puedes cambiar por fotos reales de los bazares o eventos de NoManches!
    const carouselImages = [
        "https://images.unsplash.com/photo-1555529771-835f59bfc50c?w=500&q=80",
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
        "https://images.unsplash.com/photo-1603792907191-89e55f70099a?w=500&q=80",
        "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&q=80",
        "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&q=80",
    ];

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');

            .home-root {
                min-height: 100vh;
                background-color: #ede0d1; /* Tu beige */
                background-image: radial-gradient(#1a0060 1px, transparent 1px);
                background-size: 30px 30px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                font-family: 'Syne', sans-serif;
                overflow: hidden;
                position: relative;
            }

            /* ── CARRUSEL INFINITO ── */
            .carousel-container {
                width: 100vw;
                overflow: hidden;
                padding: 20px 0;
                background: #0301ff; /* Tu azul eléctrico */
                border-top: 6px solid #1a0060;
                border-bottom: 6px solid #1a0060;
                transform: rotate(-2deg) scale(1.05); /* Ligeramente chueco para estilo urbano */
                margin-top: 40px;
                z-index: 10;
            }

            .carousel-track {
                display: flex;
                gap: 20px;
                width: max-content;
                animation: scroll 25s linear infinite;
            }

            .carousel-track:hover {
                animation-play-state: paused; /* Se pausa si le ponen el mouse */
            }

            @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); } /* Se mueve a la mitad exacta para ser infinito */
            }

            .carousel-item {
                width: 250px;
                height: 180px;
                border-radius: 20px;
                border: 4px solid #fff;
                box-shadow: 6px 6px 0px #1a0060;
                object-fit: cover;
                flex-shrink: 0;
                background-color: #f88fea;
            }

            /* ── BOTONES BRUTALISTAS ── */
            .btn-action {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 18px 36px;
                font-size: 18px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                border: 4px solid #1a0060;
                border-radius: 16px;
                cursor: pointer;
                text-decoration: none;
                transition: transform 0.15s, box-shadow 0.15s;
            }

            .btn-primary {
                background: #f88fea; /* Tu rosa */
                color: #1a0060;
                box-shadow: 6px 6px 0px #1a0060;
            }
            .btn-primary:hover {
                transform: translate(-3px, -3px);
                box-shadow: 9px 9px 0px #1a0060;
            }
            .btn-primary:active {
                transform: translate(3px, 3px);
                box-shadow: 2px 2px 0px #1a0060;
            }

            .btn-secondary {
                background: #ffe144; /* Amarillo para resaltar */
                color: #1a0060;
                box-shadow: 6px 6px 0px #1a0060;
            }
            .btn-secondary:hover {
                transform: translate(-3px, -3px);
                box-shadow: 9px 9px 0px #1a0060;
            }
            .btn-secondary:active {
                transform: translate(3px, 3px);
                box-shadow: 2px 2px 0px #1a0060;
            }
            `}</style>

            <div className="home-root pb-10">

            {/* === HEADER (Logo) === */}
            <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-full flex justify-center pt-10 px-4"
            >
            <img
            src={letrasImg}
            alt="NoManches Mx"
            className="h-16 object-contain drop-shadow-[4px_4px_0px_rgba(26,0,96,1)]"
            />
            </motion.div>

            {/* === SECCIÓN CENTRAL (Mascota) === */}
            <div className="flex-1 flex flex-col items-center justify-center mt-8 relative z-20">
            <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative"
            >
            {/* Círculo de fondo para la mascota */}
            <div className="w-56 h-56 md:w-72 md:h-72 bg-[#cc55ff] border-[6px] border-[#1a0060] rounded-full flex items-center justify-center overflow-hidden shadow-[12px_12px_0px_#1a0060]">
            <img
            src={mascotaImg}
            alt="Mascota"
            className="w-full h-full object-cover"
            />
            </div>
            {/* Badge Flotante */}
            <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -bottom-6 -right-6 bg-[#ffe144] border-4 border-[#1a0060] px-6 py-2 rounded-xl shadow-[4px_4px_0px_#1a0060]"
            >
            <span className="font-black text-xl text-[#1a0060]">ERP v2.0</span>
            </motion.div>
            </motion.div>
            </div>

            {/* === CARRUSEL INFINITO DE IMÁGENES === */}
            <div className="carousel-container shadow-2xl">
            <div className="carousel-track">
            {/* Renderizamos las imágenes dos veces para que el ciclo sea infinito sin cortes */}
            {[...carouselImages, ...carouselImages].map((src, index) => (
                <img
                key={index}
                src={src}
                alt={`Evento NoManches ${index}`}
                className="carousel-item"
                />
            ))}
            </div>
            </div>

            {/* === BOTONES DE ACCIÓN === */}
            <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 mt-16 px-4 z-20"
            >
            <Link to="/login" className="btn-primary">
            👉 Iniciar Sesión
            </Link>
            <Link to="/crear-usuario" className="btn-secondary">
            ⚡ Crear Usuario
            </Link>
            </motion.div>

            </div>
            </>
    );
}
