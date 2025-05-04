import { hashAnswer } from '../src/hash.js';

const answers = [
  'puzzle'
];

answers.forEach(answer => {
  console.log(`${answer}|${hashAnswer(answer)}`);
});
