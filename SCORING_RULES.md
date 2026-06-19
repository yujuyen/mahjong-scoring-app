# Hong Kong Mahjong Scoring Rules

This app implements the **Full Spicy (全辣)** scoring system as documented on [Wikipedia](https://en.wikipedia.org/wiki/Hong_Kong_mahjong_scoring_rules).

## Base Points Calculation

**Formula:** Points = 2^fan

| Fan (番) | Base Points |
|----------|-------------|
| 3 fan    | 8           |
| 4 fan    | 16          |
| 5 fan    | 32          |
| 6 fan    | 64          |
| 7 fan    | 128         |
| 8 fan    | 256         |
| 9 fan    | 512         |
| 10 fan   | 1,024       |
| 13 fan   | 8,192       |

## Minimum and Maximum

- **Minimum:** 3 fan required to win
- **Maximum:** 13 fan (absolute limit)

## Payment Rules

### Win from Discard (食糊)
- **Discarder pays all**
- Winner receives: Base points
- Loser pays: Base points

**Example:** 3 fan win from discard
- Winner: +8 points
- Discarder: -8 points
- Others: 0 points

### Self-Drawn Win (自摸)
- **All 3 opponents pay**
- Each opponent pays: Base points × 1.5
- Winner receives: Base points × 1.5 × 3 = Base × 4.5

**Example:** 3 fan self-drawn
- Winner: +36 points (12 from each player)
- Each loser: -12 points

## Hand Patterns

### Limit Hands (13 fan)
- **Thirteen Orphans** (十三么九) - 13 fan
- **Nine Gates** (九蓮寶燈) - 13 fan  
- **Big Four Winds** (大四喜) - 13 fan
- **Four Kongs** (四槓子) - 13 fan

### Limit Hands (10 fan)
- **All Honors** (字一色) - 10 fan
- **All Terminals** (清么九) - 10 fan
- **All Concealed Triplets** (門前清對對和) - 10 fan

### High-Value Hands
- **Big Three Dragons** (大三元) - 8 fan
- **All One Suit** (清一色) - 7 fan

### Medium-Value Hands
- **Mixed One Suit** (混一色) - 3 fan (one suit + honors)
- **All Triplets** (對對和) - 3 fan (all pongs/kongs)
- **Seven Pairs** (七對子) - 3 fan (needs +1 bonus fan)

### Bonus Fans (+1 each)
- **Self-Drawn** (自摸) - +1 fan
- **Fully Concealed** (門前清) - +1 fan
- **Dragon Triplet** (番牌) - +1 fan per dragon meld
- **Seat Wind** (門風) - +1 fan if matches your seat
- **Prevailing Wind** (場風) - +1 fan if matches round wind
- **Flower/Season** (花牌) - +1 fan per matching flower

## Scoring Examples

### Example 1: Basic 3 Fan Hand
- Hand: All Triplets (3 fan)
- Win: From discard
- **Result:** Winner +8, Discarder -8

### Example 2: 4 Fan Self-Drawn
- Hand: Mixed One Suit (3 fan) + Self-Drawn (+1 fan) = 4 fan
- Base: 16 points
- Self-drawn bonus: 16 × 1.5 = 24 per player
- **Result:** Winner +72 (24×3), Each loser -24

### Example 3: Pure Hand
- Hand: All One Suit (7 fan)
- Win: From discard
- Base: 128 points
- **Result:** Winner +128, Discarder -128

### Example 4: Limit Hand
- Hand: Thirteen Orphans (13 fan)
- Win: Self-drawn
- Base: 8,192 points
- Each pays: 8,192 × 1.5 = 12,288
- **Result:** Winner +36,864, Each loser -12,288

## Notes

- **Minimum 3 fan rule:** You cannot win with less than 3 fan
- **Fan accumulate:** Multiple bonuses add together (e.g., Self-drawn + Concealed = +2 fan)
- **Limit hands ignore bonuses:** 13 fan hands don't count flowers/wind bonuses
- This is the **Full Spicy** system where points double with every fan
- Alternative **Half Spicy** system exists but is NOT implemented here
