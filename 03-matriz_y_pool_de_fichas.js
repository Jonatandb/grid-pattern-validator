let gems = ['💛', '🌲', '🌎', '🪐', '🚽', '🌈', '🍎', '💚', '🟣', '💋']

const getRandomGem = gems =>  gems[Math.floor(Math.random() * gems.length)]

function generateGemsRow(rowLength, getRandomGemFunc, gemsList){
  const result = []
  for (let i = 0; i < rowLength; i++) {
    let currentGem = getRandomGemFunc(gemsList)
    if (i > 1) {  /** Avoiding 3 consecutive similar gems */
      while (currentGem == result[i - 1] && currentGem == result[i - 2]) {
        let previusGem = currentGem
        currentGem = getRandomGemFunc(gemsList)
      }
    }
    result.push(currentGem)
  }
  return result
}

function generateBoard(rows, cols, generateGemsRowFunc, getRandomGemFunc, gemsList) {
  let board = []
  for (let row = 0; row < rows; row++) {
    board[row] = generateGemsRowFunc(cols, getRandomGemFunc, gemsList)
    if (row > 1) {
      let verticalMatch = false
      do {
        for (let col = 0; col < cols; col++) {
          verticalMatch =
            board[row][col] == board[row - 1][col] &&
            board[row][col] == board[row - 2][col]
          if (verticalMatch) {
            board[row] = generateGemsRowFunc(cols, getRandomGemFunc, gemsList)
            break
          }
        }
      } while (verticalMatch)
    }
  }
  return board
}

function processMove(board, row1, col1, row2, col2) {
  function getDirection(board, row1, col1, row2, col2) {
    const rows = board.length
    const cols = board[0].length
    if (col2 > col1) {
      return ['right', '→']
    } else if (col2 < col1) {
      return ['left', '←']
    } else if (row2 > row1) {
      return ['down', '↓']
    } else if (row2 < row1) {
      return ['up', '↑']
    } else {
      return ['', '']
    }
  }

  function isValidMove(board, row1, col1, row2, col2) {
    const rows = board.length
    const cols = board[0].length

    if (row1 != row2 && col1 != col2) {
      return [false, 'diagonal']
    } else if (row1 == row2 && col1 == col2) {
      return [false, 'no move (should consider double tap on "special" gems?)']
    }

    if (
      (row1 != row2 && Math.abs(row1 - row2) > 1) ||
      (col1 != col2 && Math.abs(col1 - col2) > 1)
    ) {
      return [false, 'distance greater than 1']
    }

    if (
      row1 < 0 ||
      row1 > rows - 1 ||
      col1 < 0 ||
      col1 > cols - 1 ||
      row2 < 0 ||
      row2 > rows - 1 ||
      col2 < 0 ||
      col2 > cols - 1
    ) {
      return [false, 'start or end, out of bounds']
    }
    return [true, '']
  }

  const [validMove, errorMsg] = isValidMove(board, row1, col1, row2, col2)
  let direction = getDirection(board, row1, col1, row2, col2)

  let result = validMove ? 'Processing move: ' : 'Invalid move:    '
  let coordinates = `[${row1}:${col1}] to [${row2}:${col2}]`
  let icons = '\t'
  let updatedBoard = JSON.parse(JSON.stringify(board))
  let horizontalMatches = null
  let verticalMatches = null
  if (validMove || !errorMsg.includes('bounds')) {
    icons = `${testBoard[row1][col1]} => ${testBoard[row2][col2]}`
    let tmpGem = updatedBoard[row2][col2]
    updatedBoard[row2][col2] = updatedBoard[row1][col1]
    updatedBoard[row1][col1] = tmpGem
    horizontalMatches = getHorizontalMatches(updatedBoard)
    verticalMatches = getVerticalMatches(updatedBoard)
  }
  console.log(
    `${result}${coordinates} => ${icons}\t ${
      errorMsg
        ? '❌ ' + errorMsg
        : '✅ ' +
          direction[1] +
          ' ' +
          direction[0]
    }`,
  )
  showMatrixAtConsole(board)
  console.log('After:');
  showMatrixAtConsole(updatedBoard)
  console.log(
    `Horizontal matches: ${horizontalMatches.length} => ${JSON.stringify(
      horizontalMatches,
    )}\nVertical matches:   ${verticalMatches.length} => ${JSON.stringify(
      verticalMatches,
    )}\n`,
  )
}

function getHorizontalMatches(board, minimumConsecutiveItems=3 /*3 or more consecutive similar gems*/) {
  const rows = board.length
  const cols = board[0].length
  let matches = []
  for (let row = 0; row < rows; row++) {
    // Looking for #minimumConsecutiveItems consecutive gems:   X X O O X X X
    for (let col = 0; col <= cols - minimumConsecutiveItems; col++) {
      let colIncrement = 1
      let matchesCount = 0
      let partialMatches = [[row, col]]
      while (
        col + colIncrement <= cols - 1 &&
        board[row][col] == board[row][col + colIncrement]
      ) {
        partialMatches.push([row, col + colIncrement])
        matchesCount++
        colIncrement++
      }
      if (matchesCount + 1 >= minimumConsecutiveItems) {
        matches = [...matches, partialMatches]
        const updatedCol = col + matchesCount
        col = updatedCol >= cols - 1 ? cols - 1 : updatedCol
      }
      // if (showLogs && colIncrement >= 3) { console.log('partialMatches: ', JSON.stringify(partialMatches), { matchesCount, col, colIncrement }) }
    }
  }
  return matches
}

function getVerticalMatches(board, minimumConsecutiveItems=3 /*3 or more consecutive similar gems*/) {
  const rows = board.length
  const cols = board[0].length
  let matches = []
  for (let col = 0; col < cols; col++) {
    // Looking for #minimumConsecutiveItems consecutive gems:   X X O O X X X
    for (let row = 0; row <= rows - minimumConsecutiveItems; row++) {
      let rowIncrement = 1
      let matchesCount = 0
      let partialMatches = [[row, col]]
      while (row + rowIncrement <= rows - 1 && board[row][col] == board[row + rowIncrement][col]) {
        partialMatches.push([row + rowIncrement, col])
        matchesCount++
        rowIncrement++
      }
      if (matchesCount + 1 >= minimumConsecutiveItems) {
        matches = [...matches, partialMatches]
        const updatedRow = row + matchesCount
        row = updatedRow >= rows - 1 ? rows - 1 : updatedRow
      }
      //if (showLogs && rowIncrement >= 3) { console.log('partialMatches: ', JSON.stringify(partialMatches), { matchesCount, row, rowIncrement }) }
    }
  }
  return matches
}

function getPossibleHorizontalMatches(board) {
  const rows = board.length
  const cols = board[0].length
  let matches = []
  for (let row = 0; row < rows; row++) {
    // Left to right
    for (let col = 0; col <= cols - 1; col++) {
      if (col + 1 <= cols - 1 && board[row][col] == board[row][col + 1]) {
        /* Igual al siguiente:                    [💋	💋]	🌲	💋 */
        if (col + 3 <= cols - 1) {
          if (board[row][col] != board[row][col + 2] && board[row][col] == board[row][col + 3]) {
            matches = [
              ...matches,
              [
                [row, col + 2],
                [row, col + 3],
              ],
              [
                [row, col + 3],
                [row, col + 2],
              ],
            ]
          }
        }
      }
      // if (col + 2 <= cols - 1 && board[row][col] == board[row][col + 2]) {
      //   /* Igual al que le sigue al siguiente:    [💋	🌲	💋]	💋 */
      //   if (col + 3 <= cols - 1) {
      //     if (board[row][col] != board[row][col + 1] && board[row][col] == board[row][col + 3]) {
      //       matches = [
      //         ...matches,
      //         [
      //           [row, col],
      //           [row, col + 1],
      //         ],
      //         [
      //           [row, col + 1],
      //           [row, col],
      //         ],
      //       ]
      //     }
      //   }
      // }
    }
    // Right to left
    for (let col = cols - 1; col >= 0; col--) {
      if (col - 1 >= 0 && board[row][col] == board[row][col - 1]) {
        /* Igual al anterior:                     💋 🌲 [💋 💋]*/
        if (col - 3 >= 0) {
          if (board[row][col] != board[row][col - 2] && board[row][col] == board[row][col - 3]) {
            matches = [
              ...matches,
              [
                [row, col - 2],
                [row, col - 3],
              ],
              [
                [row, col - 3],
                [row, col - 2],
              ],
            ]
          }
        }
      }
      // if (col - 2 >= 0 && board[row][col] == board[row][col - 2]) {
      //   /* Igual al que está antes del anterior:  💋 [💋 🌲 💋] */
      //   if (col - 3 >= 0) {
      //     if (board[row][col] != board[row][col - 1] && board[row][col] == board[row][col - 3]) {
      //       matches = [
      //         ...matches,
      //         [
      //           [row, col],
      //           [row, col - 1],
      //         ],
      //         [
      //           [row, col - 1],
      //           [row, col],
      //         ],
      //       ]
      //     }
      //   }
      // }
    }
    // Pending:
    //          🌲	💋	💋
    //          💋	🪐	🌈  Left up
    //
    //          💋	🪐	🌈  Left down
    //          🌲	💋	💋
    //
    //          💋	🪐	💋
    //          🌲	💋	🌈  Middle up
    //
    //          🌲	💋	🌈  Middle down
    //          💋	🪐	💋
    //
    //          💋	💋	🌈
    //          🌲	🪐	💋  Right up
    //
    //          🌲	🪐	💋  Right down
    //          💋	💋	🌈
  }
  return matches
}

function getPossibleVerticalMatches(board) {
  const rows = board.length
  const cols = board[0].length
  let matches = []
  for (let col = 0; col < cols; col++) {
    // Up to down
    for (let row = 0; row <= rows - 1; row++) {
      if (row + 1 <= rows - 1 && board[row][col] == board[row + 1][col]) {
        /* Igual al siguiente:                    [💋	💋]	🌲	💋 */
        if (row + 3 <= rows - 1) {
          if (
            board[row][col] != board[row + 2][col] &&
            board[row][col] == board[row + 3][col]
          ) {
            matches = [
              ...matches,
              [
                [row + 2, col],
                [row + 3, col],
              ],
              [
                [row + 3, col],
                [row + 2, col],
              ],
            ]
          }
        }
      }
      // if (row + 2 <= rows - 1 && board[row][col] == board[row + 2][col]) {
      //   /* Igual al que le sigue al siguiente:    [💋	🌲	💋]	💋 */
      //   if (row + 3 <= rows - 1) {
      //     if (
      //       board[row][col] != board[row + 1][col] &&
      //       board[row][col] == board[row + 3][col]
      //     ) {
      //       matches = [
      //         ...matches,
      //         [
      //           [row, col],
      //           [row + 1, col],
      //         ],
      //         [
      //           [row + 1, col],
      //           [row, col],
      //         ],
      //       ]
      //     }
      //   }
      // }
    }
    // Down to up
    for (let row = rows - 1; row >= 0; row--) {
      // if (row - 2 >= 0 && board[row][col] == board[row - 2][col]) {
      //   /* Igual al que le sigue al siguiente:    [💋	🌲	💋]	💋 */
      //   if (row - 3 >= 0) {
      //     if (
      //       board[row][col] != board[row - 1][col] &&
      //       board[row][col] == board[row - 3][col]
      //     ) {
      //       matches = [
      //         ...matches,
      //         [
      //           [row, col],
      //           [row - 1, col],
      //         ],
      //         [
      //           [row - 1, col],
      //           [row, col],
      //         ],
      //       ]
      //     }
      //   }
      // }
      if (row - 1 >= 0 && board[row][col] == board[row - 1][col]) {
        /* Igual al siguiente:                    [💋	💋]	🌲	💋 */
        if (row - 3 >= 0) {
          if (
            board[row][col] != board[row - 2][col] &&
            board[row][col] == board[row - 3][col]
          ) {
            matches = [
              ...matches,
              [
                [row - 2, col],
                [row - 3, col],
              ],
              [
                [row - 3, col],
                [row - 2, col],
              ],
            ]
          }
        }
      }
    }
    // Pending:
    //          🌲  🪐  Left to right
    //          🌈  🌲
    //          💋  🌲
    //
    //          🪐  🌲  Right to left
    //          🌲  🌈
    //          🌲	💋
    //
    //          🌈  🌲
    //          🌲  🪐  Middle left to right
    //          💋  🌲
    //
    //          🌲  🌈
    //          🪐  🌲  Middle right to left
    //          🌲  💋
    //
    //          🌈  🌲
    //          💋  🌲
    //          🌲  🪐  Right to left
    //
    //          🌲  🌈
    //          🌲	💋
    //          🪐  🌲  Left to right
  }
  return matches
}


// Testing //

const rows = 10
const cols = 8

function showMatrixAtConsole(board, indexStartAt=0) {
  const rows = board.length
  const cols = board[0].length
  let rowToPrint = ""
  for (let col = 0; col < cols; col++) {
    rowToPrint = rowToPrint + `\t${col == 0 ? '\t' : ''}` + (col + indexStartAt)
  }
  console.log(rowToPrint);   // Columns header:               0            1        ...
  for (let row = 0; row < rows; row++) {
    rowToPrint = ''
    for (let col = 0; col < cols; col++) {
      rowToPrint = rowToPrint + (col == 0 ? `\t${row + indexStartAt}\t` : '\t') + board[row][col]
    }
    console.log(rowToPrint) // Row data with index: 0   matrix(0,0)   matrix(0,1)   ...
  }
}

let testBoardHorizontal = [    // Used to test getHorizontalMatches()
  ['💋', '💋', '💋', '🚽', '💛', '🟣', '🍎', '💋'],
  ['🌎', '💛', '💛', '💛', '💛', '💋', '💋', '🌎'],
  ['🚽', '🪐', '🟣', '🟣', '🟣', '🟣', '🟣', '💋'],
  ['💋', '🪐', '💋', '💋', '💋', '💋', '💋', '💋'],
  ['💋', '🌲', '🌲', '🌲', '🌲', '🌲', '🌲', '🌲'],
  ['💛', '💛', '💛', '💛', '💛', '💛', '💛', '💛'],
  ['🌲', '🌲', '🌲', '🌲', '🌲', '🌲', '🌲', '💚'],
  ['🌎', '🌎', '🌎', '🌎', '🌎', '🌎', '🍎', '🌈'],
  ['🪐', '🪐', '🪐', '🪐', '🪐', '🌲', '🌲', '🌲'],
  ['🚽', '🚽', '🚽', '🚽', '💋', '💋', '🟣', '🚽'],
]

let testBoardVertical = [    // Used to test getVerticalMatches()
  ['🚽', '🌲', '💋', '💋', '💛', '🟣', '🍎', '💋'],
  ['🚽', '💛', '🌲', '🚽', '💛', '🟣', '🌎', '💋'],
  ['🚽', '🟣', '🟣', '💚', '🌈', '🍎', '🌎', '💋'],
  ['💋', '💛', '🌈', '🍎', '💋', '🚽', '🌎', '💋'],
  ['💋', '💛', '🌲', '🍎', '🌲', '🚽', '🌎', '💋'],
  ['🪐', '💛', '🌲', '🍎', '🪐', '🚽', '🌎', '💋'],
  ['🌈', '💛', '🌲', '💋', '🪐', '🚽', '🌎', '💋'],
  ['🌈', '🌲', '🌲', '🍎', '🪐', '🚽', '🌲', '💋'],
  ['🌈', '🚽', '🌲', '🍎', '🪐', '🌎', '🟣', '💋'],
  ['🌈', '🚽', '🟣', '🍎', '💋', '🪐', '🟣', '💋'],
]

let testBoardHorizontalPairs = [    // Used to test getHorizontalMatches()
  ['🚽', '🚽', '💛', '💋', '💋', '🟣', '🍎', '🍎'],
  ['🌎', '💛', '💛', '🚽', '💛', '💛', '💋', '🌎'],
  ['🚽', '🟣', '💚', '💚', '💋', '🍎', '🍎', '💋'],
  ['💋', '💋', '🌈', '🍎', '🍎', '🪐', '🌎', '🌎'],
  ['🌲', '🚽', '🪐', '🌎', '🌲', '🌲', '🌈', '🚽'],
  ['🪐', '💛', '💚', '🌈', '🟣', '🟣', '🌎', '🌈'],
  ['💋', '💋', '🌈', '🍎', '🍎', '🪐', '🌎', '🌎'],
  ['🚽', '🟣', '💚', '💚', '💋', '🍎', '🍎', '💋'],
  ['🌎', '💛', '💛', '🚽', '💛', '💛', '💋', '🌎'],
  ['🚽', '🚽', '💛', '💋', '💋', '🟣', '🍎', '🍎'],
]

let testBoardVerticalPairs = [    // Used to test getVerticalMatches()
  ['🌎', '🚽', '💚', '💛', '🌎', '💚', '🚽', '🌎'],
  ['🌎', '🌎', '🌈', '🚽', '🌎', '🌈', '🌎', '🌎'],
  ['🚽', '🌎', '🚽', '💚', '🚽', '💚', '🌎', '🚽'],
  ['🌎', '💚', '🌎', '🍎', '💚', '🌎', '💚', '🌎'],
  ['🌎', '🌎', '🌎', '🌎', '🌎', '🌎', '🌎', '🌎'],
  ['🪐', '🌎', '💚', '🌎', '🌎', '💚', '🌎', '🪐'],
  ['💋', '💚', '🌎', '🍎', '💚', '🌎', '💚', '💋'],
  ['🌎', '🚽', '🌎', '💚', '🚽', '🌎', '🌎', '🌎'],
  ['🌎', '🌎', '💛', '🚽', '🌎', '💛', '🌎', '🌎'],
  ['🪐', '🌎', '🪐', '💋', '🌎', '🪐', '🚽', '🪐'],
]

let testBoardMultiplePossibleHorizontalMatches = [    // Used to test getPossibleHorizontalMatches()
  ['🚽', '🚽', '💋', '🚽', '🚽', '🪐', '🌲', '🌈'],
  ['🌲', '💛', '💛', '🪐', '💛', '💛', '🚽', '🌲'],
  ['💋', '🌲', '🟣', '🟣', '🌈', '🟣', '🟣', '🌲'],
  ['💋', '🚽', '💚', '🍎', '🍎', '🌈', '🍎', '🍎'],
  ['💛', '💛', '🌈', '🌈', '🌲', '🌈', '🌲', '🌲'],
  ['🟣', '🟣', '🍎', '🪐', '💛', '💛', '🚽', '💛'],
  ['🍎', '💋', '🟣', '💋', '💛', '🌎', '💛', '💛'],
  ['🚽', '🚽', '💋', '🚽', '💋', '💋', '🚽', '🌈'],
  ['🌲', '💛', '💛', '🪐', '💛', '💛', '🚽', '💛'],
  ['💛', '💛', '🌈', '💛', '🌲', '🌲', '🌈', '🌲'],
]

let testBoardMultiplePossibleVerticalMatches = [      // Used to test getPossibleVerticalMatches()
  ['🚽', '🌲', '💋', '💋', '💛', '🟣', '🍎', '🚽'],
  ['🚽', '💛', '🌲', '🚽', '💛', '🟣', '💋', '🚽'],
  ['💋', '💛', '🟣', '💚', '🌈', '🍎', '🟣', '💋'],
  ['🚽', '🪐', '🟣', '🍎', '💋', '🪐', '💋', '🚽'],
  ['🚽', '💛', '🌈', '🍎', '🌲', '💋', '🌈', '🚽'],
  ['🪐', '💛', '🟣', '🌈', '🌲', '💛', '🌎', '🪐'],
  ['🌲', '🚽', '🟣', '🍎', '🌈', '💛', '💛', '🌲'],
  ['🌈', '🌲', '🌲', '🍎', '🌲', '🚽', '💛', '🌈'],
  ['💋', '🚽', '🌲', '🌎', '🪐', '💛', '🌎', '💋'],
  ['💚', '🚽', '🟣', '💚', '💋', '🪐', '💛', '💚'],
]

let testBoardExcalidraw = [
  ['🚽', '🌲', '💋', '💋', '💛', '🟣', '🍎', '💋'],
  ['🌎', '💛', '🌲', '🚽', '💛', '🟣', '💋', '🌎'],
  ['🚽', '🟣', '🟣', '💚', '🌈', '🍎', '🟣', '💋'],
  ['💋', '🪐', '🌈', '🍎', '💋', '🪐', '💋', '🌎'],
  ['💋', '💛', '🌈', '🌎', '🌲', '💋', '🌈', '🚽'],
  ['🪐', '💛', '💚', '🌈', '🟣', '💛', '🌎', '🌈'],
  ['🌲', '🚽', '🟣', '💚', '🌈', '💚', '💛', '🪐'],
  ['🌈', '🌲', '🌲', '🍎', '💛', '🚽', '🌎', '🌈'],
  ['💋', '🚽', '🌲', '🌎', '🪐', '🌎', '🌎', '🌲'],
  ['💚', '🚽', '🟣', '💚', '💋', '🪐', '🟣', '🚽'],
]



// // // Board testBoardHorizontal: Multiple horizontal matches:
// testBoard = testBoardHorizontal
// showMatrixAtConsole(testBoard)
// let testBoardMatches = getHorizontalMatches(testBoard)
// console.log(testBoardMatches.length > 0 ? JSON.stringify(testBoardMatches) : 'No horizontal matches')
// testBoardMatches = getVerticalMatches(testBoard)
// console.log(testBoardMatches.length > 0 ? JSON.stringify(testBoardMatches) : 'No vertical matches')
// /********************************************************************* */



// // Board testBoardVertical: Multiple vertical matches:
// testBoard = testBoardVertical
// showMatrixAtConsole(testBoard)
// let testBoardMatches = getHorizontalMatches(testBoard)
// console.log(testBoardMatches.length > 0 ? JSON.stringify(testBoardMatches) : 'No horizontal matches')
// testBoardMatches = getVerticalMatches(testBoard)
// console.log(testBoardMatches.length > 0 ? JSON.stringify(testBoardMatches) : 'No vertical matches')
// /********************************************************************* */



// // Board Excalidraw - No matches:
// testBoard = testBoardExcalidraw
// showMatrixAtConsole(testBoard)
// let testBoardMatches = getHorizontalMatches(testBoard)
// console.log(testBoardMatches.length > 0 ? 'Horizontal matches:' + JSON.stringify(testBoardMatches) : 'No horizontal matches')
// testBoardMatches = getVerticalMatches(testBoard)
// console.log(testBoardMatches.length > 0 ? 'Vertical matches:  ' + JSON.stringify(testBoardMatches) : 'No vertical matches')
// /********************************************************************* */

// // Movimientos inválidos:
// console.log('');
// processMove(testBoard, row0=0, col0=0, row1=0, col1=0)  //    ❌  no move
// processMove(testBoard, row0=0, col0=0, row1=1, col1=1)  //    ❌  diagonal
// processMove(testBoard, row0=0, col0=0, row1=0, col1=2)  // →→ ❌  distance greater than 1
// processMove(testBoard, row0=0, col0=0, row1=2, col1=0)  // ↓↓ ❌  distance greater than 1
// processMove(testBoard, row0=-1, col0=0, row1=0, col1=0) //   ❌  out of grid bounds
// processMove(testBoard, row0=0, col0=-1, row1=0, col1=0) //   ❌  out of grid bounds
// processMove(testBoard, row0=9, col0=0, row1=10, col1=0) //   ❌  out of grid bounds
// processMove(testBoard, row0=0, col0=9, row1=0, col1=10) //   ❌  out of grid bounds

// // Movimientos válidos - No debería detectar matches:
// console.log('');
// processMove(testBoard, row0=0, col0=0, row1=0, col1=1)  // →  ✅
// processMove(testBoard, row0=0, col0=0, row1=1, col1=0)  // ↓  ✅

// // Movimientos válidos - Debería detectar potenciales matches!: 💡
// // console.log('\nPotencial matches in testBoard:')
// processMove(testBoard, row0=1, col0=6, row1=1, col1=7)  // En columna siguiente 💋 => 🌎
// processMove(testBoard, row0=1, col0=7, row1=1, col1=6)  // En columna anterior  🌎 => 💋

// processMove(testBoard, row0=2, col0=5, row1=2, col1=6)  // Misma columna        🍎 => 🟣
// processMove(testBoard, row0=2, col0=6, row1=2, col1=5)  // En columna siguiente 🟣 => 🍎

// processMove(testBoard, row0=2, col0=6, row1=2, col1=7)  // Misma columna        🟣 => 💋
// processMove(testBoard, row0=2, col0=7, row1=2, col1=6)  // En columna anterior  💋 => 🟣

// processMove(testBoard, row0=3, col0=5, row1=4, col1=5)  // Fila actual          🪐 => 💋
// processMove(testBoard, row0=4, col0=5, row1=3, col1=5)  // Fila anterior        💋 => 🪐

// processMove(testBoard, row0=5, col0=2, row1=5, col1=3)  // Misma columna        💚 => 🌈
// processMove(testBoard, row0=5, col0=3, row1=5, col1=2)  // En columna anterior  🌈 => 💚

// processMove(testBoard, row0=5, col0=6, row1=6, col1=6)  // Misma columna        🌎 => 💛
// processMove(testBoard, row0=6, col0=6, row1=5, col1=6)  // Misma columna        💛 => 🌎

// processMove(testBoard, row0=6, col0=0, row1=7, col1=0)  // En la fila siguiente 🌲 => 🌈
// processMove(testBoard, row0=7, col0=0, row1=6, col1=0)  // En la fila siguiente 🌈 => 🌲

// processMove(testBoard, row0=6, col0=1, row1=7, col1=1)  // Misma columna        🚽 => 🌲
// processMove(testBoard, row0=7, col0=1, row1=6, col1=1)  // Misma columna        🚽 => 🌲

// processMove(testBoard, row0=8, col0=3, row1=8, col1=4)  // Misma fila           🌎 => 🪐
// processMove(testBoard, row0=8, col0=4, row1=8, col1=3)  // Misma fila           🪐 => 🌎
// /********************************************************************* */





// // Board testBoardMultiplePossibleHorizontalMatches - No matches:
// testBoard = testBoardMultiplePossibleHorizontalMatches
// showMatrixAtConsole(testBoard)
// let testBoardMatches = getHorizontalMatches(testBoard)
// console.log(testBoardMatches.length > 0 ? 'Horizontal matches:' + JSON.stringify(testBoardMatches) : 'No horizontal matches')
// testBoardMatches = getVerticalMatches(testBoard)
// console.log(testBoardMatches.length > 0 ? 'Vertical matches:  ' + JSON.stringify(testBoardMatches) : 'No vertical matches')
// /********************************************************************* */



// // Board testBoardMultiplePossibleVerticalMatches - No matches:
// testBoard = testBoardMultiplePossibleVerticalMatches
// showMatrixAtConsole(testBoard)
// let testBoardMatches = getHorizontalMatches(testBoard)
// console.log(testBoardMatches.length > 0 ? 'Horizontal matches:' + JSON.stringify(testBoardMatches) : 'No horizontal matches')
// testBoardMatches = getVerticalMatches(testBoard)
// console.log(testBoardMatches.length > 0 ? 'Vertical matches:  ' + JSON.stringify(testBoardMatches) : 'No vertical matches')
// /********************************************************************* */



// // Board random - Shouldn't have matches:
testBoard = generateBoard(rows, cols, generateGemsRow, getRandomGem, gems)
let testBoardMatches = getHorizontalMatches(testBoard); console.log(testBoardMatches.length > 0 ? JSON.stringify(testBoardMatches) : 'No horizontal matches')
testBoardMatches = getVerticalMatches(testBoard);       console.log(testBoardMatches.length > 0 ? JSON.stringify(testBoardMatches) : 'No vertical matches')
showMatrixAtConsole(testBoard)
/********************************************************************* */


function detectPossibleMoves(testBoard) {
  // Cantidad de movimientos posibles por gema:
  //        0   1   2   3   4   5   6   7
  //                                    .
  // 0      2   3   3   3   3   3   3   2       (row == 0 || row == 9) && (col == 0 || col == 7) ? 2 : 3    (a excepción de que la row sea la > 0 y < 9)
  // 1      3   4   4   4   4   4   4   3       (row > 0 && row < 9)   && (col == 0 || col == 7) ? 3 : 4    (a excepción de que la row sea la 0 o la 9)
  // 2      3   4   4   4   4   4   4   3
  // 3      3   4   4   4   4   4   4   3
  // 4      3   4   4   4   4   4   4   3
  // 5      3   4   4   4   4   4   4   3
  // 6      3   4   4   4   4   4   4   3
  // 7      3   4   4   4   4   4   4   3
  // 8      3   4   4   4   4   4   4   3
  // 9      2   3   3   3   3   3   3   2
  //
  // 2 x  4           =>   8
  // 3 x 12 + 3 x 16  =>  84
  // 4 x  8 x 6       => 192
  //            Total => 284 movimientos disponibles
  /*

    board = [ [A, A, B, C, C, C, C, D] ]
    row 1
    cols 8

    row   col   colIncrement  matchesCount   partialMatches    board[row, col]
    0     0     1             0              [[0,0]]           A
    2           1             [[0,0], [0,1]]
  */

  /*Refactoricé las funciones que detectan matches horizontales y verticales para que ahora se les pueda pasar el parámetro 'minimumConsecutiveItems'
    mediante el cual indico cual es el mínimo de coincidencias que quiero que me incluyan en las respuestas sobre matches encontrados
    entonces pasando minimumConsecutiveItems=2, obtengo un array con todos los matches de 2 o más gemas (2 o más gemas similares consecutivas).  */

  console.log('Possible moves:')

  let testBoardMatches = getPossibleHorizontalMatches(testBoard)
  console.log(testBoardMatches.length > 0 ? '\tPossible horizontal matches: ' + JSON.stringify(testBoardMatches) : '\tNo possible horizontal matches')
  // Filtrando resultados repetidos:
  // console.log([...new Set(testBoardMatches)])
  // let set1 = new Set()
  // for (let index = 0; index < testBoardMatches.length; index++) {
  //   console.log('Adding to set:', testBoardMatches[index])
  //   set1.add(testBoardMatches[index])
  // }
  // console.log({set1});
  testBoardMatches = getPossibleVerticalMatches(testBoard)
  console.log(testBoardMatches.length > 0 ? '\tPossible vertical matches:  ' + JSON.stringify(testBoardMatches) : '\tNo possible vertical matches')
  return "..."
}

detectPossibleMoves(testBoard);













