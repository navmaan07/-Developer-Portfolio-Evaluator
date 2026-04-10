import './App.css';

const profile = {
  name: 'Anna Thompson',
  username: '@annadev',
  role: 'Developer Portfolio Evaluator',
  location: 'Remote',
  company: 'Open Source Collective',
  experience: '5 years',
  interests: 'Web performance, UI design, API scoring',
  avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
};

const scoreData = {
  overall: 88,
  activity: 92,
  quality: 84,
  community: 90,
};

function scoreOffset(value) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  return circumference - (value / 100) * circumference;
}

export default function App() {
  return (
    <div className="app-shell">
      <header className="header">
        <h1>Day 11 Scorecard</h1>
        <p>Profile summary with a circular overall score and the latest evaluator metrics.</p>
      </header>

      <div className="scorecard">
        <section className="profile-card">
          <div className="profile-avatar">
            <img src={profile.avatar} alt={`${profile.name} avatar`} />
          </div>
          <div>
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-handle">{profile.username}</p>
            <p className="profile-role">{profile.role}</p>
          </div>

          <ul className="info-list">
            <li className="info-item">
              <span>Location</span>
              <strong>{profile.location}</strong>
            </li>
            <li className="info-item">
              <span>Company</span>
              <strong>{profile.company}</strong>
            </li>
            <li className="info-item">
              <span>Experience</span>
              <strong>{profile.experience}</strong>
            </li>
            <li className="info-item">
              <span>Interests</span>
              <strong>{profile.interests}</strong>
            </li>
          </ul>
        </section>

        <section className="score-panel">
          <div className="score-highlight">
            <div className="circular-score">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle className="bg" cx="60" cy="60" r="52" />
                <circle
                  className="progress"
                  cx="60"
                  cy="60"
                  r="52"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={scoreOffset(scoreData.overall)}
                />
              </svg>
              <div className="score-value">
                <strong>{scoreData.overall}</strong>
                <small>Overall score</small>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card metric-activity">
                <h3>Activity</h3>
                <p>Regular repo work, commits, and contributions.</p>
                <div className="progress-bar">
                  <div className="progress-meter" style={{ width: `${scoreData.activity}%` }} />
                </div>
              </div>
              <div className="metric-card metric-quality">
                <h3>Code Quality</h3>
                <p>Review scores, lint status, and pull request health.</p>
                <div className="progress-bar">
                  <div className="progress-meter" style={{ width: `${scoreData.quality}%` }} />
                </div>
              </div>
              <div className="metric-card metric-community">
                <h3>Community</h3>
                <p>Open-source involvement, feedback, and collaboration.</p>
                <div className="progress-bar">
                  <div className="progress-meter" style={{ width: `${scoreData.community}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
