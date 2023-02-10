import Grid, { Matrix } from "./Grid"

type RowPostion = number
type ColumnPosition = number
export type Coordinate = [RowPostion, ColumnPosition]
// override with type number
type Cell = number

enum PatternCellStates {
    Match = 1,
    Any = 0,
    NotMatch = -1,
}

export default class GridPattern extends Grid {

    match(grid: Matrix): Coordinate[]|false {
        let mainValue: Cell = 0
        let coordinates: Coordinate[] = []

        for (let row = 0; row < this.matrix.length; row++) {
            for (let column = 0; column < this.matrix[row].length; column++) {
                const currentElement: Cell = grid[row][column] as Cell
                const cellState = this.matrix[row][column]
                // store the first active element from the pattern
                if (mainValue==0 && cellState) {
                    mainValue = currentElement as Cell
                }
                if (cellState==PatternCellStates.Match && mainValue!=currentElement) {
                    return false
                } else if (cellState==PatternCellStates.NotMatch && mainValue==currentElement) {
                    return false
                } else if (cellState==PatternCellStates.Match && mainValue==currentElement) {
                    coordinates.push([row, column])
                }
            }
        }
        return coordinates
    }
}