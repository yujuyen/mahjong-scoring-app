// Hong Kong Old Style (HKOS) Mahjong Scoring Engine

export interface HandAnalysis {
  handType: string;
  fanCount: number;
  basePoints: number;
  totalPoints: number;
  description: string;
}

// Common hand patterns and their fan values
// Reference: https://en.wikipedia.org/wiki/Hong_Kong_mahjong_scoring_rules
export const HAND_TYPES = {
  // Limit Hands (13 fan)
  THIRTEEN_ORPHANS: { name: 'Thirteen Orphans', fan: 13, description: '十三么九 (13 Wonders)' },
  NINE_GATES: { name: 'Nine Gates', fan: 13, description: '九蓮寶燈 (9 Gates)' },
  BIG_FOUR_WINDS: { name: 'Big Four Winds', fan: 13, description: '大四喜 (Great Winds)' },
  ALL_KONGS: { name: 'Four Kongs', fan: 13, description: '四槓子 (4 Kongs)' },

  // Limit Hands (10 fan)
  ALL_HONORS: { name: 'All Honors', fan: 10, description: '字一色 (All Honor Tiles)' },
  ALL_TERMINALS: { name: 'All Terminals', fan: 10, description: '清么九 (All Terminals)' },
  SELF_TRIPLETS: { name: 'All Concealed Triplets', fan: 10, description: '門前清對對和 (Hidden Pongs)' },
  BIG_THREE_DRAGONS: { name: 'Big Three Dragons', fan: 8, description: '大三元 (3 Dragons)' },

  // High-value Hands (7 fan)
  PURE_HAND: { name: 'All One Suit', fan: 7, description: '清一色 (Pure Hand)' },

  // Medium-value Hands (3-4 fan)
  MIXED_HAND: { name: 'Mixed One Suit', fan: 3, description: '混一色 (One suit + honors)' },
  ALL_TRIPLETS: { name: 'All Triplets', fan: 3, description: '對對和 (All Pongs/Kongs)' },
  SEVEN_PAIRS: { name: 'Seven Pairs', fan: 3, description: '七對子 (7 Pairs - needs +1 fan)' },

  // Basic Hands (1-2 fan)
  COMMON_HAND: { name: 'Common Hand', fan: 3, description: '雞糊 (Sequences - min 3 fan)' },
  ALL_SIMPLES: { name: 'All Simples', fan: 1, description: '斷么九 (No terminals/honors)' },

  // Bonus Fans (+1 each)
  SELF_DRAWN: { name: 'Self-Drawn', fan: 1, description: '自摸 (+1 fan bonus)' },
  CONCEALED_HAND: { name: 'Fully Concealed', fan: 1, description: '門前清 (+1 fan bonus)' },
  DRAGON_PUNG: { name: 'Dragon Triplet', fan: 1, description: '番牌 (+1 per dragon meld)' },
  SEAT_WIND: { name: 'Seat Wind', fan: 1, description: '門風 (+1 if matches seat)' },
  PREVAILING_WIND: { name: 'Prevailing Wind', fan: 1, description: '場風 (+1 if matches round)' },
  FLOWERS: { name: 'Flower/Season', fan: 1, description: '花牌 (+1 per matching flower)' }
};

// Calculate base points based on fan count
// Using "Full Spicy" system: Points = 2^fan
// Reference: https://en.wikipedia.org/wiki/Hong_Kong_mahjong_scoring_rules
export function calculatePoints(fanCount: number): number {
  // Minimum 1 fan
  if (fanCount < 1) return 0;

  // Maximum 13 fan (absolute limit)
  if (fanCount > 13) fanCount = 13;

  // Full Spicy: 2^fan
  // 1 fan = 2, 2 fan = 4, 3 fan = 8, 4 fan = 16, etc.
  return Math.pow(2, fanCount);
}

// Calculate total score considering self-drawn vs winning from discard
// Payment rules (Simplified for 4-player tracking):
// - Self-drawn: All 3 players pay equally (base / 3 each)
// - Win from discard: Discarder pays 1/2, other 2 players pay 1/4 each
//
// Note: Current system only tracks winner and one loser (discarder).
// For proper 4-player tracking, we show the base points and let the UI
// handle the distribution.
export function calculateTotalScore(
  fanCount: number,
  isSelfDrawn: boolean,
  isDealer: boolean
): { winner: number; eachLoser: number; description: string } {
  const basePoints = calculatePoints(fanCount);

  if (basePoints === 0) {
    return {
      winner: 0,
      eachLoser: 0,
      description: `Invalid: Need minimum 1 fan to win (current: ${fanCount} fan)`
    };
  }

  if (isSelfDrawn) {
    // Self-drawn: Winner gets base × 1.5, divided equally among 3 losers
    // Total points = base × 1.5
    // Each loser pays: (base × 1.5) / 3 = base × 0.5
    const totalPoints = Math.round(basePoints * 1.5);
    const eachPays = Math.round(totalPoints / 3);
    return {
      winner: totalPoints,
      eachLoser: -eachPays,
      description: `Self-drawn: ${fanCount} fan (${basePoints} base × 1.5 = ${totalPoints} points), each player pays ${eachPays}`
    };
  } else {
    // Win from discard:
    // Winner gets: base points total
    // Discarder pays: base / 2
    // Other 2 players pay: base / 4 each
    const discarderPays = Math.round(basePoints / 2);
    const othersPay = Math.round(basePoints / 4);
    return {
      winner: basePoints,
      eachLoser: -discarderPays,
      description: `Win from discard: ${fanCount} fan (${basePoints} points), discarder pays ${discarderPays}, others pay ${othersPay} each`
    };
  }
}

// Analyze a hand description and return scoring details
export function analyzeHand(
  handDescription: string,
  isSelfDrawn: boolean = false,
  isDealer: boolean = false
): HandAnalysis {
  // This is a simplified version - in a real app, this would parse
  // the actual tile composition from image recognition

  let fanCount = 0;
  let handType = 'Common Hand';

  // Parse hand description for patterns (placeholder logic)
  const desc = handDescription.toLowerCase();

  if (desc.includes('thirteen') || desc.includes('orphans')) {
    fanCount = 13;
    handType = HAND_TYPES.THIRTEEN_ORPHANS.name;
  } else if (desc.includes('nine gates')) {
    fanCount = 13;
    handType = HAND_TYPES.NINE_GATES.name;
  } else if (desc.includes('big three dragons') || desc.includes('大三元')) {
    fanCount = 8;
    handType = HAND_TYPES.BIG_THREE_DRAGONS.name;
  } else if (desc.includes('pure') || desc.includes('清一色')) {
    fanCount = 7;
    handType = HAND_TYPES.PURE_HAND.name;
  } else if (desc.includes('seven pairs')) {
    fanCount = 4;
    handType = HAND_TYPES.SEVEN_PAIRS.name;
  } else if (desc.includes('mixed') || desc.includes('混一色')) {
    fanCount = 3;
    handType = HAND_TYPES.MIXED_HAND.name;
  } else if (desc.includes('all triplets') || desc.includes('對對和')) {
    fanCount = 3;
    handType = HAND_TYPES.ALL_TRIPLETS.name;
  } else {
    // Default common hand
    fanCount = 1;
    handType = HAND_TYPES.COMMON_HAND.name;
  }

  // Add self-drawn bonus
  if (isSelfDrawn) {
    fanCount += 1;
  }

  const basePoints = calculatePoints(fanCount);
  const scoreCalc = calculateTotalScore(fanCount, isSelfDrawn, isDealer);

  return {
    handType,
    fanCount,
    basePoints,
    totalPoints: scoreCalc.winner,
    description: scoreCalc.description
  };
}

// Get suggested hand types for manual entry
export function getHandTypeOptions() {
  return Object.entries(HAND_TYPES).map(([key, value]) => ({
    key,
    name: value.name,
    fan: value.fan,
    description: value.description
  }));
}
