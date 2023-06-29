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
        placeShipOnGrid(grid, row, col, shipSize, orientation);
        shipPlaced = true;
      }
    }
  }
}

function placeShipOnGrid(grid, row, col, shipSize, orientation) {
  const [rowDelta, colDelta] = orientation === 'horizontal' ? [0, 1] : [1, 0];

  for (let i = 0; i < shipSize; i++) {
    grid[row + rowDelta * i][col + colDelta * i] = 'X';
  }
}

// Function to generate a random coordinate on the grid
function generateRandomCoordinate(grid) {
  const [row, col] = [1, 2].map(() => Math.floor(Math.random() * grid.length));
  return { row, col };
}

// Function to check if a ship placement is valid
function isValidPlacement(grid, row, col, shipSize, orientation) {
  const axis = orientation === 'horizontal' ? col : row;
  if (axis + shipSize > grid.length) {
    return false;
  }
  for (let i = col; i < axis + shipSize; i++) {
    const cond = orientation === 'horizontal' ? grid[row][i] : grid[i][col]
    if (cond === 'X') {
      return false;
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

// Function to check if a battleship has been destroyed
function isBattleshipDestroyed(grid, row, col) {
  const size = grid.length;

  // Check if the battleship symbol is present in any adjacent cells
  if (row > 0 && grid[row - 1][col] === 'X') {
    return false;
  }
  if (row < size - 1 && grid[row + 1][col] === 'X') {
    return false;
  }
  if (col > 0 && grid[row][col - 1] === 'X') {
    return false;
  }
  if (col < size - 1 && grid[row][col + 1] === 'X') {
    return false;
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
  let gameOver = false;

  while (!gameOver) {
    console.log('Enter a location to strike (e.g., A1): ');
    printGrid(grid);
    try {

      const input = readline.question('> ').toUpperCase();
      const { row, col } = convertInput(input);

      if (grid[row][col] === 'X') {
        grid[row][col] = ' ';
        if (isBattleshipDestroyed(grid, row, col)){
          battleshipsRemaining--
          console.log('Final Hit! You have sunk a battleship.')
        };
        console.log(`Hit! ${battleshipsRemaining} ship(s) remaining.`);
        if (isBattleshipDestroyed(grid, row, col)) {
          console.log('Battleship destroyed!');
        }
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
        } else {
          break;
        }
      }
    } catch (error) {
      console.log('Please Enter a Valid Command!');
    }
  }

  console.log('Thank you for playing Battleship!');
}

// Start the game
playBattleship();
