import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Share2, 
  Home as HomeIcon, 
  Search, 
  Activity, 
  Code, 
  Users, 
  Briefcase, 
  Layout,
  PieChart,
  Calendar,
  CheckCircle2
} from 'lucide-react'
import { profileAPI } from '../utils/api'
import { Radar, Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import '../styles/Report.css'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Global Chart Defaults for Dark Mode
ChartJS.defaults.color = '#94a3b8'
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)'
ChartJS.defaults.font.family = "'Plus Jakarta Sans', sans-serif"

export default function Report() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await profileAPI.getProfile(username)
        setReport(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [username])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleHome = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div 
          className="loader-spark"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
        >
          Analyzing {username}'s portfolio...
        </motion.p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="report container" style={{ textAlign: 'center' }}>
        <motion.div 
          className="glass-card" 
          style={{ padding: '4rem', maxWidth: '600px', margin: '0 auto' }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="text-gradient-primary" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Analysis Failed</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
          <button onClick={handleHome} className="btn-premium">
            <HomeIcon size={18} />
            Back to Home
          </button>
        </motion.div>
      </div>
    )
  }

  if (!report) return null

  const radarData = {
    labels: ['Activity', 'Code Quality', 'Diversity', 'Community', 'Hiring Readiness'],
    datasets: [{
      label: 'Performance Score',
      data: [
        report.scores?.activity || 0,
        report.scores?.codeQuality || 0,
        report.scores?.diversity || 0,
        report.scores?.community || 0,
        report.scores?.hiringReady || 0
      ],
      fill: true,
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderColor: '#8b5cf6',
      borderWidth: 2,
      pointBackgroundColor: '#8b5cf6',
      pointBorderColor: '#fff',
      pointHoverRadius: 6,
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      r: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { display: false },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  }

  const languageData = {
    labels: report.languages?.map(l => l.name) || [],
    datasets: [{
      data: report.languages?.map(l => l.percentage) || [],
      backgroundColor: [
        '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'
      ],
      borderWidth: 0,
      borderRadius: 10,
    }]
  }

  const activityData = {
    labels: ['Last 90 Days', 'Total'],
    datasets: [{
      label: 'Commits',
      data: [report.contributions?.commitsLast90Days || 0, report.contributions?.totalCommits || 0],
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 8,
    }]
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
      className="report container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className="report-header" variants={itemVariants}>
        <div className="user-info">
          <div className="avatar-wrapper">
            <img src={report.avatarUrl} alt={report.name} className="avatar" />
            <div className="avatar-badge">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="user-details">
            <h1>{report.name || report.login || report.username}</h1>
            <p className="username">@{report.login || report.username}</p>
            <p className="bio">{report.bio || "No bio available"}</p>
            
            <div className="report-actions">
              <button onClick={handleShare} className="btn-premium">
                {copied ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
                {copied ? 'Copied!' : 'Share Report'}
              </button>
              <button onClick={handleHome} className="btn-premium">
                <Search size={18} />
                New Analysis
              </button>
            </div>
          </div>
        </div>

        <div className="overall-score-spinner">
          <div className="circular-score" style={{ width: '160px', height: '160px' }}>
            <svg viewBox="0 0 120 120">
              <circle className="bg" cx="60" cy="60" r="54" />
              <motion.circle
                className="progress"
                cx="60"
                cy="60"
                r="54"
                initial={{ strokeDashoffset: 339 }}
                animate={{ strokeDashoffset: 339 - (report.scores.overall / 100) * 339 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                style={{ stroke: 'url(#score-gradient)' }}
              />
            </svg>
            <div className="score-value">
              <strong style={{ fontSize: '2.5rem' }}>{report.scores?.overall || 0}</strong>
              <small>Overall</small>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.div className="score-breakdown" variants={itemVariants}>
        <div className="glass-card score-card">
          <Activity size={24} className="text-gradient-primary" />
          <span className="score-card-header">Activity</span>
          <span className="score-card-value">{report.scores?.activity || 0}</span>
          <p className="score-card-desc">Engagement & consistency</p>
        </div>

        <div className="glass-card score-card">
          <Code size={24} style={{ color: 'var(--secondary)' }} />
          <span className="score-card-header">Code Quality</span>
          <span className="score-card-value">{report.scores?.codeQuality || 0}</span>
          <p className="score-card-desc">Structure & best practices</p>
        </div>

        <div className="glass-card score-card">
          <Layout size={24} style={{ color: 'var(--accent)' }} />
          <span className="score-card-header">Diversity</span>
          <span className="score-card-value">{report.scores?.diversity || 0}</span>
          <p className="score-card-desc">Stack variety & breadth</p>
        </div>

        <div className="glass-card score-card">
          <Users size={24} style={{ color: 'var(--success)' }} />
          <span className="score-card-header">Community</span>
          <span className="score-card-value">{report.scores?.community || 0}</span>
          <p className="score-card-desc">Impact & networking</p>
        </div>

        <div className="glass-card score-card">
          <Briefcase size={24} style={{ color: 'var(--info)' }} />
          <span className="score-card-header">Readiness</span>
          <span className="score-card-value">{report.scores?.hiringReady || 0}</span>
          <p className="score-card-desc">Professional maturity</p>
        </div>
      </motion.div>

      <div className="charts-section">
        <motion.div className="glass-card chart-container" variants={itemVariants}>
          <div className="chart-title">
            <PieChart size={20} className="text-gradient-primary" />
            Performance Radar
          </div>
          <div style={{ flex: 1 }}>
            <Radar data={radarData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div className="glass-card chart-container" variants={itemVariants}>
          <div className="chart-title">
            <Code size={20} style={{ color: 'var(--secondary)' }} />
            Tech Stack (LOC)
          </div>
          <div style={{ flex: 1 }}>
            <Bar data={languageData} options={{ 
              ...chartOptions, 
              scales: { y: { display: false }, x: { grid: { display: false } } } 
            }} />
          </div>
        </motion.div>

        <motion.div className="glass-card chart-container full-width" variants={itemVariants}>
          <div className="chart-title">
            <Calendar size={20} style={{ color: 'var(--accent)' }} />
            Monthly Contribution Velocity
          </div>
          <div style={{ flex: 1 }}>
            <Line data={activityData} options={{ 
              ...chartOptions, 
              scales: { 
                r: { display: false },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                x: { grid: { display: false } }
              } 
            }} />
          </div>
        </motion.div>
      </div>

      <motion.div className="stats-section" variants={itemVariants}>
        <div className="stat-item">
          <span className="stat-label">Repositories</span>
          <span className="stat-value">{report.publicRepos || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Followers</span>
          <span className="stat-value">{report.followers || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Following</span>
          <span className="stat-value">{report.following || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Presence</span>
          <span className="stat-value">
            {report.createdAt ? Math.floor((new Date() - new Date(report.createdAt)) / (1000 * 60 * 60 * 24)) : 0} Days
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
