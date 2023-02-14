import { Coordinate } from "./Coodinate";
import Grid, { Matrix } from "./Grid";
import GridPattern from "./GridPattern";

type MatchCoordinates = Coordinate[]

export class FindPatternInGrid {
    
    private static posibleMatches(mygrid: Grid, pattern: GridPattern): MatchCoordinates[] {
        // my grid limits
        const gridRowsLimit = mygrid.getRowLimit()
        const gridColumnsLimit = mygrid.getColumnLimit()
        // grid pattern limits
        const patternRowsLimit = pattern.getRowLimit()
        const patternColumnsLimit = pattern.getColumnLimit()
        // List of posible matches
        let posibleMatches: MatchCoordinates[] = []

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
                    const matrixCoordenates = pattern.match(subGrid)
                    if (matrixCoordenates) {
                        const rearrange: MatchCoordinates = []
                        matrixCoordenates.forEach(coordinate => rearrange.push(new Coordinate(coordinate.getX()+row, coordinate.getY()+column)));
                        posibleMatches.push(rearrange)
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