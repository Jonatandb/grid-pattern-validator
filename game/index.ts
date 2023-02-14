import { Coordinate } from "../Coodinate";
import { FindPatternInGrid } from "../FindPatternInGrid";
import Grid from "../Grid";
import GridPattern from "../GridPattern";
import readline from "readline";
import { EXPLOSION, GEMS, GEMS_TO_FILL, PATTERNS, SLEEP_SECONDS } from "./Constants"
import generator from "./Generator";
import { showRotated, showTitle, sleep } from "./utils";

require('events').EventEmitter.prototype._maxListeners = 100;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const rawGrid = generator.grid(8,10)
const grid = new Grid(rawGrid);

const action = async (fromX:number|null=null, fromY:number|null=null, toX:number|null=null, toY:number|null=null) => {
    sleep(SLEEP_SECONDS)
    if (fromX && fromY && toX && toY) {
        // recalculated coordinates for rotated grid
        const coordinateFrom = new Coordinate(fromY, grid.getColumnLimit() - fromX - 1)
        const coordinateTo = new Coordinate(toY, grid.getColumnLimit() - toX - 1)
        grid.swap(coordinateFrom, coordinateTo)
    }

    let match3 = FindPatternInGrid.run(grid, new GridPattern([[1,1,1]]))

    if (fromX && fromY && toX && toY && !match3.length) {
        // reverse swap
        const coordinateFrom = new Coordinate(fromY, grid.getColumnLimit() - fromX - 1)
        const coordinateTo = new Coordinate(toY, grid.getColumnLimit() - toX - 1)
        grid.swap(coordinateFrom, coordinateTo)
    }

    showTitle('Original Matrix')
    await showRotated(grid.getMatrix() as string[][])

    while (match3.length) {
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
        grid.fill(generator.elementsToFill(removedElements))

        showTitle('Empty Exploded Matrix')
        await showRotated(grid.getMatrix() as string[][], true)
        
        showTitle('Filled Matrix')
        await showRotated(grid.getMatrix() as string[][])

        grid.exchange(GEMS_TO_FILL, GEMS)

        match3 = FindPatternInGrid.run(grid, new GridPattern([[1,1,1]]))
        showTitle('Match3 Found')
        await showRotated(grid.getMatrix() as string[][])
    }
    
    let posibleMatches: any = []
    for (const patern of PATTERNS) {
        const pattern = new GridPattern(patern);
        console.log('Pattern')
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
    await action()
    inputValue = await question("Introducir Coordenadas desde hasta => xy-xy o end: ")
    while (inputValue!='end') {
        console.log(inputValue)
        const positions = inputValue.toString().split('-')
        if (positions.length== 2) {
            let positionfrom: any = positions[0].split('')
            let positionTo: any = positions[1].split('')
            await action(positionfrom[0], positionfrom[1], positionTo[0], positionTo[1])
        } else {
            console.log('wrong input!\n')
        }
        inputValue = await question("Introducir Coordenadas desde hasta => xy-xy o end: ")
    }
    rl.close();
}

play()
