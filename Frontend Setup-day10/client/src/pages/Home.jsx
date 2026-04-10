import SearchBar from '../components/SearchBar';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="container">
        <h1>Developer Portfolio Evaluator</h1>
        <p>Analyze your GitHub profile and get a comprehensive portfolio score</p>
        <SearchBar />
        <div className="features">
          <div className="feature">
            <h3>Activity Score</h3>
            <p>Track commits and coding streaks over 90 days</p>
          </div>
          <div className="feature">
            <h3>Code Quality</h3>
            <p>Evaluate repository quality and documentation</p>
          </div>
          <div className="feature">
            <h3>Diversity</h3>
            <p>Assess language and category diversity</p>
          </div>
          <div className="feature">
            <h3>Community</h3>
            <p>Measure followers, stars, and forks</p>
          </div>
          <div className="feature">
            <h3>Hiring Ready</h3>
            <p>Check profile completeness and professionalism</p>
          </div>
        </div>
      </div>
    </div>
  );
}
