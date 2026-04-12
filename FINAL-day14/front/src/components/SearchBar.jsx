import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

export default function SearchBar() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    let input = username.trim();

    if (!input) {
      setError('Please enter a GitHub username or profile URL');
      return;
    }

    // Extract username if a GitHub URL is provided
    const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)?github\.com\/([^/?#]+)/i;
    const match = input.match(urlPattern);
    
    let processedUsername = input;
    if (match) {
      processedUsername = match[3];
    } else if (input.includes('://') || input.includes('.')) {
      // It looks like a URL but NOT a GitHub URL
      setError('Please provide a valid GitHub profile URL or username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/profile/${processedUsername}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'User not found');
        setLoading(false);
        return;
      }
      navigate(`/report/${processedUsername}`);
    } catch (err) {
      setError('Error fetching profile. Make sure the server is running.');
      setLoading(false);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
