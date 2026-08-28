import type { Hand, Player } from '../services/api';
import { handAPI } from '../services/api';
import { formatDateTimeFull } from '../utils/dateFormat';
import { calculatePayments } from '../utils/handCalculations';
import '../styles/HandHistory.css';

interface HandHistoryProps {
  hands: Hand[];
  players: Player[];
  onHandDeleted?: () => void;
  onHandEdit?: (hand: Hand) => void;
}

function HandHistory({ hands, players, onHandDeleted, onHandEdit }: HandHistoryProps) {
  if (hands.length === 0) {
    return <p className="empty-state">No hands recorded yet</p>;
  }

  const handleDelete = async (handId: number) => {
    if (!window.confirm('Are you sure you want to delete this hand? This will update all player scores.')) {
      return;
    }

    try {
      await handAPI.deleteHand(handId);
      if (onHandDeleted) {
        onHandDeleted();
      }
    } catch (error) {
      console.error('Error deleting hand:', error);
      alert('Failed to delete hand');
    }
  };

  return (
    <div className="hand-history">
      {hands.map((hand, index) => {
        const payments = calculatePayments(hand, players);
        const isSelfDrawn = !hand.loser_id;
        const handNumber = hands.length - index;

        return (
          <div key={hand.id} className="hand-card">
            <div className="hand-header">
              <span className="hand-number">Hand #{handNumber}</span>
              <span className="winner">🀄 {hand.winner_name}</span>
              <span className="hand-type-label">
                {isSelfDrawn ? 'Self-drawn' : 'Discard'}
              </span>
              <div className="hand-actions">
                {onHandEdit && (
                  <button
                    className="btn-edit"
                    onClick={() => onHandEdit(hand)}
                    title="Edit hand"
                  >
                    ✏️
                  </button>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(hand.id)}
                  title="Delete hand"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="hand-details">
              <div className="hand-stats">
                <span className="fan-count">{hand.fan_count} Fan</span>
                <span className="base-points">{hand.base_points} points</span>
              </div>
            </div>

            {/* Show all player payments */}
            <div className="hand-payments">
              {payments.map(payment => {
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
                <img
                  src={`http://localhost:3001/${hand.image_path}`}
                  alt="Hand"
                />
              </div>
            )}
            {hand.notes && <div className="hand-notes">{hand.notes}</div>}
            <div className="hand-time">
              {formatDateTimeFull(hand.created_at)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HandHistory;
