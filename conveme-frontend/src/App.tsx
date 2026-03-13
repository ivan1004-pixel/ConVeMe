import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // Importamos tu diseño

function App() {
  return (
    <Routes>
    {/* Que el Login sea la primera pantalla al entrar */}
    <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
