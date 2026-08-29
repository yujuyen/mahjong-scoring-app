import type { Hand, Player } from '../services/api';
import { handAPI } from '../services/api';
import { formatDateTimeFull } from '../utils/dateFormat';
import { calculatePayments } from '../utils/handCalculations';
import '../styles/HandHistory.css';

interface HandDetailProps {
  hand: Hand;
  players: Player[];
  onEdit: (hand: Hand) => void;
  onDeleted: () => void;
}

function HandDetail({ hand, players, onEdit, onDeleted }: HandDetailProps) {
  const isSelfDrawn = !hand.loser_id;
  const payments = calculatePayments(hand, players);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this hand? This will update all player scores.')) {
      return;
    }
    try {
      await handAPI.deleteHand(hand.id);
      onDeleted();
    } catch (error) {
      console.error('Error deleting hand:', error);
      alert('Failed to delete hand');
    }
  };

  return (
    <div className="hand-detail">
      <div className="hand-detail-summary">
        <span className="winner">🀄 {hand.winner_name}</span>
        <span className="hand-type-label">{isSelfDrawn ? 'Self-drawn' : 'Discard'}</span>
      </div>

      <div className="hand-stats">
        <span className="fan-count">{hand.fan_count} Fan</span>
        <span className="base-points">{hand.base_points} base points</span>
        <span className="base-points">Winning points: {hand.total_points}</span>
      </div>

      <div className="hand-payments">
        {payments.map((payment) => {
          const isDiscarder = !isSelfDrawn && payment.playerId === hand.loser_id;
          return (
            <div
              key={payment.playerId}
              className={`payment-item ${payment.amount > 0 ? 'winner' : 'loser'}`}
            >
              <span className="player-name">
                {payment.playerName}
                {isDiscarder && <span className="discarder-badge">Discarder</span>}
              </span>
              <span className={`payment-amount ${payment.amount > 0 ? 'positive' : 'negative'}`}>
                {payment.amount > 0 ? '+' : ''}{payment.amount}
              </span>
            </div>
          );
        })}
      </div>

      {hand.image_path && (
        <div className="hand-image">
          <img src={`http://localhost:3001/${hand.image_path}`} alt="Hand" />
        </div>
      )}

      {hand.notes && <div className="hand-notes">{hand.notes}</div>}

      <div className="hand-time">{formatDateTimeFull(hand.created_at)}</div>

      <div className="hand-detail-actions">
        <button className="btn btn-secondary" onClick={() => onEdit(hand)}>
          ✏️ Edit
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default HandDetail;
