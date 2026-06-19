import type { LeaderboardEntry } from '../services/api';
import '../styles/Leaderboard.css';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

function Leaderboard({ entries }: LeaderboardProps) {
  if (entries.length === 0) {
    return <p className="empty-state">No scores yet</p>;
  }

  return (
    <div className="leaderboard">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry.id} className={index === 0 ? 'winner' : ''}>
              <td className="rank">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `#${index + 1}`}
              </td>
              <td className="player-name">{entry.name}</td>
              <td className={`score ${entry.total_score >= 0 ? 'positive' : 'negative'}`}>
                {entry.total_score >= 0 ? '+' : ''}{entry.total_score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
