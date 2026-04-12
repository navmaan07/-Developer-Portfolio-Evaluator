import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  const handleHome = () => {
    navigate('/')
  }

  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <button onClick={handleHome} className="home-button">Go Home</button>
    </div>
  )
}