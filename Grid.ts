import { Coordinate } from "./Coodinate"

type Cell = unknown
type Row = Cell[]
export type Matrix = Row[]

export default class Grid {
    protected matrix: Matrix
    // private field
    protected rowLimit: number
    protected columnLimit: number
    
    constructor(matrix: Matrix) {
        this.rowLimit = matrix.length
        this.columnLimit = matrix[0].length
        this.matrix = matrix
    }

    getMatrix(): Matrix {
        return this.matrix
    }

    getRowLimit(): number {
        return this.rowLimit
    }

    getColumnLimit(): number {
        return this.columnLimit
    }

    getRow(index: number) {
        return this.matrix[index]
    }

    putInCell(coordinate: Coordinate, value: Cell) {
        const [x, y] = coordinate.getXY()
        if (x >= 0 && x < this.rowLimit && y >= 0 && y < this.columnLimit) {
            this.matrix[x][y] = value
            return true
        } else {
            return false
        }
    }

    getCell(coordinate: Coordinate) {
        return this.matrix[coordinate.getX()][coordinate.getY()]
    }

    swap(coordinateFrom: Coordinate, coordinateTo: Coordinate): boolean {
        const [cfromX, cfromY] = coordinateFrom.getXY()
        const [cToX, cToY] = coordinateTo.getXY()
        // only can swap with a next cell ( up / right / down / left ) and cannot move to the same point
        const validMomement = !(cfromX==cToX && cfromY==cToY) && ((cfromX==cToX && Math.abs(cfromY-cToY)==1) || (Math.abs(cfromX-cToX)==1 && cfromY==cToY))
        // validate limits and movement
        if ((cfromX >= 0 && cfromX < this.rowLimit && cfromY >= 0 && cfromY < this.columnLimit) &&
        (cToX >= 0 && cToX < this.rowLimit && cToY >= 0 && cToY < this.columnLimit) && validMomement) {
            const aux = this.getCell(coordinateFrom)
            this.matrix[cfromX][cfromY] = this.getCell(coordinateTo)
            this.matrix[cToX][cToY] = aux
            return true
        }
        return false
    }

    // return number of removed elements
    removeElement(value: Cell): number {
        let removed = 0
        for (let row = 0; row < this.rowLimit; row++) {
            this.matrix[row] = this.matrix[row].filter(m => m!= value)
            removed+= this.columnLimit - this.matrix[row].length
        }
        return removed
    }

    fill(elements: Cell[]) {
        for (let row = 0; row < this.rowLimit; row++) {
            this.matrix[row] = this.matrix[row].concat(elements.splice(0, this.columnLimit-this.matrix[row].length))
        }
    }

    // exchange between a list of elements to another
    exchange(currentElements: Cell[], newElements: Cell[]) {
        for (let row = 0; row < this.rowLimit; row++) {
            for (let column = 0; column < this.columnLimit; column++) {
                const index = currentElements.indexOf(this.matrix[row][column])
                if (index!==-1) {
                    this.matrix[row][column] = newElements[index]
                }
            }
        }
    }

    // Rotate Grid to the right
    rotate() {
        const patternInverted: Matrix = []
        for (let row = 0; row < this.columnLimit; row++) {
            let rowToAdd: Row = []
            for (let column = this.matrix.length-1; column > -1; column--) {
                rowToAdd.push(this.matrix[column][row])
            }
            patternInverted.push(rowToAdd)
        }
        this.matrix = patternInverted
        this.rowLimit = this.matrix.length
        this.columnLimit = this.matrix[0].length
    }
}