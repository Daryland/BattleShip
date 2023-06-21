const readline = require('readline-sync');

// Function to build the grid
function buildGrid(size) {
  const grid = Array.from(Array(size), () => Array(size).fill(' '));
  return grid;
}

// Function to randomly place ships on the grid
function placeShips(grid) {
  const shipSizes = [2, 3, 3, 4, 5];

  for (const shipSize of shipSizes) {
    let shipPlaced = false;
    while (!shipPlaced) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const { row, col } = generateRandomCoordinate(grid);

      if (isValidPlacement(grid, row, col, shipSize, orientation)) {
        if (orientation === 'horizontal') {
          for (let i = col; i < col + shipSize; i++) {
            grid[row][i] = 'X';
          }
        } else {
          for (let i = row; i < row + shipSize; i++) {
            grid[i][col] = 'X';
          }
        }
        shipPlaced = true;
      }
    }
  }
}

// Function to generate a random coordinate on the grid
function generateRandomCoordinate(grid) {
  const row = Math.floor(Math.random() * grid.length);
  const col = Math.floor(Math.random() * grid.length);
  return { row, col };
}

// Function to check if a ship placement is valid
function isValidPlacement(grid, row, col, shipSize, orientation) {
  if (orientation === 'horizontal') {
    if (col + shipSize > grid.length) {
      return false;
    }
    for (let i = col; i < col + shipSize; i++) {
      if (grid[row][i] === 'X') {
        return false;
      }
    }
  } else {
    if (row + shipSize > grid.length) {
      return false;
    }
    for (let i = row; i < row + shipSize; i++) {
      if (grid[i][col] === 'X') {
        return false;
      }
    }
  }
  return true;
}

// Function to print the grid
function printGrid(grid) {
  const size = grid.length;
  const letters = 'ABCDEFGHIJ';

  let gridStr = '  ';
  for (let i = 0; i < size; i++) {
    gridStr += letters[i] + ' ';
  }
  console.log(gridStr);

  for (let i = 0; i < size; i++) {
    let rowStr = (i + 1).toString().padStart(2, ' ');
    for (let j = 0; j < size; j++) {
      rowStr += grid[i][j] + ' ';
    }
    console.log(rowStr);
  }
}

// Function to convert user input to grid coordinates
function convertInput(input) {
  const row = parseInt(input.substring(1)) - 1;
  const col = input.charCodeAt(0) - 'A'.charCodeAt(0);
  return { row, col };
}

// Function to check if all battleships have been destroyed
function allBattleshipsDestroyed(grid) {
  for (const row of grid) {
    if (row.includes('X')) {
      return false;
    }
  }
  return true;
}

// Main game logic
function playBattleship() {
  console.log('Press any key to start the game.');
  readline.keyIn();

  const gridSize = 10;
  const grid = buildGrid(gridSize);

  placeShips(grid);

  let battleshipsRemaining = 5;

  while (true) {
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
        battleshipsRemaining = 5;
        placeShips(grid);
      } else {
        break;
      }
    }
  }

  console.log('Thank you for playing Battleship!');
}

// Start the game
playBattleship();
