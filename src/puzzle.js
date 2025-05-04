import './style.css';
import { hashAnswer } from './hash.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load puzzle data
        const response = await fetch('../puzzles.json');
        const data = await response.json();
        
        // Find current puzzle based on URL
        const currentPath = window.location.pathname;
        const puzzleId = currentPath.split('/').pop().replace('.html', '');
        const currentPuzzle = data.puzzles.find(p => p.id === puzzleId);
        
        if (!currentPuzzle) {
            console.error('Puzzle not found');
            return;
        }

        // Set the deadline
        const deadlineElement = document.getElementById('puzzle-deadline');
        if (deadlineElement) {
            deadlineElement.textContent = currentPuzzle.deadline;
        }

        // Get next puzzle
        const nextPuzzle = data.puzzles.find(p => p.order === currentPuzzle.order + 1);
        const NEXT_PUZZLE = nextPuzzle ? `/puzzles/${nextPuzzle.id}.html` : '/';
        
        // Setup DOM elements
        const answerInput = document.getElementById('answer');
        const submitButton = document.getElementById('submit-answer');
        const messageDiv = document.getElementById('message');
        const hintButton = document.getElementById('show-hint');
        const hintsContainer = document.getElementById('hints-list');

        // Add a canvas for confetti
        const confettiCanvas = document.createElement('canvas');
        confettiCanvas.id = 'confetti-canvas';
        confettiCanvas.style.position = 'fixed';
        confettiCanvas.style.top = '0';
        confettiCanvas.style.left = '0';
        confettiCanvas.style.width = '100%';
        confettiCanvas.style.height = '100%';
        confettiCanvas.style.pointerEvents = 'none';
        document.body.appendChild(confettiCanvas);

        // Setup hints (all hidden initially)
        if (currentPuzzle.hints.length > 0) {
            hintsContainer.innerHTML = currentPuzzle.hints
                .map((hint, index) => `<p class="hint hidden" data-hint="${index + 1}">${hint}</p>`)
                .join('');
        }

        function sanitizeInput(input) {
            return input.trim().toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
        }

        function validateAnswer(answer) {
            const sanitizedAnswer = sanitizeInput(answer);
            const hashedInput = hashAnswer(sanitizedAnswer);
            const hashedCorrect = currentPuzzle.answer;
            return hashedInput === hashedCorrect;
        }

        function triggerConfetti() {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        function showBonusPopup(puzzle) {
            if (puzzle.bonus) {
                // Set the target URL based on puzzle.final
                const targetUrl = puzzle.final ? '/goodbye.html' : NEXT_PUZZLE;

                const popup = document.createElement('div');
                popup.style.position = 'fixed';
                popup.style.top = '50%';
                popup.style.left = '50%';
                popup.style.transform = 'translate(-50%, -50%)';
                popup.style.background = 'var(--paper-color)';
                popup.style.padding = '2rem';
                popup.style.border = '2px solid var(--ink-color)';
                popup.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
                popup.style.zIndex = '1000';
                popup.style.maxWidth = '80%';
                popup.style.textAlign = 'center';

                popup.innerHTML = `
                    <h3>Mise splněna!</h3>
                    <p>Jako bonus dostáváš odměnu:<br><i>${puzzle["bonus-text"]}</i>.</p>
                    <p><strong>Čas:</strong> ${puzzle["bonus-deadline"]}<strong></br>Místo:</strong> ${puzzle["bonus-place"]}</p>
                    <button onclick="this.parentElement.remove(); window.location.href='${targetUrl}'">
                        Pokračovat
                    </button>
                `;

                document.body.appendChild(popup);
                return true;
            }
            return false;
        }

        function showMessage(isSuccess, message) {
            messageDiv.textContent = message;
            messageDiv.className = `message ${isSuccess ? 'success' : 'error'}`;
            messageDiv.style.display = 'block';
            
            // Add shake animation for error messages
            if (!isSuccess) {
                messageDiv.classList.add('shake');
                setTimeout(() => messageDiv.classList.remove('shake'), 500);
            }

            if (isSuccess) {
                // Trigger confetti animation
                triggerConfetti();

                // Store unlocked status in localStorage for current puzzle
                const unlockedPuzzles = JSON.parse(localStorage.getItem('unlockedPuzzles') || '[]');
                if (!unlockedPuzzles.includes(currentPuzzle.id)) {
                    unlockedPuzzles.push(currentPuzzle.id);
                }
                localStorage.setItem('unlockedPuzzles', JSON.stringify(unlockedPuzzles));
                
                if (!showBonusPopup(currentPuzzle)) {
                    setTimeout(() => {
                        window.location.href = NEXT_PUZZLE;
                    }, 3000); // Delay redirection to allow confetti animation
                }
            }
        }

        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            const answer = answerInput.value;

            if (!answer) {
                showMessage(false, 'Prosím, zadejte odpověď.');
                return;
            }

            if (validateAnswer(answer)) {
                showMessage(true, 'Správně! Přesměrování na další hádanku...');
            } else {
                showMessage(false, 'Nesprávná odpověď. Zkuste to znovu.');
            }
        });

        let currentHintIndex = 0;
        hintButton.addEventListener('click', () => {
            const hints = hintsContainer.querySelectorAll('.hint');
            if (currentHintIndex < hints.length) {
                hints[currentHintIndex].classList.remove('hidden');
                currentHintIndex++;
                if (currentHintIndex >= hints.length) {
                    hintButton.disabled = true;
                    hintButton.textContent = 'Všechny nápovědy zobrazeny';
                }
            }
        });

        // Handle Enter key (changed from 'keypress' to 'keydown')
        answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitButton.click();
            }
        });
    } catch (error) {
        console.error('Error initializing puzzle:', error);
    }
});
