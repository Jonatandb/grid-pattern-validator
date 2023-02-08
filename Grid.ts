type Cell = unknown
type Row = Cell[]
export type Matrix = Row[]

export default class Grid {
    protected matrix: Matrix
    // private field
    private rowLimit: number
    private columnLimit: number
    
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

    // Rotate Grid to the right
    rotate() {
        const patternInverted: Matrix = []
        for (let row = 0; row < this.matrix[0].length; row++) {
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