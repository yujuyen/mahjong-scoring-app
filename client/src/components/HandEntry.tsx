import { useState, useEffect } from 'react';
import { handAPI, type Player, type Hand } from '../services/api';
import '../styles/HandEntry.css';

interface HandEntryProps {
  sessionId: number;
  players: Player[];
  handNumber: number;
  onSubmitted: () => void;
  onCancel: () => void;
  editingHand?: Hand | null;
}

function HandEntry({ sessionId, players, handNumber, onSubmitted, onCancel, editingHand }: HandEntryProps) {
  const [winnerId, setWinnerId] = useState<number | ''>('');
  const [discarderId, setDiscarderId] = useState<number | ''>('');
  const [fanCount, setFanCount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingHand) {
      setWinnerId(editingHand.winner_id);
      setDiscarderId(editingHand.loser_id || '');
      setFanCount(editingHand.fan_count);
      setNotes(editingHand.notes || '');
    }
  }, [editingHand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!winnerId) {
      setError('Please select a winner');
      return;
    }

    if (!fanCount) {
      setError('Please enter fan count');
      return;
    }

    // Self-drawn = no discarder selected
    const isSelfDrawn = !discarderId;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('sessionId', sessionId.toString());
      formData.append('winnerId', winnerId.toString());
      if (discarderId) formData.append('loserId', discarderId.toString());
      formData.append('fanCount', fanCount.toString());
      formData.append('handDescription', notes || '');
      formData.append('isSelfDrawn', isSelfDrawn.toString());
      formData.append('isDealer', 'false'); // Not using dealer logic

      if (editingHand) {
        await handAPI.updateHand(editingHand.id, formData);
      } else {
        await handAPI.submitHand(formData);
      }
      onSubmitted();
    } catch (err) {
      setError(`Failed to ${editingHand ? 'update' : 'submit'} hand. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hand-entry">
      <h3>{editingHand ? 'Edit Hand' : `Record Hand #${handNumber}`}</h3>
      <form onSubmit={handleSubmit} className="hand-form">
        <div className="form-row">
          <div className="form-group">
            <label>Winner (贏家)</label>
            <select
              value={winnerId}
              onChange={(e) => setWinnerId(Number(e.target.value))}
              required
            >
              <option value="">Select winner</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Discarder (放銃) - Leave empty for self-drawn</label>
            <select
              value={discarderId}
              onChange={(e) => setDiscarderId(Number(e.target.value) || '')}
            >
              <option value="">None (Self-drawn 自摸)</option>
              {players
                .filter((p) => p.id !== winnerId)
                .map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Fan Count (番)</label>
          <input
            type="number"
            min="1"
            max="13"
            value={fanCount}
            onChange={(e) => setFanCount(Number(e.target.value) || '')}
            placeholder="Enter fan count (1-13)"
            required
          />
          <small className="help-text">Enter fan count (1-13). Leave discarder empty for self-drawn (自摸)</small>
        </div>

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional details about the hand..."
            rows={3}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? (editingHand ? 'Updating...' : 'Submitting...') : (editingHand ? 'Update Hand' : 'Submit Hand')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default HandEntry;
