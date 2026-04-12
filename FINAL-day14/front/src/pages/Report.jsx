
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Report.css';

export default function Report() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/${username}`);
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || 'Failed to fetch profile');
          setLoading(false);
          return;
        }
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        setError('Error fetching profile: ' + err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) return <div className="report"><div className="container"><p>Loading...</p></div></div>;
  if (error) return <div className="report"><div className="container"><p className="error">{error}</p><button onClick={() => navigate('/')}>Go Back</button></div></div>;
  if (!data) return <div className="report"><div className="container"><p>No data</p></div></div>;

  const { profile, metrics, scores } = data;

  return (
    <div className="report">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>

        <div className="profile-header">
          {profile.avatar && <img src={profile.avatar} alt={profile.name} />}
          <div className="profile-info">
            <h1>{profile.name || profile.username}</h1>
            <p>@{profile.username}</p>
            {profile.bio && <p className="bio">{profile.bio}</p>}
            <div className="stats">
              {profile.location && <span>📍 {profile.location}</span>}
              <span>👥 {profile.followers} followers</span>
              <span>📦 {profile.publicRepos} public repos</span>
            </div>
          </div>
        </div>

        <div className="scores-grid">
          <div className="score-card">
            <h3>Activity</h3>
            <div className="score-value">{scores.activity.toFixed(1)}</div>
            <p>Commits: {metrics.commitsLast90Days}</p>
            <p>Streak: {metrics.currentStreak} days</p>
          </div>
          <div className="score-card">
            <h3>Code Quality</h3>
            <div className="score-value">{scores.codeQuality.toFixed(1)}</div>
            <p>Repos: {metrics.repositoriesCount}</p>
          </div>
          <div className="score-card">
            <h3>Diversity</h3>
            <div className="score-value">{scores.diversity.toFixed(1)}</div>
            <p>Languages: {metrics.languagesCount}</p>
            <p>Categories: {metrics.categoriesCount}</p>
          </div>
          <div className="score-card">
            <h3>Community</h3>
            <div className="score-value">{scores.community.toFixed(1)}</div>
            <p>Followers: {profile.followers}</p>
          </div>
          <div className="score-card">
            <h3>Hiring Ready</h3>
            <div className="score-value">{scores.hiringReady.toFixed(1)}</div>
            <p>Bio: {profile.bio ? '✓' : '✗'}</p>
            <p>Website: {profile.website ? '✓' : '✗'}</p>
          </div>
          <div className="score-card overall">
            <h3>Overall Score</h3>
            <div className="score-value overall-value">{scores.overall.toFixed(1)}</div>
            <p>out of 50</p>
          </div>
        </div>

        <div className="metrics">
          <h2>Metrics</h2>
          <div className="metrics-grid">
            <div className="metric">
              <label>Repositories</label>
              <span>{metrics.repositoriesCount}</span>
            </div>
            <div className="metric">
              <label>Languages</label>
              <span>{metrics.languagesCount}</span>
            </div>
            <div className="metric">
              <label>Categories</label>
              <span>{metrics.categoriesCount}</span>
            </div>
            <div className="metric">
              <label>Commits (90d)</label>
              <span>{metrics.commitsLast90Days}</span>
            </div>
            <div className="metric">
              <label>Current Streak</label>
              <span>{metrics.currentStreak} days</span>
            </div>
            <div className="metric">
              <label>Longest Streak</label>
              <span>{metrics.longestStreak} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

