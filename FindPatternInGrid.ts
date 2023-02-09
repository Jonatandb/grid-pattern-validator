import Grid, { Matrix } from "./Grid";
import GridPattern, { Coordinate } from "./GridPattern";

export class FindPatternInGrid {
    
    private static posibleMatches(mygrid: Grid, pattern: GridPattern): Coordinate[][] {
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
                const partialGridSizeColumns = gridColumnsLimit - column
                const partialGridSizeRows = gridRowsLimit - row
                // Take subgrid
                if (partialGridSizeColumns >= patternColumnsLimit && partialGridSizeRows >= patternRowsLimit) {
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
        const posibleMatches = this.posibleMatches(mygrid, pattern)
        // rotate pattern to check match on rotated pattern orientation
        pattern.rotate()
        const posibleMatchesRotated = this.posibleMatches(mygrid, pattern)
        pattern.rotate()
        const posibleMatchesInverted = this.posibleMatches(mygrid, pattern)
        pattern.rotate()
        const posibleMatchesInvertedRotated = this.posibleMatches(mygrid, pattern)
        return posibleMatches
                .concat(posibleMatchesRotated)
                .concat(posibleMatchesInverted)
                .concat(posibleMatchesInvertedRotated)
    }
}