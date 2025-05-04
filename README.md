# 30 Cases – Puzzle Hunt 🎉

A small treasure hunt website with 30 puzzles. It was made for my wife's
30th birthday but can be used quite broadly.

## Features

- Inspired by [30 případů majora Zemana](https://en.wikipedia.org/wiki/Thirty_Cases_of_Major_Zeman)
- 30 puzzles, each with a lock and a random filename (to avoid skipping ahead)
- Answers are checked via SHA-256 hashes (not stored in plain text)
- Bonus rounds every 5th puzzle (to give out presents/prizes)
- Hints system, images, responsive design, ...
- Texts in Czech but can be easily switched to English

## Customisation

- Come up with puzzles and generate answer hashes using `utils/answers-hashing.js`
- Edit puzzles, (hashed) answers, hints, and bonuses in `public/puzzles.json`
- Change index/intro/outro in `index.html`, `welcome.html`, and `goodbye.html`
- Adjust styles in `src/style.css` and favicon in `public/favicon.ico`
- Translate UI and puzzle texts if needed (currently Czech)

## Deployment

- Build:  
  ```
  npm install
  npm run build
  ```
- Deploy the `dist/` folder to Netlify or any static host

## Notes

- Uses Vite, `js-sha256`, and `canvas-confetti`
- Has puzzles in `puzzles/`, logic in `src/`, data in `public/`

## Puzzle Ideas

### Classics
- Caesar cipher
- Scytale cipher
-	Vigenère cipher
-	Polybius square
- Atbash cipher
-	Morse code

### Word-based
- Emoji rebus
- Poems with key letters
-	Missing letters
-	Esperanto sentence
-	Braille
-	T9 keypad
  
### Number-based
-	Sudoku
-	Equation solving
-	Train word problem
-	Distance-based logic
-	Domino puzzle

### Visual-based
-	Place from Google Maps
-	Image with hidden clue
-	Flag colour decoding
- Maze / correct path
