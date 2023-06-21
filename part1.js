const readline = require('readline-sync');

// Function to randomly place two ships on the board
function placeShips(grid) {
  const ship1 = generateRandomCoordinate(grid);
  const ship2 = generateRandomCoordinate(grid);

  // Place ship 1
  grid[ship1.row][ship1.col] = 'X';

  // Place ship 2
  while (grid[ship2.row][ship2.col] === 'X') {
    ship2.row = Math.floor(Math.random() * grid.length);
    ship2.col = Math.floor(Math.random() * grid.length);
  }
  grid[ship2.row][ship2.col] = 'X';
}

// Function to generate a random coordinate on the grid
function generateRandomCoordinate(grid) {
  const row = Math.floor(Math.random() * grid.length);
  const col = Math.floor(Math.random() * grid.length);
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

// Main game logic
function playBattleship() {
  const gridSize = 10;
  const grid = Array.from(Array(gridSize), () => Array(gridSize).fill(' '));

  console.log('Press any key to start the game.');
  readline.keyIn();

  placeShips(grid);

  let battleshipsRemaining = 2;
  let gameOver = false;

  while (!gameOver) {
    console.clear();
    console.log('Enter a location to strike (e.g., A1): ');
    printGrid(grid);
    const input = readline.question('> ');

    const { row, col } = convertInput(input);

    if (grid[row][col] === 'X') {
      grid[row][col] = ' ';
      battleshipsRemaining--;
      console.log(`Hit! You have sunk a battleship. ${battleshipsRemaining} ship(s) remaining.`);
    } else if (grid[row][col] === 'O') {
      console.log('You have already picked this location. Miss!');
    } else {
      console.log('You have missed!');
    }

    grid[row][col] = 'O';

    if (battleshipsRemaining === 0) {
      console.log('You have destroyed all battleships.');
      const playAgain = readline.question('Would you like to play again? (Y/N) ');

      if (playAgain.toUpperCase() === 'Y') {
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
