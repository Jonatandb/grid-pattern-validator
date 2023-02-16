import { Coordinate } from "../Coodinate";
import { FindPatternInGrid } from "../FindPatternInGrid";
import Grid from "../Grid";
import GridPattern from "../GridPattern";
import readline from "readline";
import { EXPLOSION, GEMS, GEMS_TO_FILL, PATTERNS, PATTERNS_BOMB, PATTERNS_RAINBOW, PATTERNS_RAY, SLEEP_SECONDS, SPECIAL_GEMS_BOMB, SPECIAL_GEMS_RAY_H, SPECIAL_GEM_RAINBOW } from "./Constants"
import generator from "./Generator";
import { showRotated, showTitle, sleep } from "./utils";

type MatrixToShow = string[][]

require('events').EventEmitter.prototype._maxListeners = 100;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const rawGrid = generator.grid(8,10)
const grid = new Grid(rawGrid);

const explodeRemoveFill = async (grid: Grid) => {
    showTitle('Exploded Matrix')
    await showRotated(grid.getMatrix() as MatrixToShow)
    
    const removedElements = grid.removeElement(EXPLOSION)
    grid.fill(generator.elementsToFill(removedElements))

    showTitle('Empty Exploded Matrix')
    await showRotated(grid.getMatrix() as MatrixToShow, true)
    
    showTitle('Filled Matrix')
    await showRotated(grid.getMatrix() as MatrixToShow)

    grid.exchange(GEMS_TO_FILL, GEMS)
}

const verifySpecialGemsGeneration = async (grid: Grid) => {
    // Count how many times a bomb was found
    let bombsCounter: number = 0
    let bombs: Coordinate[][] = []
    for (const patern of PATTERNS_BOMB) {
        const pattern = new GridPattern(patern);
        bombs = bombs.concat(FindPatternInGrid.run(grid, pattern))
    }
    // Count how many times a ray was found
    let raysCounter: number = 0
    let rays = FindPatternInGrid.run(grid, new GridPattern(PATTERNS_RAY))
    // Count how many times a rainbow was found
    let rainbowsCounter: number = 0
    let rainbows = FindPatternInGrid.run(grid, new GridPattern(PATTERNS_RAINBOW))

    
    const message = (bombs.length ? 'Bomb ' : '')+(rays.length ? 'Ray ' : '')+(rainbows.length ? 'Rainbow ' : '')
    showTitle(message+'Found')
    await showRotated(grid.getMatrix() as MatrixToShow)

    // if rainbow found
    if (rainbows.length) {
        // change match5 by explosion and put ray
        for (const rainbow of rainbows) {
            let countDrop = 0 // to select when drop the gem
            for (const coordinate of rainbow) {
                const currentCell = grid.getCell(coordinate)
                if (currentCell!=EXPLOSION && SPECIAL_GEM_RAINBOW!=currentCell) {
                    let newValue=""
                    if (countDrop==2) {
                        newValue=SPECIAL_GEM_RAINBOW
                        rainbowsCounter++
                    } else {
                        newValue=EXPLOSION
                    }
                    countDrop+=grid.putInCell(coordinate, newValue) ? 1 : 0
                }
            }
        }
    }
    // if bomb found
    if (bombs.length) {
        // change match T or L(long) by explosion and put bomb
        for (const bomb of bombs) {
            let countDrop = 0 // to select when drop the gem
            for (const coordinate of bomb) {
                const currentCell = grid.getCell(coordinate)
                if (currentCell!=EXPLOSION && !SPECIAL_GEMS_BOMB.includes(currentCell as string) && SPECIAL_GEM_RAINBOW!=currentCell) {
                    let newValue=""
                    if (countDrop==2) {
                        newValue=SPECIAL_GEMS_BOMB[GEMS.indexOf(currentCell as string)]
                        bombsCounter++
                    } else {
                        newValue=EXPLOSION
                    }
                    countDrop+=grid.putInCell(coordinate, newValue) ? 1 : 0
                }
            }
        }
        
    }
    if (rays.length) {
        raysCounter++
        // change match4 by explosion and put ray
        for (const ray of rays) {
            let countDrop = 0 // to select when drop the gem
            for (const coordinate of ray) {
                const currentCell = grid.getCell(coordinate)
                if (currentCell!=EXPLOSION && !SPECIAL_GEMS_RAY_H.includes(currentCell as string) && !SPECIAL_GEMS_BOMB.includes(currentCell as string) && SPECIAL_GEM_RAINBOW!=currentCell) {
                    let newValue=""
                    if (countDrop==2) {
                        newValue=SPECIAL_GEMS_RAY_H[GEMS.indexOf(currentCell as string)]
                        raysCounter++
                    } else {
                        newValue=EXPLOSION
                    }
                    countDrop+= grid.putInCell(coordinate, newValue) ? 1 : 0
                }
            }
        }
    }
    return bombsCounter+raysCounter+rainbowsCounter
}

const verifyMatch3 = async (grid: Grid): Promise<number> => {
    // Count how many times found a match 3
    let match3Counter: number = 0
    let match3 = FindPatternInGrid.run(grid, new GridPattern([[1,1,1]]))

    if (match3.length) {
        match3Counter++
        // change match3 by explosion
        const exploded: Coordinate[] = []
        for (const m3Coords of match3) {
            for (const coordinate of m3Coords) {
                const currentCell = grid.getCell(coordinate)
                if (currentCell!=EXPLOSION) {
                    if (grid.putInCell(coordinate, EXPLOSION)) {
                        exploded.push(coordinate)
                    }
                }
            }
        }
    }
    return match3Counter
}

const verifyPosibleMatches = (grid: Grid) =>{
    let posibleMatches: any = []
    for (const patern of PATTERNS) {
        const pattern = new GridPattern(patern);
        posibleMatches = posibleMatches.concat(FindPatternInGrid.run(grid, pattern))
    }
    return posibleMatches
}

const action = async (fromX:number|null=null, fromY:number|null=null, toX:number|null=null, toY:number|null=null) => {
    sleep(SLEEP_SECONDS)
    let validSwap = true
    if (fromX && fromY && toX && toY) {
        // recalculated coordinates for rotated grid
        const coordinateFrom = new Coordinate(fromY, grid.getColumnLimit() - fromX - 1)
        const coordinateTo = new Coordinate(toY, grid.getColumnLimit() - toX - 1)
        validSwap = grid.swap(coordinateFrom, coordinateTo)
    }

    if (validSwap) {
        showTitle('After Movement Matrix')
        await showRotated(grid.getMatrix() as MatrixToShow)

        // verify special gems generation
        let specialGemsCreated = await verifySpecialGemsGeneration(grid)
        // verify match 3
        let match3Counter = await verifyMatch3(grid)

        const rightMovement = !!(match3Counter+specialGemsCreated) // if generated gems or match3 found it's right movement
        do {
            await explodeRemoveFill(grid)
            // verify special gems generation
            specialGemsCreated = await verifySpecialGemsGeneration(grid)
            // verify match 3
            match3Counter = await verifyMatch3(grid)   
        } while (specialGemsCreated+match3Counter)

        if (fromX && fromY && toX && toY && !rightMovement) {
            // reverse swap
            const coordinateFrom = new Coordinate(fromY, grid.getColumnLimit() - fromX - 1)
            const coordinateTo = new Coordinate(toY, grid.getColumnLimit() - toX - 1)
            grid.swap(coordinateFrom, coordinateTo)
        }
    }    
    // verify posible matches
    const posibleMatches = verifyPosibleMatches(grid)

    console.log('Posible Matches')
    console.log(posibleMatches)
    showTitle('Final Matrix')
    await showRotated(grid.getMatrix() as MatrixToShow)
}


const question = (query: string) => {
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
