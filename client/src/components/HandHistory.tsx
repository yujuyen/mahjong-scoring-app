import { useState } from 'react';
import type { Hand, Player } from '../services/api';
import HandDetail from './HandDetail';
import '../styles/HandHistory.css';

interface HandHistoryProps {
  hands: Hand[];
  players: Player[];
  onHandEdit: (hand: Hand) => void;
  onHandDeleted: () => void;
}

function HandHistory({ hands, players, onHandEdit, onHandDeleted }: HandHistoryProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (hands.length === 0) {
    return <p className="empty-state">No hands recorded yet</p>;
  }

  return (
    <div className="hand-history">
      {hands.map((hand, index) => {
        const handNumber = hands.length - index;
        const isOpen = expandedId === hand.id;
        const isSelfDrawn = !hand.loser_id;

        return (
          <div key={hand.id} className="hand-item">
            <button
              className={`hand-row ${isOpen ? 'open' : ''}`}
              onClick={() => setExpandedId(isOpen ? null : hand.id)}
              aria-expanded={isOpen}
              title={isOpen ? 'Hide details' : 'Show details'}
            >
              <span className="hand-row-number">#{handNumber}</span>
              <span className="hand-row-winner">🀄 {hand.winner_name}</span>
              <span className={`hand-row-type ${isSelfDrawn ? 'self-drawn' : 'discard'}`}>
                {isSelfDrawn ? 'Self-drawn' : 'Discard'}
              </span>
              <span className="hand-row-fan">{hand.fan_count} Fan</span>
              <span className="hand-row-points">+{hand.total_points}</span>
              <span className="hand-row-caret" aria-hidden="true">▾</span>
            </button>

            {isOpen && (
              <div className="hand-detail-wrap">
                <HandDetail
                  hand={hand}
                  players={players}
                  onEdit={onHandEdit}
                  onDeleted={() => {
                    setExpandedId(null);
                    onHandDeleted();
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default HandHistory;
