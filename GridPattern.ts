import Grid, { Matrix } from "./Grid"

type RowPostion = number
type ColumnPosition = number
export type Coordinate = [RowPostion, ColumnPosition]
// override with type number
type Cell = number

export default class GridPattern extends Grid{

    match(grid: Matrix): Coordinate[]|false {
        let mainValue: Cell = 0
        let coordinates: Coordinate[] = []

        for (let row = 0; row < this.matrix.length; row++) {
            for (let column = 0; column < this.matrix[row].length; column++) {
                const currentElement = grid[row][column]
                const cellActivated = this.matrix[row][column]
                // store the first active element from the pattern
                if (mainValue==0 && cellActivated) {
                    mainValue = currentElement as Cell
                }
                if ((mainValue!=currentElement && cellActivated) || (mainValue==currentElement && !cellActivated)) {
                    return false
                } else if (mainValue==currentElement && cellActivated) {
                    coordinates.push([row, column])
                }
            }
        }
        return coordinates
    }
}