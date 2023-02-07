import { Grid, Matrix } from "./Grid"

type RowPostion = number
type ColumnPosition = number
export type Coordinate = [RowPostion, ColumnPosition]
// override with type number
type Cell = number

export class GridPattern extends Grid{

    match(grid: Matrix): Coordinate[]|false {
        let mainValue: Cell = 0
        let coordinates: Coordinate[] = []

        for (let row = 0; row < this.matrix.length; row++) {
            for (let column = 0; column < this.matrix[row].length; column++) {
                // store the first active element from the pattern
                if (mainValue==0 && this.matrix[row][column]) {
                    mainValue = grid[row][column] as Cell
                }
                const activated = this.matrix[row][column]
                if ((mainValue!=grid[row][column] && activated) || (mainValue==grid[row][column] && !activated)) {
                    return false
                } else if (mainValue==grid[row][column] && activated) {
                    coordinates.push([row, column])
                }
            }
        }
        return coordinates
    }
}