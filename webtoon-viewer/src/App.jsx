import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/Layout/ThemeToggle';
import Home from './pages/Home';
import Viewer from './pages/Viewer';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/viewer/:id" element={<Viewer />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
