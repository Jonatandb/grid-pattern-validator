import { Coordinate } from "./Coodinate";
import { FindPatternInGrid } from "./FindPatternInGrid";
import Grid from "./Grid";
import GridPattern from "./GridPattern";
import readline from "readline";

const sleep =  async (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds*1000));

// Constants
const SLEEP_SECONDS = 1
const EXPLOSION = "💥"
const GEMS: string[] = ["🟣","⚪","🔴","🔵","🟡","🟢","🟤"] 
const GEMS_TO_FILL: string[] = ["🟪", "⬜", "🟥", "🟦", "🟨", "🟩", "🟫"]
const PATTERNS = [
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


// Cosmetic function -- begin
const showTitle = (message: string) => {
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
    console.log(message+'\n\n')
}

const showRotated = async (grid: string[][], _empty: boolean|null= null) => {
    let newGrid = new Grid(grid)
    newGrid.rotate()
    newGrid.rotate()
    newGrid.rotate()
    let header = ' '
    for (let col = 0; col < newGrid.getColumnLimit(); col++) {
        header+='    '+col
    }
    console.log(header+'\n')
    let c = 0
    for (const row of newGrid.getMatrix()) {
        // _empty is just to show empty cells
        if (_empty) {
            let empty_row = JSON.stringify(row)
            for (const tf of GEMS_TO_FILL) {
                empty_row = empty_row.split(tf).join("  ")
            }
            console.log(c+'   '+empty_row.replace('["',"").replace('"]',"").split('","').join("   ")+'\n')   
        } else {
            console.log(c+'   '+JSON.stringify(row).replace('["',"").replace('"]',"").split('","').join("   ")+'\n')   
        }
        c++
    }
    await sleep(SLEEP_SECONDS)
}

const showPattern = (matrix: any) => {
    matrix.forEach((element: any) => {
        console.log(element)
    });
}

// Cosmetic function -- end

// Generators  -- begin
const gridGenerator = (limitRow: number, limitColumns: number) => {    
    const grid: string[][] = []
    let header = ' '
    for (let col = 0; col < limitColumns; col++) {
        header+='   '+col
    }
    console.log(header+'\n')
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

const elementToFillGenerator = (amount: number) => {
    const list: string[] = []
    for (let row = 0; row < amount; row++) {
            const id = Math.floor(Math.random() * GEMS_TO_FILL.length)
            list.push(GEMS_TO_FILL[id])
    }
    return list
}
// Generators  -- end

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


console.log('******************************************\n*         GRID PATTERN VALIDATOR         *\n******************************************\n\n')


const rawGrid = gridGenerator(8,10)
const grid = new Grid(rawGrid);

const run = async (fromX:number|null=null, fromY:number|null=null, toX:number|null=null, toY:number|null=null) => {
    
    let response: any = 'not'
    console.log(''+ fromX + fromY +toX +toY)
    console.log(grid.getColumnLimit())
    sleep(3)
    if (fromX && fromY && toX && toY) {
        const coordinateFrom = new Coordinate(fromY, grid.getColumnLimit() - fromX - 1)
        const coordinateTo = new Coordinate(toY, grid.getColumnLimit() - toX - 1)
        response = grid.swap(coordinateFrom, coordinateTo)
    }

    const match3 = FindPatternInGrid.run(grid, new GridPattern([[1,1,1]]))

    showTitle('Original Matrix '+ response)
    await showRotated(grid.getMatrix() as string[][])

    if (match3.length) {
        // change match3 by explosion
        const exploded: Coordinate[] = []
        for (const group of match3) {
            for (const coordinate of group) {
                if (grid.getCell(coordinate)!=EXPLOSION) {
                    if (grid.putInCell(coordinate, EXPLOSION)) {
                        exploded.push(coordinate)
                    }
                }
            }
        }
        showTitle('Exploded Matrix')
        await showRotated(grid.getMatrix() as string[][])
        
        const removedElements = grid.removeElement(EXPLOSION)
        grid.fill(elementToFillGenerator(removedElements))

        showTitle('Empty Exploded Matrix')
        await showRotated(grid.getMatrix() as string[][], true)
        
        showTitle('Filled Matrix')
        await showRotated(grid.getMatrix() as string[][])

        grid.exchange(GEMS_TO_FILL, GEMS)
    }
    
    let posibleMatches: any = []
    for (const patern of PATTERNS) {
        const pattern = new GridPattern(patern);
        console.log('Pattern')
        // showPattern(patern)
        posibleMatches = posibleMatches.concat(FindPatternInGrid.run(grid, pattern))
    }
    console.log('Posible Matches')
    console.log(posibleMatches)
    showTitle('Final Matrix')
    await showRotated(grid.getMatrix() as string[][])
}


function question(query: string) {
    rl.on("close", function() {
        console.log("\nBYE BYE !!!");
        process.exit(0);
    });
    return new Promise(resolve => rl.question(query, answer => resolve(answer)))
}

const play = async () => {
    let inputValue: any = []
    await run()
    inputValue = await question("Introducir Coordenadas desde hasta => xy-xy o end: ")
    while (inputValue!='end') {
        console.log(inputValue)
        const positions = inputValue.toString().split('-')
        if (positions.length== 2) {
            let positionfrom: any = positions[0].split('')
            let positionTo: any = positions[1].split('')
            await run(positionfrom[0], positionfrom[1], positionTo[0], positionTo[1])
        } else {
            console.log('wrong input!\n')
        }
        inputValue = await question("Introducir Coordenadas desde hasta => xy-xy o end: ")
    }
    rl.close();
}


play()
