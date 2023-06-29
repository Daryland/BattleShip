const readline = require('readline-sync');

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

// Function to randomly place two ships on the board
function placeShips(grid) {
  const [ship1, ship2] = [1, 2].map((ship) => generateRandomCoordinate(grid));

  // Place ship 1
  grid[ship1.row][ship1.col] = 'X';

  // Place ship 2
  while (grid[ship2.row][ship2.col] === 'X') {
    ship2.row = getRandomInt(grid.length);
    ship2.col = getRandomInt(grid.length);
  }
  grid[ship2.row][ship2.col] = 'X';
}

// Function to generate a random coordinate on the grid
function generateRandomCoordinate(grid) {
  const row = getRandomInt(grid.length);
  const col = getRandomInt(grid.length);
  return { row, col };
}

// Function to print the grid
function printGrid(grid) {
  console.log('  A B C D E F G H I J');
  for (let i = 0; i < grid.length; i++) {
    const rowStr = `${i + 1} ${grid[i].join(' ')}`;
    console.log(rowStr);
  }
}

// Function to convert user input to grid coordinates
function convertInput(input) {
  const row = parseInt(input.substring(1)) - 1;
  const col = input.charCodeAt(0) - 'A'.charCodeAt(0);
  return { row, col };
}


// Function to reset the grid by clearing sunken ships
function resetGrid(grid) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid.length; col++) {
      if (grid[row][col] === 'O') {
        grid[row][col] = ' ';
      }
    }
  } 
}

// Main game logic
function playBattleship() {
  console.log('Press any key to start the game.');
  readline.keyIn();

  const gridSize = 10;
  const grid = Array.from(Array(gridSize), () => Array(gridSize).fill(' '));

  placeShips(grid);

  let battleshipsRemaining = 2;
  let gameOver = false;

  while (!gameOver) {
    console.log('Enter a location to strike (e.g., A1): ');
    printGrid(grid);

    const input = readline.question('> ').toUpperCase();
    const { row, col } = convertInput(input);

    if (grid[row][col] === 'X') {
      grid[row][col] = ' ';
      battleshipsRemaining--;
      console.log(`Hit! You have sunk a battleship. ${battleshipsRemaining} ship(s) remaining.`);
    } else if (grid[row][col] === 'O') {
      console.log('You have already picked this location. Try Again!');
    } else {
      console.log('You have missed! Try Again!');
    }

    grid[row][col] = 'O';

    if (battleshipsRemaining === 0) {
      console.log('You have destroyed all battleships.');
      
      const playAgain = readline.question('Would you like to play again? (Y/N) ');

      if (playAgain.toUpperCase() === 'Y') {
        resetGrid(grid);
        placeShips(grid);
        battleshipsRemaining = 2;
      } else {
        gameOver = true;
      }
    }
  }

  console.log('Thank you for playing Battleship!');
}

// Start the game
playBattleship();
