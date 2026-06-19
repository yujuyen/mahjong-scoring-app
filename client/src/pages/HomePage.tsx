import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sessionAPI, type Session } from '../services/api';
import { formatDateTime } from '../utils/dateFormat';
import '../styles/HomePage.css';

function HomePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await sessionAPI.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: number, sessionName: string) => {
    e.preventDefault(); // Prevent navigation to session page

    if (!confirm(`Are you sure you want to delete "${sessionName}"?\n\nThis will permanently delete all hands, scores, and player data for this session.`)) {
      return;
    }

    try {
      await sessionAPI.deleteSession(sessionId);
      // Remove from local state
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('Failed to delete session. Please try again.');
    }
  };

  return (
    <div className="home-page">
      <div className="welcome">
        <h2>Welcome to Mahjong Scoring</h2>
        <p>Track your Hong Kong Mahjong games with ease</p>
        <Link to="/new-session" className="btn btn-primary">
          Start New Session
        </Link>
      </div>

      <div className="sessions-list">
        <h3>Recent Sessions</h3>
        {loading ? (
          <p>Loading...</p>
        ) : sessions.length === 0 ? (
          <p className="empty-state">No sessions yet. Start your first game!</p>
        ) : (
          <div className="sessions-grid">
            {sessions.map((session) => (
              <div key={session.id} className="session-card-wrapper">
                <Link
                  to={`/session/${session.id}`}
                  className="session-card"
                >
                  <h4>{session.name}</h4>
                  <p className="session-date">
                    {formatDateTime(session.created_at)}
                  </p>
                  <span className={`status-badge ${session.status}`}>
                    {session.status}
                  </span>
                </Link>
                <button
                  onClick={(e) => handleDeleteSession(e, session.id, session.name)}
                  className="btn-delete-session"
                  title="Delete session"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
