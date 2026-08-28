import type { Hand, Player } from '../services/api';

export interface PlayerPayment {
  playerId: number;
  playerName: string;
  amount: number;
}

/**
 * Calculate the point change for each player for a single hand.
 * Winner gains points; losers pay based on self-drawn vs. discard rules.
 */
export function calculatePayments(hand: Hand, players: Player[]): PlayerPayment[] {
  const basePoints = hand.base_points;
  const winnerId = hand.winner_id;
  const discarderId = hand.loser_id;
  const isSelfDrawn = !discarderId;

  const payments: PlayerPayment[] = [];

  players.forEach(player => {
    if (player.id === winnerId) {
      // Winner gets total points
      payments.push({
        playerId: player.id,
        playerName: player.name,
        amount: hand.total_points,
      });
    } else if (isSelfDrawn) {
      // Self-drawn: all losers pay equally
      const totalPoints = Math.round(basePoints * 1.5);
      const eachPays = Math.round(totalPoints / 3);
      payments.push({
        playerId: player.id,
        playerName: player.name,
        amount: -eachPays,
      });
    } else if (player.id === discarderId) {
      // Discarder pays half
      const discarderPays = Math.round(basePoints / 2);
      payments.push({
        playerId: player.id,
        playerName: player.name,
        amount: -discarderPays,
      });
    } else {
      // Others pay quarter
      const othersPay = Math.round(basePoints / 4);
      payments.push({
        playerId: player.id,
        playerName: player.name,
        amount: -othersPay,
      });
    }
  });

  return payments;
}
