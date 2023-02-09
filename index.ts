import { FindPatternInGrid } from "./FindPatternInGrid";
import Grid from "./Grid";
import GridPattern from "./GridPattern";

const gridGenerator = (limitRow: number, limitColumns: number) => {
    const GEMS: string[] = ["🟣","⚪","🔴","🔵","🟡","🟢","🟤" ] 
    const grid: string[][] = []
    let show = ' '
    for (let col = 0; col < limitColumns; col++) {
        show+='   '+col
    }
    console.log(show+'\n')
    for (let row = 0; row < limitRow; row++) {
        const gems: string[] = []
        for (let column = 0; column< limitColumns; column++) {
            const id = Math.floor(Math.random() * GEMS.length)
            gems.push(GEMS[id])
        }
        grid.push(gems)
        console.log(row+'   '+JSON.stringify(grid[grid.length-1]).replace('["',"").replace('"]',"").split('","').join("  ")+'\n')
    }
    return grid
}

const show = (matrix: any) => {
    matrix.forEach((element: any) => {
        console.log(element)
    });
}

const patterns = [
    [
        [1,0,1,1],
    ],[
        [1,1,0],
        [0,0,1],
    ],[
        [1,0,1],
        [0,1,0],
    ],[
        [0,1,1],
        [1,0,0],
]]



console.log('******************************************\n*         GRID PATTERN VALIDATOR         *\n******************************************\n\n')

let posibleMatches: any = []
const grid = new Grid(gridGenerator(10,8));
for (const matrix of patterns) {
    const pattern = new GridPattern(matrix);
    console.log('Pattern')
    show(matrix)
    posibleMatches = posibleMatches.concat(FindPatternInGrid.run(grid, pattern))
    
}
console.log('----------------------------------------')
console.log('check PosibleMatches')
console.log(posibleMatches)

console.log('----------------------------------------')
console.log('check MATCH 3')
console.log(FindPatternInGrid.run(grid, new GridPattern([[1,1,1]])))
console.log('----------------------------------------')
console.log('check MATCH 4')
console.log(FindPatternInGrid.run(grid, new GridPattern([[1,1,1,1]])))