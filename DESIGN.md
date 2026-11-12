# Design Document: Bulls and Cows

## 1. Data Structures and Algorithms

### Game State

The game state is represented as an immutable object `GameState` in `src/state/state.ts`.
History is stored as an array of `HistoryEntry` objects. Updates are done purely immutably via `[...state.history, entry]` to prevent side effects.

### `evaluateGuess` Algorithm

Implemented in `src/core/evaluateGuess.ts` using Higher-Order Functions (HOFs) without manual `for` loops.

- **Bulls** are calculated using `.filter()` on the guess array, comparing characters at the same index.
- **Cows** are calculated by finding the intersection of unique characters (using `Set`) and subtracting the number of bulls.

### `countPossibleSecrets` Algorithm

Implemented in `src/core/countPossibleSecrets.ts` using recursion: \(P(base, length) = base \times P(base - 1, length - 1)\).
It uses **memoization** via a `Map` to cache results and avoid recalculating the same branches, turning the complexity from exponential to linear for repeated calls.

## 2. Complexity (Big O)

- **`generateSecret(length, base, random)`**: \(O(base)\) time complexity. Since we shuffle the entire array of available digits (length `base`) using the Fisher-Yates algorithm before slicing, the time complexity depends on the base, not the length of the secret. Space complexity is also \(O(base)\) to store the shuffled array.
- **`evaluateGuess(secret, guess)`**: \(O(n)\) time complexity, where \(n\) is the length of the secret. We iterate over the strings a constant number of times (for bulls, for Set creation, for intersections). Space complexity is \(O(n)\) to store the Sets.
- **`isValidGuess(guess, length, base)`**: \(O(n)\) time complexity, where \(n\) is the length of the guess. Checking length is \(O(1)\), filtering characters is \(O(n)\), and checking uniqueness via `Set` is \(O(n)\).
- **`countPossibleSecrets(length, base)`**: \(O(length)\) time complexity with memoization (without it, it would be \(O(base! / (base-length)!)\)). Space complexity is \(O(length)\) for the recursion call stack and the `Map` cache.

## 3. Clean Code Principles

- **DOM Manipulation Safety**: We use a custom `el()` helper (`src/ui/dom.ts`) to create and configure DOM elements. This avoids the use of `innerHTML` or `insertAdjacentHTML` entirely, ensuring safety against XSS and complying with the task requirements.
- **Pure Functions & Immutability**: All core game logic in `src/core/` consists of pure functions (no side effects, no DOM access). The `random` parameter in `generateSecret` is injected to ensure deterministic tests.
- **Higher-Order Functions**: `evaluateGuess` and `isValidGuess` heavily utilize `filter`, `some`, and `every` instead of `for` loops, making the code declarative.
- **Currying**: `createDigitValidator(base)` in `src/core/createDigitValidator.ts` returns a predicate function. It is reused in `isValidGuess` and in the UI (`src/ui/game.ts`) for real-time input filtering, adhering to DRY.
- **Separation of Concerns**:
  - `src/core/` — pure business logic.
  - `src/state/` — immutable state transitions.
  - `src/services/` — side effects (localStorage, Audio).
  - `src/ui/` — DOM rendering using a custom `el()` helper (no `innerHTML`).
