import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Home as HomeIcon, 
  Search, 
  Trophy, 
  ArrowRight,
  Terminal,
  BarChart3,
  TrendingUp,
  Activity,
  Code,
  Layout,
  Briefcase
} from 'lucide-react'
import { profileAPI } from '../utils/api'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import '../styles/Compare.css'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Compare() {
  const navigate = useNavigate()
  const [user1, setUser1] = useState('')
  const [user2, setUser2] = useState('')
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCompare = async (e) => {
    e.preventDefault()
    if (!user1.trim() || !user2.trim()) return

    setLoading(true)
    setError('')

    try {
      const data = await profileAPI.compareProfiles(user1.trim(), user2.trim())
      setComparison(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleHome = () => {
    navigate('/')
  }

  const radarData = comparison ? {
    labels: ['Activity', 'Code Quality', 'Diversity', 'Community', 'Hiring Readiness'],
    datasets: [
      {
        label: comparison.user1.login || comparison.user1.username,
        data: [
          comparison.user1.scores?.activity || 0,
          comparison.user1.scores?.codeQuality || 0,
          comparison.user1.scores?.diversity || 0,
          comparison.user1.scores?.community || 0,
          comparison.user1.scores?.hiringReady || 0
        ],
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: '#8b5cf6',
        pointBackgroundColor: '#8b5cf6',
      },
      {
        label: comparison.user2.login || comparison.user2.username,
        data: [
          comparison.user2.scores?.activity || 0,
          comparison.user2.scores?.codeQuality || 0,
          comparison.user2.scores?.diversity || 0,
          comparison.user2.scores?.community || 0,
          comparison.user2.scores?.hiringReady || 0
        ],
        fill: true,
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        borderColor: '#ec4899',
        pointBackgroundColor: '#ec4899',
      }
    ]
  } : null

  const getWinner = (m1, m2) => {
    if (m1 > m2) return 1
    if (m2 > m1) return 2
    return 0
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <motion.div 
      className="compare container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <header className="compare-header">
        <motion.h1 className="text-gradient-primary" variants={itemVariants}>Compare Portfolios</motion.h1>
        <motion.p variants={itemVariants}>Benchmarking developer expertise side-by-side</motion.p>
        <motion.button 
          onClick={handleHome} 
          className="btn-premium"
          variants={itemVariants}
        >
          <HomeIcon size={18} />
          Back to Home
        </motion.button>
      </header>

      <motion.form 
        onSubmit={handleCompare} 
        className="compare-form"
        variants={itemVariants}
      >
        <div className="compare-input-group">
          <div className="search-input-group" style={{ flex: 1 }}>
            <div className="search-input-container">
              <Terminal size={20} className="search-icon" />
              <input
                type="text"
                placeholder="User 1"
                value={user1}
                onChange={(e) => setUser1(e.target.value)}
                disabled={loading}
                className="search-input"
              />
            </div>
          </div>
          <span className="vs-divider">VS</span>
          <div className="search-input-group" style={{ flex: 1 }}>
            <div className="search-input-container">
              <Terminal size={20} className="search-icon" />
              <input
                type="text"
                placeholder="User 2"
                value={user2}
                onChange={(e) => setUser2(e.target.value)}
                disabled={loading}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !user1.trim() || !user2.trim()}
          className="btn-premium"
          style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
        >
          {loading ? 'Analyzing...' : 'Execute Comparison'}
        </button>

        {error && <p className="error-message">{error}</p>}
      </motion.form>

      <AnimatePresence>
        {comparison && (
          <motion.div 
            className="comparison-results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="users-comparison">
              <motion.div className="glass-card compare-user-card" whileHover={{ y: -5 }}>
                <img src={comparison.user1.avatarUrl} alt={comparison.user1.name} className="avatar" />
                <h3>{comparison.user1.name || comparison.user1.login || comparison.user1.username}</h3>
                <p className="username">@{comparison.user1.login || comparison.user1.username}</p>
                <div className="compare-overall-badge">
                  {comparison.user1.scores?.overall || 0}
                </div>
                {getWinner(comparison.user1.scores?.overall || 0, comparison.user2.scores?.overall || 0) === 1 && (
                  <div className="text-gradient-accent" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                    <Trophy size={18} /> OVERALL WINNER
                  </div>
                )}
              </motion.div>

              <motion.div className="glass-card compare-user-card" whileHover={{ y: -5 }}>
                <img src={comparison.user2.avatarUrl} alt={comparison.user2.name} className="avatar" />
                <h3>{comparison.user2.name || comparison.user2.login || comparison.user2.username}</h3>
                <p className="username">@{comparison.user2.login || comparison.user2.username}</p>
                <div className="compare-overall-badge" style={{ background: 'var(--secondary)' }}>
                  {comparison.user2.scores?.overall || 0}
                </div>
                {getWinner(comparison.user1.scores?.overall || 0, comparison.user2.scores?.overall || 0) === 2 && (
                  <div className="text-gradient-accent" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                    <Trophy size={18} /> OVERALL WINNER
                  </div>
                )}
              </motion.div>
            </div>

            <div className="glass-card comparison-chart-section">
              <Radar 
                data={radarData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                      angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                      ticks: { display: false },
                      suggestedMin: 0,
                    }
                  }
                }} 
              />
            </div>

            <div className="glass-card comparison-table-section">
              <h3 className="chart-title"><BarChart3 size={20} className="text-gradient-primary" /> Key Metric Comparison</h3>
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>{comparison.user1.login}</th>
                    <th>{comparison.user2.login}</th>
                    <th>Lead</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Activity', key: 'activity', icon: <Activity size={16} /> },
                    { name: 'Code Quality', key: 'codeQuality', icon: <Code size={16} /> },
                    { name: 'Diversity', key: 'diversity', icon: <Layout size={16} /> },
                    { name: 'Community', key: 'community', icon: <Users size={16} /> },
                    { name: 'Readiness', key: 'hiringReady', icon: <Briefcase size={16} /> }
                  ].map(metric => {
                    const s1 = comparison.user1.scores?.[metric.key] || 0;
                    const s2 = comparison.user2.scores?.[metric.key] || 0;
                    const diff = s1 - s2;
                    return (
                      <tr key={metric.key}>
                        <td>
                          <div className="metric-name">
                            {metric.icon}
                            {metric.name}
                          </div>
                        </td>
                        <td style={{ color: diff > 0 ? 'var(--primary)' : 'inherit' }}>{comparison.user1.scores[metric.key]}</td>
                        <td style={{ color: diff < 0 ? 'var(--secondary)' : 'inherit' }}>{comparison.user2.scores[metric.key]}</td>
                        <td>
                          {diff !== 0 && (
                            <span className={`diff-tag ${diff > 0 ? 'diff-positive' : 'diff-negative'}`}>
                              {diff > 0 ? `+${diff} ${comparison.user1.login}` : `${diff} ${comparison.user2.login}`}
                            </span>
                          )}
                          {diff === 0 && <span className="text-dim">Tie</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}