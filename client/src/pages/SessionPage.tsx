import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI, handAPI, type Session, type LeaderboardEntry, type Hand } from '../services/api';
import HandEntry from '../components/HandEntry';
import Leaderboard from '../components/Leaderboard';
import HandHistory from '../components/HandHistory';
import { formatDateTime } from '../utils/dateFormat';
import '../styles/SessionPage.css';

function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [hands, setHands] = useState<Hand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHandEntry, setShowHandEntry] = useState(false);
  const [editingHand, setEditingHand] = useState<Hand | null>(null);

  useEffect(() => {
    if (id) {
      loadSessionData();
    }
  }, [id]);

  const loadSessionData = async () => {
    if (!id) return;

    try {
      const [sessionData, leaderboardData, handsData] = await Promise.all([
        sessionAPI.getSession(parseInt(id)),
        sessionAPI.getLeaderboard(parseInt(id)),
        handAPI.getSessionHands(parseInt(id)),
      ]);

      setSession(sessionData);
      setLeaderboard(leaderboardData);
      setHands(handsData);
    } catch (error) {
      console.error('Failed to load session data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHandSubmitted = () => {
    setShowHandEntry(false);
    setEditingHand(null);
    loadSessionData();
  };

  const handleHandEdit = (hand: Hand) => {
    setEditingHand(hand);
    setShowHandEntry(true);
  };

  const handleCompleteSession = async () => {
    if (!id || !confirm('Are you sure you want to complete this session?')) return;

    try {
      await sessionAPI.completeSession(parseInt(id));
      loadSessionData();
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  };

  const handleDeleteSession = async () => {
    if (!id || !session) return;

    if (!confirm(`Are you sure you want to delete "${session.name}"?\n\nThis will permanently delete all hands, scores, and player data for this session.`)) {
      return;
    }

    try {
      await sessionAPI.deleteSession(parseInt(id));
      navigate('/'); // Redirect to home page after deletion
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('Failed to delete session. Please try again.');
    }
  };

  if (loading) {
    return <div className="session-page loading">Loading session...</div>;
  }

  if (!session) {
    return <div className="session-page error">Session not found</div>;
  }

  return (
    <div className="session-page">
      <div className="session-header">
        <h2>{session.name}</h2>
        <div className="session-meta">
          <span className={`status-badge ${session.status}`}>{session.status}</span>
          <span className="date">
            {formatDateTime(session.created_at)}
          </span>
        </div>
        <div className="session-actions">
          {session.status === 'active' && (
            <>
              <button
                onClick={() => setShowHandEntry(!showHandEntry)}
                className="btn btn-primary"
              >
                {showHandEntry ? 'Cancel' : '+ Record Hand'}
              </button>
              <button onClick={handleCompleteSession} className="btn btn-secondary">
                End Session
              </button>
            </>
          )}
          <button onClick={handleDeleteSession} className="btn btn-danger">
            Delete Session
          </button>
        </div>
      </div>

      {showHandEntry && session.players && (
        <HandEntry
          sessionId={parseInt(id!)}
          players={session.players}
          handNumber={hands.length + 1}
          onSubmitted={handleHandSubmitted}
          onCancel={() => {
            setShowHandEntry(false);
            setEditingHand(null);
          }}
          editingHand={editingHand}
        />
      )}

      <div className="session-content">
        <div className="section">
          <h3>Leaderboard</h3>
          <Leaderboard entries={leaderboard} />
        </div>

        <div className="section">
          <h3>Hand History</h3>
          <HandHistory
            hands={hands}
            players={session.players || []}
            onHandDeleted={loadSessionData}
            onHandEdit={handleHandEdit}
          />
        </div>
      </div>
    </div>
  );
}

export default SessionPage;
