import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const Home = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
  <motion.div
  initial={{ opacity: 0, scale: 0.8, y: 50 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 0.6, type: "spring" }}
  className="bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center border-t-4 border-orange-500"
  >
  <div className="bg-orange-100 p-4 rounded-full mb-6">
  <Rocket className="w-12 h-12 text-orange-500" />
  </div>
  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
  ConVeMe ERP
  </h1>
  <p className="text-gray-500 mt-3 font-medium text-lg">
  El frontend Súper Pro está en línea 🚀
  </p>
  </motion.div>
  </div>
);

function App() {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
