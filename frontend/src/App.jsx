import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Prompt from './pages/Prompt.jsx';
import Tests from './pages/Tests.jsx';
import Validate from './pages/Validate.jsx';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Prompt />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/validate" element={<Validate />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
