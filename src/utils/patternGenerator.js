// =============================================
// utils/patternGenerator.js
// Generates actual pattern outputs for N=5
// based on pattern number extracted from title.
// =============================================

function repeat(char, n) { return char.repeat(Math.max(0, n)); }

export function generatePattern(patternNum, N = 5) {
  const lines = [];
  switch (patternNum) {
    // Pattern 1: N×N solid rectangle of *
    case 1:
      for (let i = 0; i < N; i++) lines.push(repeat('*', N));
      break;

    // Pattern 2: Right-angle triangle *, **, ***...
    case 2:
      for (let i = 1; i <= N; i++) lines.push(repeat('*', i));
      break;

    // Pattern 3: 1, 12, 123, 1234...
    case 3:
      for (let i = 1; i <= N; i++) {
        let row = '';
        for (let j = 1; j <= i; j++) row += j;
        lines.push(row);
      }
      break;

    // Pattern 4: 1, 22, 333, 4444...
    case 4:
      for (let i = 1; i <= N; i++) lines.push(repeat(String(i), i));
      break;

    // Pattern 5: Inverted *, ****, ***...
    case 5:
      for (let i = N; i >= 1; i--) lines.push(repeat('*', i));
      break;

    // Pattern 6: 12345, 1234, 123...
    case 6:
      for (let i = N; i >= 1; i--) {
        let row = '';
        for (let j = 1; j <= i; j++) row += j;
        lines.push(row);
      }
      break;

    // Pattern 7: Pyramid (spaces + stars)
    case 7:
      for (let i = 1; i <= N; i++) {
        lines.push(repeat(' ', N - i) + repeat('*', 2 * i - 1));
      }
      break;

    // Pattern 8: Inverted pyramid
    case 8:
      for (let i = N; i >= 1; i--) {
        lines.push(repeat(' ', N - i) + repeat('*', 2 * i - 1));
      }
      break;

    // Pattern 9: Diamond (pyramid + inverted)
    case 9:
      for (let i = 1; i <= N; i++)
        lines.push(repeat(' ', N - i) + repeat('*', 2 * i - 1));
      for (let i = N - 1; i >= 1; i--)
        lines.push(repeat(' ', N - i) + repeat('*', 2 * i - 1));
      break;

    // Pattern 10: Half diamond (1,2,3...N...3,2,1 stars)
    case 10:
      for (let i = 1; i <= N; i++) lines.push(repeat('*', i));
      for (let i = N - 1; i >= 1; i--) lines.push(repeat('*', i));
      break;

    // Pattern 11: Binary triangle
    case 11:
      for (let i = 1; i <= N; i++) {
        let row = '';
        let val = (i % 2 === 0) ? 0 : 1;
        for (let j = 1; j <= i; j++) {
          row += val + ' ';
          val = 1 - val;
        }
        lines.push(row.trim());
      }
      break;

    // Pattern 12: Number sequence rows
    case 12:
      let num = 1;
      for (let i = 1; i <= N; i++) {
        let row = '';
        for (let j = 1; j <= i; j++) row += (num++) + ' ';
        lines.push(row.trim());
      }
      break;

    // Pattern 13: Alphabet triangle A, AB, ABC...
    case 13:
      for (let i = 0; i < N; i++) {
        let row = '';
        for (let j = 0; j <= i; j++) row += String.fromCharCode(65 + j);
        lines.push(row);
      }
      break;

    // Pattern 14: Inverted alphabet triangle
    case 14:
      for (let i = N; i >= 1; i--) {
        let row = '';
        for (let j = 0; j < i; j++) row += String.fromCharCode(65 + j);
        lines.push(row);
      }
      break;

    // Pattern 15: Alphabet repeat per row (A, BB, CCC...)
    case 15:
      for (let i = 0; i < N; i++) {
        lines.push(repeat(String.fromCharCode(65 + i), i + 1));
      }
      break;

    // Pattern 16: Alphabet pyramid
    case 16:
      for (let i = 0; i < N; i++) {
        let row = repeat(' ', N - i - 1);
        for (let j = 0; j <= i; j++) row += String.fromCharCode(65 + j);
        for (let j = i - 1; j >= 0; j--) row += String.fromCharCode(65 + j);
        lines.push(row);
      }
      break;

    // Pattern 17: Alpha-hour-glass (A, ABA, ABCBA...)
    case 17:
      for (let i = 0; i < N; i++) {
        let row = repeat(' ', N - i - 1);
        let ch = 'A';
        for (let j = 0; j < 2 * i + 1; j++) {
          row += ch;
          if (j < i) ch = String.fromCharCode(ch.charCodeAt(0) + 1);
          else ch = String.fromCharCode(ch.charCodeAt(0) - 1);
        }
        lines.push(row);
      }
      break;

    // Pattern 18: E, DE, CDE, BCDE, ABCDE (from bottom)
    case 18:
      for (let i = 0; i < N; i++) {
        let row = '';
        for (let j = N - 1 - i; j < N; j++) {
          row += String.fromCharCode(65 + j) + ' ';
        }
        lines.push(row.trim());
      }
      break;

    // Pattern 19: Symmetric butterfly top+bottom
    case 19:
      for (let i = N; i >= 1; i--) {
        lines.push(repeat('*', i) + repeat(' ', 2 * (N - i)) + repeat('*', i));
      }
      for (let i = 1; i <= N; i++) {
        lines.push(repeat('*', i) + repeat(' ', 2 * (N - i)) + repeat('*', i));
      }
      break;

    // Pattern 20: Solid rhombus / hourglass
    case 20: {
      const total = 2 * N - 1;
      for (let i = 1; i <= total; i++) {
        const stars = i <= N ? i : total - i + 1;
        const spaces = 2 * (N - stars);
        lines.push(repeat('*', stars) + repeat(' ', spaces) + repeat('*', stars));
      }
      break;
    }

    // Pattern 21: N×N rectangle with * border only
    case 21:
      for (let i = 0; i < N; i++) {
        let row = '';
        for (let j = 0; j < N; j++) {
          row += (i === 0 || j === 0 || i === N - 1 || j === N - 1) ? '*' : ' ';
        }
        lines.push(row);
      }
      break;

    // Pattern 22: Number spiral (n, n-1 ... 1 ... n-1, n)
    case 22: {
      const size = 2 * N - 1;
      const grid = Array.from({ length: size }, () => Array(size).fill(0));
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const top = i, left = j, right = size - 1 - j, bottom = size - 1 - i;
          grid[i][j] = N - Math.min(top, left, right, bottom);
        }
      }
      grid.forEach(row => lines.push(row.join(' ')));
      break;
    }

    default:
      return null;
  }
  return lines.join('\n');
}

/** Extract pattern number from title like "Pattern 1", "Pattern 22" */
export function getPatternNumber(title) {
  const m = title?.match(/pattern\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}
