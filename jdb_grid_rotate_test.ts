/*    Quiero ver si el rotate rota realmente a la derecha   */

import Grid from "./Grid"

type MatrixToShow = string[][]

// 1.Creo una matriz
const matrix = [
    [1,2,3,4],
    [5,6,7,8]
]

// 2.Instancio una Grid y se la paso
const myGrid = new Grid(matrix)

const showMatrixAtConsole = (matrix: MatrixToShow) => {
    let newGrid = new Grid(matrix)
    // newGrid.rotate()
    // newGrid.rotate()
    // newGrid.rotate()
    let header = ' '
    for (let col = 0; col < newGrid.getColumnLimit(); col++) {
        header+='    '+col
    }
    console.log(header+'\n')
    let c = 0
    let toShow: string= ""
    for (const row of newGrid.getMatrix()) {
        // _empty is just to show empty cells
        toShow+= c+ ""
        for (const cell of row) {
            toShow+="   "+ cell //(_empty && GEMS_TO_FILL.includes(cell as string) ? "  " : cell)
        }
        toShow+="\n\n"
        c++
    }
    console.log(toShow)
}

// 3.Muestro la grid en consola
showMatrixAtConsole(myGrid.getMatrix() as MatrixToShow)

// 4.Llamo a Grid.rotate()
myGrid.rotate()

// 5.Muestro la grid en consola
showMatrixAtConsole(myGrid.getMatrix() as MatrixToShow)

// 4.Llamo a Grid.rotate()
myGrid.rotate()

// 5.Muestro la grid en consola
showMatrixAtConsole(myGrid.getMatrix() as MatrixToShow)

// 4.Llamo a Grid.rotate()
myGrid.rotate()

// 5.Muestro la grid en consola
showMatrixAtConsole(myGrid.getMatrix() as MatrixToShow)

// 4.Llamo a Grid.rotate()
myGrid.rotate()

// 5.Muestro la grid en consola
showMatrixAtConsole(myGrid.getMatrix() as MatrixToShow)