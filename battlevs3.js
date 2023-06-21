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

// Function to simulate the computer's turn
function computerTurn(grid) {
  const gridSize = grid.length;
  const row = Math.floor(Math.random() * gridSize);
  const col = Math.floor(Math.random() * gridSize);

  if (grid[row][col] === 'X') {
    grid[row][col] = ' ';
    return { row, col, hit: true };
  } else {
    return { row, col, hit: false };
  }
}

// Main game logic
function playBattleship() {
  const gridSize = 10;
  const grid = buildGrid(gridSize);

  // Place player's ships
  placeShips(grid);

  // Place computer's ships
  const computerGrid = buildGrid(gridSize);
  placeShips(computerGrid);

  let shipsRemaining = 5;
  let computerShipsRemaining = 5;
  let gameOver = false;

  console.log('Press any key to start the game.');
  readline.keyIn();

  while (!gameOver) {
    console.clear();
    console.log('Your Turn');
    printGrid(grid);
    console.log('Enter a location to strike (e.g., A1): ');
    const input = readline.question('> ');

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
      gameOver = true;
    } else {
      console.clear();
      console.log("Computer's Turn");
      const computerAttack = computerTurn(computerGrid);
      const { row: computerRow, col: computerCol, hit: computerHit } = computerAttack;

      if (computerHit) {
        computerGrid[computerRow][computerCol] = ' ';
        computerShipsRemaining--;
        console.log(`The computer hit your battleship. ${computerShipsRemaining} ship(s) remaining.`);
      } else {
        console.log('The computer missed!');
      }

      if (computerShipsRemaining === 0) {
        console.log('The computer has destroyed all your battleships. Better luck next time!');
        gameOver = true;
      }

      readline.keyIn('Press any key to continue...');
    }
  }

  console.log('Thanks for playing!');
}

// Start the game
playBattleship();
