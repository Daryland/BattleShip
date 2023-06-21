const readline = require('readline-sync');

// Function to build the grid
function buildGrid(size) {
  const grid = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(' ');
    }
    grid.push(row);
  }
  return grid;
}

// Function to randomly place ships on the grid
function placeShips(grid) {
  const shipSizes = [2, 3, 3, 4, 5];
  const directions = ['horizontal', 'vertical'];

  for (const size of shipSizes) {
    let shipPlaced = false;
    while (!shipPlaced) {
      const row = Math.floor(Math.random() * grid.length);
      const col = Math.floor(Math.random() * grid.length);
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      if (direction === 'horizontal' && col + size <= grid.length) {
        let overlap = false;
        for (let i = col; i < col + size; i++) {
          if (grid[row][i] === 'X') {
            overlap = true;
            break;
          }
        }
        if (!overlap) {
          for (let i = col; i < col + size; i++) {
            grid[row][i] = 'X';
          }
          shipPlaced = true;
        }
      } else if (direction === 'vertical' && row + size <= grid.length) {
        let overlap = false;
        for (let i = row; i < row + size; i++) {
          if (grid[i][col] === 'X') {
            overlap = true;
            break;
          }
        }
        if (!overlap) {
          for (let i = row; i < row + size; i++) {
            grid[i][col] = 'X';
          }
          shipPlaced = true;
        }
      }
    }
  }
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

// Function to check if all ships are destroyed
function allShipsDestroyed(grid) {
  for (const row of grid) {
    if (row.includes('X')) {
      return false;
    }
  }
  return true;
}

// Main game logic
function playBattleship() {
  const gridSize = 10;
  const grid = buildGrid(gridSize);
  placeShips(grid);

  let shipsRemaining = 5;
  let gameOver = false;

  console.log('Press any key to start the game.');
  readline.keyIn();

  while (!gameOver) {
    printGrid(grid);
    const input = readline.question('Enter a location to strike (e.g., A2): ');

    const { row, col } = convertInput(input);

    if (grid[row][col] === 'X') {
      grid[row][col] = ' ';
      shipsRemaining--;
      console.log(`Hit! You have sunk a battleship. ${shipsRemaining} ship(s) remaining.`);
    } else if (grid[row][col] === 'O') {
      console.log('You have already picked this location. Miss!');
    } else {
      console.log('You have missed!');
    }

    grid[row][col] = 'O';

    if (shipsRemaining === 0) {
      console.log('You have destroyed all battleships. Congratulations!');
      const playAgain = readline.keyIn('Would you like to play again? (Y/N) ');
      if (playAgain.toUpperCase() !== 'Y') {
        gameOver = true;
      } else {
        // Reset the game
        for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid.length; j++) {
            grid[i][j] = ' ';
          }
        }
        placeShips(grid);
        shipsRemaining = 5;
      }
    }
  }

  console.log('Thanks for playing!');
}

// Start the game
playBattleship();
