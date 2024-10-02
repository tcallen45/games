const grid = document.getElementById('grid');
const keyboard = document.getElementById('keyboard');
const targetWord = "prize"; // Word to guess
let currentRow = 0;
let currentCol = 0;
let currentGuess = "";

const greenColor = 'rgb(' + 106 + ', ' + 170 + ', ' + 100 + ')';
const yellowColor = 'rgb(' + 201 + ', ' + 180 + ', ' + 88 + ')';
const grayColor = 'rgb(' + 120 + ', ' + 124 + ', ' + 126 + ')';

const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// Generate the grid
for (let i = 0; i < 30; i++) {
    const cell = document.createElement('div');
    grid.appendChild(cell);
}

// Handle physical keyboard input
document.addEventListener('keydown', function (e) {
    handleKeyInput(e.key);
});

// Handle virtual keyboard input
keyboard.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {
        const key = e.target.dataset.key;
        handleKeyInput(key);
    }
});

// Process the key input (either from virtual or physical keyboard)
function handleKeyInput(key) {
    key = key.toUpperCase();

    if (key.length === 1 && key >= 'A' && key <= 'Z') {
        if (currentCol < 5) {
            const index = currentRow * 5 + currentCol;
            grid.children[index].innerText = key;
            grid.children[index].style.border = "2px solid " + grayColor;
            currentGuess += key.toLowerCase();
            currentCol++;
        }
    } else if (key === 'BACKSPACE' && currentCol > 0) {
        currentCol--;
        const index = currentRow * 5 + currentCol;
        grid.children[index].innerText = "";
        currentGuess = currentGuess.slice(0, -1);
    } else if (key === 'ENTER' && currentCol === 5) {
        if (currentGuess.length === 5) {
            checkGuess();
        }
    }
}

async function checkExistence(word) {
    // Call api
    var url = apiUrl + word;

    console.log("calling api " + url);

    try {
        const response = await fetch(url);

        console.log(response)
        if (response.ok) {
            console.log("returning true")
            return true;
        }
    } catch (error) {
        console.error(error.message);
        return false;
    }

    console.log("returning false")
    return false;
}


// Check if the guess matches the target word and apply colors
async function checkGuess() {

    let wordExists = await checkExistence(currentGuess)

    if (!wordExists) {
        alert("Word is not in list");
        return;
    }

    const guessArray = currentGuess.split('');
    const targetArray = targetWord.split('');
    const rowStart = currentRow * 5;

    // Track letters used for yellow marking
    let unusedLetters = targetArray.slice();

    // First pass: check for greens
    guessArray.forEach((letter, index) => {
        const gridCell = grid.children[rowStart + index];
        const keyboardKey = document.querySelector(`[data-key="${letter.toUpperCase()}"]`);
        
        if (letter === targetArray[index]) {
            gridCell.style.backgroundColor = greenColor;
            unusedLetters[index] = null;  // Mark the letter as used

            // Update the keyboard key to green (if not already green)
            if (keyboardKey && !keyboardKey.classList.contains('green')) {
                keyboardKey.style.backgroundColor = greenColor;
                keyboardKey.style.color = 'white';
                keyboardKey.style.border = "0px";
            }
        }
        gridCell.style.border = "0px";
        gridCell.style.color = "#fff"
    });

    // Second pass: check for yellows
    guessArray.forEach((letter, index) => {
        const gridCell = grid.children[rowStart + index];
        const keyboardKey = document.querySelector(`[data-key="${letter.toUpperCase()}"]`);
        
        if (gridCell.style.backgroundColor !== greenColor) {
            if (unusedLetters.includes(letter)) {
                gridCell.style.backgroundColor = yellowColor;
                unusedLetters[unusedLetters.indexOf(letter)] = null;  // Mark the letter as used

                // Update the keyboard key to yellow (if not already green)
                console.log(keyboardKey.style.backgroundColor === greenColor)
                console.log(keyboardKey.style.backgroundColor)
                if (keyboardKey && keyboardKey.style.backgroundColor !== greenColor) {
                    keyboardKey.style.backgroundColor = yellowColor;
                    keyboardKey.style.color = 'black';
                    keyboardKey.style.border = "0px";
                }
            } else {
                gridCell.style.backgroundColor = grayColor;

                if (keyboardKey && keyboardKey.style.backgroundColor !== greenColor && keyboardKey.style.backgroundColor !== yellowColor) {
                    keyboardKey.style.backgroundColor = grayColor;
                    keyboardKey.style.color = 'white';
                    keyboardKey.style.border = "0px";
                }
            }
        }
    });

    // Clear current guess and move to next row
    if (currentGuess === targetWord) {
        alert("You guessed it!");
    } else if (currentRow < 5) {
        currentGuess = "";
        currentRow++;
        currentCol = 0;
    } else {
        alert("Game over! The word was " + targetWord);
    }
}
