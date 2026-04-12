import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, BarChart3, Link, Zap, TrendingUp, Terminal, ArrowRight } from 'lucide-react'
import { profileAPI } from '../utils/api'
import '../styles/Home.css'

export default function Home() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim()) return

    setLoading(true)
    setError('')

    try {
      await profileAPI.getProfile(username.trim())
      navigate(`/report/${username.trim()}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCompare = () => {
    navigate('/compare')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="home">
      <div className="home-bg-glow" />
      
      <motion.div 
        className="hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hero-content">
          <motion.h1 className="hero-title" variants={itemVariants}>
            Elevate Your <span className="text-gradient-primary">Developer Identity</span>
          </motion.h1>

          <motion.p className="hero-description" variants={itemVariants}>
            Analyze your GitHub presence with AI-driven insights. Get comprehensive scores on activity, code quality, and community impact.
          </motion.p>

          <motion.form 
            onSubmit={handleSubmit} 
            className="search-form"
            variants={itemVariants}
          >
            <div className="search-input-group">
              <div className="search-input-container">
                <Terminal size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Enter GitHub username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="search-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="search-button"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Zap size={18} />
                  </motion.div>
                ) : (
                  <>
                    <span>Analyze</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            {error && (
              <motion.p 
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          </motion.form>

          <motion.div className="hero-actions" variants={itemVariants}>
            <button onClick={handleCompare} className="btn-premium">
              <TrendingUp size={18} />
              Compare Profiles
            </button>
          </motion.div>
        </div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="visual-container">
            <div className="glass-card score-preview">
              <div className="circular-score">
                <svg viewBox="0 0 120 120" width="220" height="220">
                  <defs>
                    <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--secondary)" />
                    </linearGradient>
                  </defs>
                  <circle className="bg" cx="60" cy="60" r="54" />
                  <motion.circle
                    className="progress"
                    cx="60"
                    cy="60"
                    r="54"
                    initial={{ strokeDashoffset: 339 }}
                    animate={{ strokeDashoffset: 60 }}
                    transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="score-value">
                  <motion.strong
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    85
                  </motion.strong>
                  <small>Portfolio Score</small>
                </div>
              </div>
            </div>
            
            <motion.div 
              className="float-item glass-card"
              style={{ top: '10%', right: '-10%' }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              🚀 Hiring Ready
            </motion.div>
            
            <motion.div 
              className="float-item glass-card"
              style={{ bottom: '15%', left: '-10%' }}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              ⭐ Top 5% Contributor
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <div className="features">
        <motion.div 
          className="glass-card feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="feature-icon-wrapper">
            <BarChart3 size={24} />
          </div>
          <h3>Detailed Analytics</h3>
          <p>5 depth metrics analyzing activity, code structure, and community impact.</p>
        </motion.div>

        <motion.div 
          className="glass-card feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="feature-icon-wrapper" style={{ color: 'var(--secondary)' }}>
            <Link size={24} />
          </div>
          <h3>Shareable Success</h3>
          <p>Generate permanent report links optimized for LinkedIn and professional resumes.</p>
        </motion.div>

        <motion.div 
          className="glass-card feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="feature-icon-wrapper" style={{ color: 'var(--accent)' }}>
            <Zap size={24} />
          </div>
          <h3>Real-time Insights</h3>
          <p>Instant analysis using high-performance MongoDB caching and GitHub API v3.</p>
        </motion.div>
      </div>
    </div>
  )
}
