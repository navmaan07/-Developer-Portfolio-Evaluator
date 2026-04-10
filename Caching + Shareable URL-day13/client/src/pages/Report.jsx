
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Report() {
  const { username } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [username]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${username}`);
      if (response.ok) {
        const data = await response.json();
        setReport(data.data);
      } else {
        setError('Report not found or expired');
      }
    } catch (err) {
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const scoreOffset = (value) => {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    return circumference - (value / 100) * circumference;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading cached report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Report Not Available</h2>
        <p>{error}</p>
        <p>Reports are cached for 24 hours. Try generating a new report.</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="report-page">
      <header className="report-header">
        <Link to="/" className="back-link">← Home</Link>
        <div className="share-info">
          <p>Share this report: <code>{window.location.href}</code></p>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="copy-btn"
          >
            Copy Link
          </button>
        </div>
      </header>

      <div className="report-content">
        <section className="profile-section">
          <div className="profile-card">
            <div className="profile-avatar">
              <img src={report.profile.avatar} alt={`${report.profile.name} avatar`} />
            </div>
            <div className="profile-info">
              <h1>{report.profile.name}</h1>
              <p className="username">@{report.username}</p>
              <p className="bio">{report.profile.bio}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span>Location</span>
              <strong>{report.profile.location}</strong>
            </div>
            <div className="detail-item">
              <span>Company</span>
              <strong>{report.profile.company}</strong>
            </div>
            <div className="detail-item">
              <span>Experience</span>
              <strong>{report.profile.experience}</strong>
            </div>
            <div className="detail-item">
              <span>Interests</span>
              <strong>{report.profile.interests}</strong>
            </div>
          </div>
        </section>

        <section className="scores-section">
          <h2>Portfolio Scores</h2>

          <div className="overall-score">
            <div className="circular-score">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle className="bg" cx="60" cy="60" r="52" />
                <circle
                  className="progress"
                  cx="60"
                  cy="60"
                  r="52"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={scoreOffset(report.scores.overall)}
                />
              </svg>
              <div className="score-value">
                <strong>{report.scores.overall}</strong>
                <small>Overall</small>
              </div>
            </div>
          </div>

          <div className="score-breakdown">
            <div className="score-item">
              <h3>Activity</h3>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${report.scores.activity}%` }}
                ></div>
              </div>
              <span className="score-value">{report.scores.activity}/100</span>
            </div>

            <div className="score-item">
              <h3>Code Quality</h3>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${report.scores.quality}%` }}
                ></div>
              </div>
              <span className="score-value">{report.scores.quality}/100</span>
            </div>

            <div className="score-item">
              <h3>Community</h3>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${report.scores.community}%` }}
                ></div>
              </div>
              <span className="score-value">{report.scores.community}/100</span>
            </div>

            <div className="score-item">
              <h3>Hiring Ready</h3>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${report.scores.hiringReady}%` }}
                ></div>
              </div>
              <span className="score-value">{report.scores.hiringReady}/100</span>
            </div>
          </div>
        </section>

        <section className="repos-section">
          <h2>Top Repositories</h2>
          <div className="repos-grid">
            {report.repos.map((repo, index) => (
              <div key={index} className="repo-card">
                <h3>{repo.name}</h3>
                <p>{repo.description}</p>
                <div className="repo-meta">
                  <span className="stars">⭐ {repo.stars}</span>
                  <span className="language">{repo.language}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="languages-section">
          <h2>Language Distribution</h2>
          <div className="languages-list">
            {report.languages.map((lang, index) => (
              <div key={index} className="language-item">
                <div className="language-info">
                  <span
                    className="color-dot"
                    style={{ backgroundColor: lang.color }}
                  ></span>
                  <span className="language-name">{lang.name}</span>
                </div>
                <span className="percentage">{lang.percentage}%</span>
                <div className="language-bar">
                  <div
                    className="language-fill"
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: lang.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

