// Define the grid of letters
const letterGrid = [
    ['D', 'R', 'E', 'D', 'U', 'R'],
    ['U', 'O', 'O', 'C', 'T', 'R'],
    ['A', 'Q', 'S', 'F', 'Y', 'A'],
    ['I', 'S', 'M', 'A', 'E', 'C'],
    ['C', 'H', 'E', 'I', 'T', 'O'],
    ['E', 'C', 'R', 'R', 'B', 'O'],
    ['M', 'A', 'O', 'V', 'W', 'L'],
    ['P', 'I', 'C', 'S', 'A', 'F'],
];

const used = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
]

// Define the correct word sequence
// const correctSequence = ['a', 'b', 'f', 'g'];

const spangram = "FAVORITEFOOD";
const correctWords = ["REDCURRY", "TACOBOWL", "ICECREAM", "SQUASH", "SCAMPI"];

let selectedLetters = [];
let word = "";

// Function to initialize the grid
function initializeGrid() {
    const gridContainer = document.getElementById('letterGrid');
    gridContainer.innerHTML = '';

    for (let row = 0; row < letterGrid.length; row++) {
        for (let col = 0; col < letterGrid[row].length; col++) {
            const letter = letterGrid[row][col];
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.textContent = letter;
            gridItem.dataset.row = row;
            gridItem.dataset.col = col;
            gridItem.addEventListener('click', () => selectLetter(row, col));
            // gridItem.addEventListener('mouseover', () => hightlightAdjacent(row, col))
            gridContainer.appendChild(gridItem);
        }
    }
}

// Function to handle letter selection
function selectLetter(row, col) {
    console.log("clicked on " + row + " and " + col)
    const gridItem = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);

    // First Check if selected letter is in current selected list
    if (gridItem.classList.contains('selected')) {
        
        // If it is last item in list, just pop
        lastLetter = selectedLetters[selectedLetters.length-1]
        console.log("lastLetter " + lastLetter)

        if (lastLetter[0] == row && lastLetter[1] == col) {
            gridItem.classList.remove('selected');
            selectedLetters.pop();
        } else {
            let lastItem = selectedLetters.pop()
            console.log("Found item: " + lastItem + " checking next.")
            while (lastItem[0] != row || lastItem[1] != col) { // Weird Array Equality check
                let tempGridItem = document.querySelector(`.grid-item[data-row="${lastItem[0]}"][data-col="${lastItem[1]}"]`);
                tempGridItem.classList.remove('selected');
                lastItem = selectedLetters.pop()
                console.log("Found item in loop: " + lastItem + ", checking next.")
            }
            selectedLetters.push(lastItem)
            console.log("Selected Letters after purge: " + selectedLetters)
        }
    } else if (gridItem.classList.contains('correct')) {
        console.log("Letter already used in word")
    } else {
        if (!isAdjacent(selectedLetters.length, row, col)) {
            console.log('not adjacent, reset')
            clearSelected();
        }
        
        if (!gridItem.classList.contains('selected')) {
            gridItem.classList.add('selected');
            selectedLetters.push([row, col])
            console.log(selectedLetters)
    
        } 
    }

    const selectedWord = document.getElementById('selected-word');
    word = convertToWord(selectedLetters)
    selectedWord.textContent = word
}

function clearSelected() {
    console.log(selectedLetters)
    for (let i = 0; i < selectedLetters.length; i++) {
        const [row, col] = selectedLetters[i]
        const gridItem = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);
        console.log(gridItem)
        gridItem.classList.remove('selected')
    }
    selectedLetters = []
}

// Function to check if letters are adjacent
function isAdjacent(index, row, col) {
    if (index === 0) return true;
    const lastIndex = index - 1;
    const [lastRow, lastCol] = selectedLetters[lastIndex];
    // const [currentRow, currentCol] = getLetterPosition(selectedLetters[index]);

    return Math.abs(lastRow - row) <= 1 && Math.abs(lastCol - col) <= 1;
}

// Function to get the position of a letter in the grid
function getLetterPosition(letter) {
    for (let row = 0; row < letterGrid.length; row++) {
        for (let col = 0; col < letterGrid[row].length; col++) {
            if (letterGrid[row][col] === letter) {
                return [row, col];
            }
        }
    }
    return [-1, -1];
}

// Function to check the selected word
function checkWord() {
    const feedback = document.getElementById('feedback');

    let submittedWord = convertToWord(selectedLetters);

    if (correctWords.includes(submittedWord)) {
        markCorrect();
    } 
    
    if (spangram === submittedWord) {
        markSpangram();
    }

    clearSelected();
}

function markCorrect() {
    for (let i = 0; i < selectedLetters.length; i++) {
        const [row, col] = selectedLetters[i];
        const gridItem = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);

        gridItem.classList.add("correct");
    }
}

function markSpangram() {
    for (let i = 0; i < selectedLetters.length; i++) {
        const [row, col] = selectedLetters[i];
        const gridItem = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);

        gridItem.classList.add("spangram");
    }
}

function convertToWord(selected) {
    let newWord = "";
    for (let i = 0; i < selected.length; i++) {
        const [row, col] = selected[i];
        newWord = newWord + letterGrid[row][col];
    }
    return newWord;
}

// Function to reset the grid
function resetGrid() {
    selectedLetters = [];
    document.querySelectorAll('.grid-item').forEach(item => item.classList.remove('selected'));
}

// Initialize the game
initializeGrid();
