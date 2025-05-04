import './style.css';

async function loadPuzzles() {
    try {
        const response = await fetch("./puzzles.json");
        const data = await response.json();

        const container = document.getElementById("cases-container");
        const unlockedPuzzles = JSON.parse(localStorage.getItem("unlockedPuzzles") || "[]");

        // Compute maximum solved order (0 if none solved)
        const maxSolvedOrder = data.puzzles.reduce((max, puzzle) => {
            const puzzleOrder = Number(puzzle.order);
            return unlockedPuzzles.includes(puzzle.id) && puzzleOrder > max
                ? puzzleOrder
                : max;
        }, 0);

        const nextPuzzleOrder = maxSolvedOrder + 1;

        // Display all puzzles
        data.puzzles
            .sort((a, b) => Number(a.order) - Number(b.order))
            .forEach((puzzle) => {
                const isUnlocked = unlockedPuzzles.includes(puzzle.id) || 
                                 Number(puzzle.order) === nextPuzzleOrder;
                
                const caseElement = document.createElement("a");
                caseElement.href = isUnlocked ? `/puzzles/${puzzle.id}.html` : 'javascript:void(0)';
                caseElement.className = `case-file ${isUnlocked ? '' : 'locked'}`;
                caseElement.style.opacity = isUnlocked ? '1' : '0.5';
                caseElement.style.cursor = isUnlocked ? 'pointer' : 'not-allowed';
                
                caseElement.innerHTML = `
                    <div class="folder">
                        <h2>Případ #${puzzle.order}: ${puzzle.title}</h2>
                        <p class="deadline">${puzzle.deadline}</p>
                        ${!isUnlocked ? '<p class="locked-message">🔒 Nejdřív vyřešte předchozí případy</p>' : ''}
                    </div>
                `;
                container.appendChild(caseElement);
            });
    } catch (error) {
        console.error('Error loading puzzles:', error);
    }
}

// Load puzzles when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPuzzles();
});
