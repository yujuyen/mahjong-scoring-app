import type { Hand, Player, Session } from '../services/api';
import { calculatePayments } from './handCalculations';
import { formatDateTimeFull } from './dateFormat';

/** Escape a single value for CSV (RFC 4180): wrap in quotes and double any inner quotes. */
function csvCell(value: string | number | null | undefined): string {
  const str = value === null || value === undefined ? '' : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Build a CSV string containing every hand of a session, one row per hand,
 * with a payment column per player plus hand metadata.
 * Hands are expected newest-first (as returned by the API); output is oldest-first.
 */
export function buildSessionCsv(hands: Hand[], players: Player[]): string {
  const orderedHands = [...hands].reverse(); // oldest first for readability

  const header = [
    'Hand #',
    'Date/Time',
    'Winner',
    'Type',
    'Discarder',
    'Fan',
    'Base Points',
    'Winning Points',
    ...players.map(p => p.name),
    'Notes',
  ];

  const rows = orderedHands.map((hand, index) => {
    const isSelfDrawn = !hand.loser_id;
    const payments = calculatePayments(hand, players);
    const paymentById = new Map(payments.map(p => [p.playerId, p.amount]));
    const discarder = players.find(p => p.id === hand.loser_id);

    return [
      index + 1,
      formatDateTimeFull(hand.created_at),
      hand.winner_name ?? '',
      isSelfDrawn ? 'Self-drawn' : 'Discard',
      isSelfDrawn ? '' : discarder?.name ?? '',
      hand.fan_count,
      hand.base_points,
      hand.total_points,
      ...players.map(p => paymentById.get(p.id) ?? 0),
      hand.notes ?? '',
    ].map(csvCell).join(',');
  });

  // Final totals row
  const totals = players.map(player =>
    orderedHands.reduce((sum, hand) => {
      const amount = calculatePayments(hand, players).find(p => p.playerId === player.id)?.amount ?? 0;
      return sum + amount;
    }, 0)
  );
  const totalsRow = [
    '',
    '',
    'TOTAL',
    '',
    '',
    '',
    '',
    '',
    ...totals,
    '',
  ].map(csvCell).join(',');

  return [header.map(csvCell).join(','), ...rows, totalsRow].join('\r\n');
}

/** Trigger a browser download of the session's hands as a CSV file. */
export function downloadSessionCsv(session: Session, hands: Hand[], players: Player[]): void {
  const csv = buildSessionCsv(hands, players);
  // Prepend BOM so Excel opens UTF-8 correctly.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const safeName = (session.name || 'session').replace(/[^a-z0-9_-]+/gi, '_');
  const stamp = new Date().toISOString().slice(0, 10);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeName}_hands_${stamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
