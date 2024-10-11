// Define the grid of letters
const letterGrid = [
    ['D', 'R', 'E', 'D', 'U', 'R'],
    ['U', 'O', 'O', 'C', 'Y', 'R'],
    ['A', 'Q', 'S', 'F', 'A', 'T'],
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

const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/"

// Define the correct word sequence
// const correctSequence = ['a', 'b', 'f', 'g'];

const spangram = "FAVORITEFOOD";
const correctWords = ["REDCURRY", "TACOBOWL", "ICECREAM", "SQUASH", "SCAMPI"];
const correctWordHintPositions = [
    {positions: [[2, 2], [2, 1], [1, 0], [2, 0], [3, 1], [4, 1]], count: 0, word: "SQUASH"}, // Squash
    {positions: [[0, 1], [0, 2], [0, 3], [1, 3], [0, 4], [0, 5], [1, 5], [1, 4]], count: 0, word: "REDCURRY"}, // Red Curry
    {positions: [[7, 3], [7, 2], [6, 1], [6, 0], [7, 0], [7, 1]], count: 0, word: "SCAMPI"}, // Scampi
    {positions: [[2, 5], [2, 4], [3, 5], [4, 5], [5, 4], [5, 5], [6, 4], [6, 5]], count: 0, word:"TACOBOWL"}, // Taco Bowl
    {positions: [[3, 0], [4, 0], [5, 0], [5, 1], [5, 2], [4, 2], [3, 3], [3, 2]], count: 0, word:"ICECREAM"}, // Ice Cream
]
const hintWords = [];

let selectedLetters = [];
let word = "";
let correctCount = 0;
let hintCounter = 0;

var span = document.getElementsByClassName("close")[0];
let modal = document.getElementById("winning-modal");

span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 

function initializeGame() {
    initializeGrid();
    updateHint();
    updateCounter();
}

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
                tempGridItem.classList.remove('lastSelected');
                tempGridItem.classList.remove('selected');
                lastItem = selectedLetters.pop()
                console.log("Found item in loop: " + lastItem + ", checking next.")
            }
            selectedLetters.push(lastItem)
            console.log("Selected Letters after purge: " + selectedLetters)
        }
    } else if (gridItem.classList.contains('correct') || gridItem.classList.contains('spangram')) {
        console.log("Letter already used in word")
    } else if (gridItem.classList.contains('lastSelected')) {
        checkWord();
    } else {
        if (!isAdjacent(selectedLetters.length, row, col)) {
            console.log('not adjacent, reset')
            clearSelected();
        }

        if (selectedLetters.length >= 4) {
            const [x, y] = selectedLetters[selectedLetters.length - 1];
            const lastGridItem = document.querySelector(`.grid-item[data-row="${x}"][data-col="${y}"]`);
            lastGridItem.classList.remove('lastSelected');
            lastGridItem.classList.add('selected');
        }

        if (selectedLetters.length >= 3) {
            gridItem.classList.add('lastSelected');
        } else {
            gridItem.classList.add('selected');
        }
        selectedLetters.push([row, col])
        console.log(selectedLetters) 
    }

    const selectedWord = document.getElementById('selected-word');
    word = convertToWord(selectedLetters)
    selectedWord.textContent = word
    updateCounter();
}

function updateCounter() {
    const counter = document.getElementById('counter');

    counter.innerText = correctCount + " out of 6 Theme Words found"

    if (correctCount === 6) {
        modal.style.display = "block";
    }
}

function clearSelected() {
    console.log(selectedLetters)
    for (let i = 0; i < selectedLetters.length; i++) {
        const [row, col] = selectedLetters[i]
        const gridItem = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);
        console.log(gridItem)
        gridItem.classList.remove('selected')
        gridItem.classList.remove('lastSelected')
    }
    selectedLetters = [];
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
    const selectedWord = document.getElementById('selected-word');

    let submittedWord = convertToWord(selectedLetters);

    if (correctWords.includes(submittedWord)) {
        correctCount++;
        markCorrect();
        removeHint();
        markHintCompleted(submittedWord);
    } else if (spangram === submittedWord) {
        correctCount++;
        markSpangram();
        removeHint();
        markHintCompleted(submittedWord);
    } else if (hintWords.includes(submittedWord)) {
        selectedWord.textContent = "Already submitted word"
    } else if (wordExists(submittedWord)) {
        console.log("hint word");
        selectedWord.textContent = "Word not in puzzle."
    } else {
        selectedWord.textContent = "Not a word :("
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

function markHint() {
    for (let i = 0; i < selectedLetters.length; i++) {
        const [row, col] = selectedLetters[i];
        const gridItem = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);

        gridItem.classList.add("hint");
    }
}

function removeHint() {
    for (let i = 0; i < selectedLetters.length; i++) {
        const [row, col] = selectedLetters[i];
        const gridItem = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);

        gridItem.classList.remove("hint");
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

async function wordExists(word) {
    // Call api
    var url = apiUrl + word;

    console.log("calling api " + url);

    try {
        const response = await fetch(url);

        console.log(response)
        if (response.ok) {
            hintCounter++;
            updateHint();
            hintWords.push(word);
            return true;
        }
    } catch (error) {
        console.error(error.message);
        return false;
    }

    return false;
}

function updateHint() {
    let hintOverlay =  document.getElementById('hintOverlay');

    hintOverlay.classList = ["hintOverlay"];

    if (hintCounter >= 3) {
        hintOverlay.classList.add("full");
    } else if (hintCounter == 2) {
        hintOverlay.classList.add("second");
    } else if (hintCounter == 1) {
        hintOverlay.classList.add("first");
    } else {
        hintOverlay.classList.add("empty");
    }
}

function checkHint() {
    console.log("checking hint")
    if (hintCounter <= 2) {
        console.log("Can't use hint yet");
    } else {
        hintCounter = hintCounter - 3;


        for (let i = 0; i < correctWordHintPositions.length; i++) {
            let wordHintInfo = correctWordHintPositions[i];

            if (wordHintInfo["count"] == 1) {
                selectedLetters = wordHintInfo["positions"];
                correctCount++;
                removeHint();
                markCorrect();
                updateCounter();
                wordHintInfo["count"] = 2;
                break;
            } else if (wordHintInfo["count"] == 0) {
                selectedLetters = wordHintInfo["positions"];
                markHint();
                wordHintInfo["count"] = 1;
                break;
            } else {
                console.log("Bad value")
            }
        }
    }

    console.log(correctWordHintPositions);
    updateHint();
    clearSelected();
}

function markHintCompleted(word) {
    for (let i = 0; i < correctWordHintPositions.length; i++) {
        if (correctWordHintPositions[i].word === word) {
            console.log("marking hint completed")
            correctWordHintPositions[i].count = 2
        }
    }
}

// Function to reset the grid
function resetGrid() {
    selectedLetters = [];
    document.querySelectorAll('.grid-item').forEach(item => item.classList.remove('selected'));
}

// Initialize the game
initializeGame();
