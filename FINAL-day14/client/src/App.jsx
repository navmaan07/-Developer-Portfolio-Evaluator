import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, TrendingUp, Terminal } from 'lucide-react'
import Home from './pages/Home'
import Report from './pages/Report'
import Compare from './pages/Compare'
import NotFound from './pages/NotFound'
import './styles/App.css'

function App() {
  const location = useLocation()

  return (
    <div className="App">
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <Terminal size={28} className="text-gradient-primary" />
          <span>Dev<span className="text-gradient-primary">Evaluator</span></span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/compare" className={`nav-link ${location.pathname === '/compare' ? 'active' : ''}`}>Compare</Link>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/report/:username" element={<Report />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
