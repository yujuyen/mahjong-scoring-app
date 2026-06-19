import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import '../styles/NewSessionPage.css';

function NewSessionPage() {
  const navigate = useNavigate();
  const [sessionName, setSessionName] = useState('');
  const [players, setPlayers] = useState<string[]>(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    setPlayers([...players, '']);
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const filledPlayers = players.filter((p) => p.trim() !== '');

    if (!sessionName.trim()) {
      setError('Please enter a session name');
      return;
    }

    if (filledPlayers.length < 2) {
      setError('Please enter at least 2 player names');
      return;
    }

    setLoading(true);
    try {
      const response = await sessionAPI.createSession(sessionName, filledPlayers);
      navigate(`/session/${response.sessionId}`);
    } catch (err) {
      setError('Failed to create session. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-session-page">
      <h2>Start New Session</h2>
      <form onSubmit={handleSubmit} className="session-form">
        <div className="form-group">
          <label htmlFor="sessionName">Session Name</label>
          <input
            id="sessionName"
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="e.g., Friday Night Game"
            required
          />
        </div>

        <div className="form-group">
          <label>Players</label>
          {players.map((player, index) => (
            <div key={index} className="player-input">
              <input
                type="text"
                value={player}
                onChange={(e) => handlePlayerChange(index, e.target.value)}
                placeholder={`Player ${index + 1}`}
              />
              {players.length > 2 && (
                <button
                  type="button"
                  onClick={() => removePlayer(index)}
                  className="btn btn-remove"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addPlayer} className="btn btn-secondary">
            + Add Player
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating...' : 'Start Session'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewSessionPage;
