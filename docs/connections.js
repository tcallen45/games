const words = document.querySelectorAll('.word');
let selectedWords = [];
let correctGroups = 0;

// Sample groups (replace with actual word groups)
const wordGroups = [
    [0, 1, 2, 3],   // Group 1
    [4, 5, 6, 7],   // Group 2
    [8, 9, 10, 11], // Group 3
    [12, 13, 14, 15]// Group 4
];

const groupCategories = ["Sports we've played", "Our Weekend Mornings", "Our Weekday Evenings", "Reasons I love you. (Your ____)"]
const groupWords = ["BASKETBALL, BOWLING, DISC GOLF, PICKLEBALL", "ARSENAL, COFFEE, FARMER'S MARKET, CUDDLING", "COOKING, DESSERT, WALK, TV", "SMILE, HONESTY, DRIVE, HUMOR"]

// Define colors for each group
const groupColors = ['#f9df6d', '#a0c35a', '#b0c4ef', '#ba81c5'];

// Array to track available grid positions, each entry will be [row, column]
let availableRows = [1,2,3,4];


let span = document.getElementsByClassName("close")[0];
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

words.forEach(word => {
    word.addEventListener('click', () => {
        if (word.classList.contains('correct')) return; // Ignore correct words

        word.classList.toggle('selected');
        const wordId = parseInt(word.getAttribute('data-id'));

        if (selectedWords.includes(wordId)) {
            selectedWords = selectedWords.filter(id => id !== wordId);
        } else {
            selectedWords.push(wordId);
        }
    });
});

function checkSelection() {
    let isCorrect = false;

    if (correctGroups === 4) {
        return
    }

    for (let i = 0; i < wordGroups.length; i++) {
        const group = wordGroups[i];

        if (selectedWords.every(wordId => group.includes(wordId))) {
            isCorrect = true;
            correctGroups++;
            markCorrect(i);  // Pass the group index to assign the right color
            //moveWordsToTop(selectedWords);
            mergeWordsIntoBlock(selectedWords, i)
            break;
        }
    }

    if (!isCorrect) {
        markIncorrect();
    }

    selectedWords = [];
}

function markCorrect(groupIndex) {
    const groupColor = groupColors[groupIndex];

    selectedWords.forEach(id => {
        const word = document.querySelector(`[data-id="${id}"]`);
        word.classList.remove('selected');
        word.classList.add('correct');
        word.style.backgroundColor = groupColor;  // Assign the group's color
    });

    if (correctGroups === 4) {
        modal.style.display = "block";
    }
}

function markIncorrect() {
    selectedWords.forEach(id => {
        const word = document.querySelector(`[data-id="${id}"]`);
        word.classList.remove('selected');
        word.classList.add('incorrect');

        setTimeout(() => {
            word.classList.remove('incorrect');
        }, 1000);
    });
}

// Function to move words to the highest available row
function moveWordsToTop(wordsToMove) {
    wordsToMove.forEach(id => {
        const wordElement = document.querySelector(`[data-id="${id}"]`);

        // Get the first available grid position (highest row)
        const [newRow, newCol] = availableGridPositions.shift();  // Take the highest available position

        // Use CSS Grid properties to place the word in the correct row and column
        wordElement.style.gridRow = newRow;
        wordElement.style.gridColumn = newCol;
    });
}


function mergeWordsIntoBlock(wordsToMerge, groupIndex) {
    const grid = document.querySelector('.grid');
    const groupColor = groupColors[groupIndex];

    // Hide the individual word buttons for the group
    wordsToMerge.forEach(id => {
        const wordElement = document.querySelector(`[data-id="${id}"]`);
        wordElement.style.display = 'none';  // Hide individual words
    });

    // Create a new div to represent the merged category block
    const mergedBlock = document.createElement('div');
    mergedBlock.classList.add('merged-category');
    mergedBlock.textContent = groupCategories[groupIndex];  // Custom text for the block
    mergedBlock.style.backgroundColor = groupColor;  // Set the category color

    const subtext = document.createElement('p')
    subtext.classList.add('merged-words')
    subtext.textContent = groupWords[groupIndex];

    // Position the merged block in the first available row
    const nextAvailableRow = availableRows.shift();  // Get the first available row and remove it from the array
    mergedBlock.style.gridRow = nextAvailableRow;    // Set it to the available row
    mergedBlock.style.gridColumn = '1 / span 4';     // Span across all 4 columns

    mergedBlock.appendChild(subtext);

    // Append the new merged block to the grid
    grid.appendChild(mergedBlock);
}