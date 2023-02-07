import { Grid, Matrix } from "./Grid";
import { Coordinate, GridPattern } from "./GridPattern";

export class FindPosibleMatches {
    
    private static posibleMatches(mygrid: Grid, pattern: GridPattern) {
        // my grid limits
        const gridRowsLimit = mygrid.getRowLimit()
        const gridColumnsLimit = mygrid.getColumnLimit()
        // grid pattern limits
        const patternRowsLimit = pattern.getRowLimit()
        const patternColumnsLimit = pattern.getColumnLimit()
        // List of posible matches
        let posibleMatches: Coordinate[][] = []

        for (let row = 0; row < gridRowsLimit; row++) {      
            for (let column = 0; column < gridColumnsLimit; column++) {
                const gridSizeColumns = gridColumnsLimit - column
                const gridSizeRows = gridRowsLimit - row
                // Take subgrid
                if (gridSizeColumns >= patternColumnsLimit && gridSizeRows >= patternRowsLimit) {
                    let subGrid: Matrix = []
                    for (let patternRow = 0; patternRow < patternRowsLimit; patternRow++) {
                        subGrid.push(mygrid.getRow(row+patternRow).slice(column, column+patternColumnsLimit))
                    }
                    // Check if subgrid match with pattern
                    const matrixPositions = pattern.match(subGrid)
                    if (matrixPositions) {
                        const rearrangedPosition: Coordinate[] = []
                        matrixPositions.forEach(matrixPosition => {
                            rearrangedPosition.push([ matrixPosition[0]+row, matrixPosition[1]+column])
                        });
                        posibleMatches.push(rearrangedPosition)
                    }
                }
            }
        }
        return posibleMatches
    }

    static run(mygrid: Grid, pattern: GridPattern): Coordinate[][] {
        // return this.runMatch(mygrid, pattern)
        const posibleMatches = this.posibleMatches(mygrid, pattern)
        pattern.invert()
        const posibleMatchesInverted = this.posibleMatches(mygrid, pattern)
        return posibleMatches.concat(posibleMatchesInverted)
    }
}