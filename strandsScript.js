const gridElement = document.getElementById('grid');
const wordInput = document.getElementById('wordInput');
const messageElement = document.getElementById('message');

const gridHeight = 8;
const gridWidth = 6;
const words = ['JAVA', 'SCRIPT', 'WORD', 'SEARCH', 'GAME'];
const grid = [];

// Generate a grid with random letters
function generateGrid() {
    for (let row = 0; row < gridHeight; row++) {
        grid[row] = [];
        for (let col = 0; col < gridWidth; col++) {
            grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
    }
    // Place words in grid
    // placeWords();
    renderGrid();
}

// Place words in the grid
function placeWords() {
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = Math.floor(Math.random() * 2); // 0 for horizontal, 1 for vertical
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);

            if (canPlaceWord(word, row, col, direction)) {
                placeWord(word, row, col, direction);
                placed = true;
            }
        }
    });
}

// Check if a word can be placed in the grid
function canPlaceWord(word, row, col, direction) {
    if (direction === 0) { // Horizontal
        if (col + word.length > gridSize) return false;
        for (let i = 0; i < word.length; i++) {
            if (grid[row][col + i] !== word[i] && grid[row][col + i] !== String.fromCharCode(0)) {
                return false;
            }
        }
    } else { // Vertical
        if (row + word.length > gridSize) return false;
        for (let i = 0; i < word.length; i++) {
            if (grid[row + i][col] !== word[i] && grid[row + i][col] !== String.fromCharCode(0)) {
                return false;
            }
        }
    }
    return true;
}

// Place a word in the grid
function placeWord(word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        if (direction === 0) {
            grid[row][col + i] = word[i];
        } else {
            grid[row + i][col] = word[i];
        }
    }
}

// Render the grid
function renderGrid() {
    gridElement.innerHTML = '';
    for (let row = 0; row < gridHeight; row++) {
        for (let col = 0; col < gridWidth; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = grid[row][col];
            gridElement.appendChild(cell);
        }
    }
}

// Check if the entered word is in the grid
function checkWord() {
    const word = wordInput.value.toUpperCase();
    if (words.includes(word)) {
        messageElement.textContent = 'Word found!';
        highlightWord(word);
    } else {
        messageElement.textContent = 'Word not found. Try again!';
    }
    wordInput.value = '';
}

// Highlight the found word in the grid
function highlightWord(word) {
    let found = false;
    words.forEach(w => {
        if (w === word) {
            found = true;
            let index = 0;
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    if (grid[row][col] === word[index]) {
                        index++;
                        if (index === word.length) {
                            highlightWordInGrid(row, col - index + 1, 0, word.length);
                            return;
                        }
                    } else {
                        index = 0;
                    }
                }
            }
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    if (grid[row][col] === word[index]) {
                        index++;
                        if (index === word.length) {
                            highlightWordInGrid(row - index + 1, col, 1, word.length);
                            return;
                        }
                    } else {
                        index = 0;
                    }
                }
            }
        }
    });
    if (!found) messageElement.textContent = 'Word not found. Try again!';
}

function highlightWordInGrid(startRow, startCol, direction, length) {
    for (let i = 0; i < length; i++) {
        const index = direction === 0 ? startCol + i : startRow + i;
        const cell = gridElement.children[startRow * gridSize + index];
        cell.classList.add('highlight');
    }
}

// Initialize the game
generateGrid();
