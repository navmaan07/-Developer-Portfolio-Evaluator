import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    try {
      // Check if report exists in cache
      const response = await fetch(`http://localhost:5000/api/reports/${username}`);
      if (response.ok) {
        navigate(`/report/${username}`);
      } else {
        // If not cached, we'd normally generate a new report here
        // For demo purposes, we'll create a sample report
        await createSampleReport(username);
        navigate(`/report/${username}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error loading report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createSampleReport = async (username) => {
    const sampleReport = {
      username,
      profile: {
        name: `${username.charAt(0).toUpperCase() + username.slice(1)} Developer`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: 'Passionate developer building amazing things.',
        location: 'Remote',
        company: 'Tech Company',
        website: 'https://github.com/' + username,
        email: `${username}@example.com`,
        experience: '3 years',
        interests: 'Web development, open source, AI'
      },
      scores: {
        overall: 85,
        activity: 88,
        quality: 82,
        community: 90,
        hiringReady: 78
      },
      repos: [
        { name: 'awesome-project', stars: 45, language: 'JavaScript', description: 'An awesome project' },
        { name: 'react-components', stars: 23, language: 'TypeScript', description: 'Reusable React components' },
        { name: 'api-server', stars: 12, language: 'Node.js', description: 'REST API server' }
      ],
      languages: [
        { name: 'JavaScript', percentage: 45, color: '#f7df1e' },
        { name: 'TypeScript', percentage: 30, color: '#3178c6' },
        { name: 'Python', percentage: 15, color: '#3776ab' },
        { name: 'CSS', percentage: 10, color: '#1572b6' }
      ]
    };

    await fetch('http://localhost:5000/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleReport)
    });
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Developer Portfolio Evaluator</h1>
        <p>Generate shareable portfolio reports with 24-hour caching</p>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !username.trim()}>
            {loading ? 'Loading...' : 'Get Report'}
          </button>
        </form>

        <div className="features">
          <div className="feature">
            <h3>📊 Comprehensive Scoring</h3>
            <p>Activity, code quality, community engagement, and hiring readiness</p>
          </div>
          <div className="feature">
            <h3>🔗 Shareable URLs</h3>
            <p>Share reports with /report/username links</p>
          </div>
          <div className="feature">
            <h3>⚡ 24-Hour Caching</h3>
            <p>Fast loading with MongoDB TTL indexing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
