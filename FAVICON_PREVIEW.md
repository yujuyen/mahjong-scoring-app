# Favicon Design

## Current Favicon

The app now uses a **Red Dragon (中) Mahjong Tile** as the favicon!

### Design Details

**Visual Elements:**
- 🀄 Mahjong tile with beige/ivory background (`#f5f5dc`)
- Red Dragon (中) character in red (`#dc3545`)
- Dark gray border for tile definition
- Subtle shadow for 3D depth effect

**The Red Dragon (中) Character:**
- One of the three dragon tiles in Mahjong
- 中 means "middle" or "center" in Chinese
- Iconic and instantly recognizable to Mahjong players
- Rendered in traditional square border style

### File Location
`client/public/favicon.svg`

### Browser Display
- **Chrome/Firefox/Edge:** Shows SVG favicon
- **Safari:** Shows SVG favicon
- **iOS Safari:** Uses apple-touch-icon
- **Tab Title:** 🀄 Mahjong Scoring

### Design Rationale

The Red Dragon tile was chosen because:
1. **Most recognizable** - It's one of the honor tiles all Mahjong players know
2. **Simple & clear** - The 中 character is distinct even at small sizes (16x16px)
3. **Culturally appropriate** - Uses the actual character from the game
4. **Good contrast** - Red on ivory stands out in browser tabs
5. **Professional** - Looks polished and authentic

### Alternative Icons (Not Used)

Other options considered:
- 🀀 East Wind tile (too similar to text)
- 🀆 Bamboo One (green, less distinctive)
- Generic mahjong tile pattern (less recognizable)
- Plain tile icon (less interesting)

## How to View

1. Hard refresh your browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Check your browser tab - you should see the mahjong tile icon
3. Look at bookmarks - the icon will appear there too

## Technical Details

- Format: SVG (Scalable Vector Graphics)
- Size: 64x64 viewBox (scales to any size)
- Compatibility: All modern browsers support SVG favicons
- Fallback: Browsers that don't support SVG will use default icon
