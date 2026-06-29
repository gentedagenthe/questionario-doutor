import { Routes, Route } from 'react-router-dom';
import Questionario from './Questionario';
import AdminPanel from './AdminPanel';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Questionario />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}
