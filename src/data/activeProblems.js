// =============================================
// data/activeProblems.js
// Only problems that have BOTH Python AND Java code,
// OR are after id=11 with at least one language.
// Excludes setup/theory-only pages (ids 1-11) which are
// language-setup entries, not actual programming problems.
// =============================================
import { PROBLEMS_DATA } from './problems.js';

// IDs to always exclude — these are theory/setup pages with no real problems
const EXCLUDED_IDS = new Set([
  1,  // What is Programming?        (no code)
  2,  // Flowcharts and Logical Thinking (no code)
  3,  // CPP Setup                   (no code)
  4,  // Cpp Basics                  (no code)
  5,  // Java Setup                  (no code)
  6,  // Java Basics                 (Java only - setup)
  7,  // Java OOPs Basic             (Java only - setup)
  8,  // Python Setup                (Python only - setup)
  9,  // Python Basics               (Python only - setup)
  10, // Python Libraries Part 1     (Python only - setup)
  11, // Python Libraries Part 2     (Python only - setup)
  19, // Easy and Medium             (no code - section header)
  20, // Hard                        (no code - section header)
  43, // Theory with examples        (no code)
  44, // STL                         (no code)
  46, // Basic Maths                 (no code)
  49, // Basic String                (no code)
  178,// Deletion in Linked List     (no code)
  179,// Insertion in Linked List    (no code)
  189,// Deletion in Doubly LL       (no code)
  190,// Insertion in DLL            (no code)
  221,// Introduction to Bits        (no code)
  251,// Implementation using diff DS (no code)
  304,// Introduction to BST         (no code)
  318,// Heaps (Theory Video)        (no code)
  361,// MST theory                  (no code)
]);

export const ACTIVE_PROBLEMS = PROBLEMS_DATA.filter(
  p => !EXCLUDED_IDS.has(p.id) && (p.hasPython || p.hasJava)
);

export default ACTIVE_PROBLEMS;
