import { Coordinate } from "../Coordinate";
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
    // Count how many times a rainbow was found
    let rainbows = FindPatternInGrid.run(grid, new GridPattern(PATTERNS_RAINBOW))
    let rainbowsDict: DictionaryCounter = {}
    // Count how many times a ray was found
    let rays = FindPatternInGrid.run(grid, new GridPattern(PATTERNS_RAY))
    let raysDict: DictionaryCounter = {}
    // Count how many times a bomb was found
    let bombs: Coordinate[][] = []
    for (const patern of PATTERNS_BOMB) {
        const pattern = new GridPattern(patern);
        bombs = bombs.concat(FindPatternInGrid.run(grid, pattern))
    }
    let bombsDict: DictionaryCounter = {}
    // Totalize Dictionary
    let fullDict: DictionaryCounter = {}

    
    const message = (bombs.length ? 'Bomb ' : '')+(rays.length ? 'Ray ' : '')+(rainbows.length ? 'Rainbow ' : '')
    showTitle(message+'Found')
    await showRotated(grid.getMatrix() as MatrixToShow)

    // if rainbow found
    if (rainbows.length) {
        // change match5 by explosion and put ray
        for (const rainbow of rainbows) {
            let countDrop = 0 // to select when drop the gem
            for (const coordinate of rainbow) {
                const currentCell = grid.getCell(coordinate) as string
                if (currentCell!=EXPLOSION && SPECIAL_GEM_RAINBOW!=currentCell) {
                    let newValue=""
                    if (countDrop==2) {
                        newValue=SPECIAL_GEM_RAINBOW
                    } else {
                        newValue=EXPLOSION
                    }
                    rainbowsDict[currentCell] = currentCell in rainbowsDict ? rainbowsDict[currentCell] + 1 : 1
                    fullDict[currentCell] = currentCell in fullDict ? fullDict[currentCell] + 1 : 1
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
                const currentCell = grid.getCell(coordinate) as string
                if (currentCell!=EXPLOSION && !SPECIAL_GEMS_BOMB.includes(currentCell as string) && SPECIAL_GEM_RAINBOW!=currentCell) {
                    let newValue=""
                    if (countDrop==2) {
                        newValue=SPECIAL_GEMS_BOMB[GEMS.indexOf(currentCell as string)]
                    } else {
                        newValue=EXPLOSION
                    }
                    bombsDict[currentCell] = currentCell in bombsDict ? bombsDict[currentCell] + 1 : 1
                    fullDict[currentCell] = currentCell in fullDict ? fullDict[currentCell] + 1 : 1
                    countDrop+=grid.putInCell(coordinate, newValue) ? 1 : 0
                }
            }
        }        
    }
    if (rays.length) {
        // change match4 by explosion and put ray
        for (const ray of rays) {
            let countDrop = 0 // to select when drop the gem
            for (const coordinate of ray) {
                const currentCell = grid.getCell(coordinate) as string
                if (currentCell!=EXPLOSION && !SPECIAL_GEMS_RAY_H.includes(currentCell as string) && !SPECIAL_GEMS_BOMB.includes(currentCell as string) && SPECIAL_GEM_RAINBOW!=currentCell) {
                    let newValue=""
                    if (countDrop==2) {
                        newValue=SPECIAL_GEMS_RAY_H[GEMS.indexOf(currentCell as string)]
                    } else {
                        newValue=EXPLOSION
                    }
                    raysDict[currentCell] = currentCell in raysDict ? raysDict[currentCell] + 1 : 1
                    fullDict[currentCell] = currentCell in fullDict ? fullDict[currentCell] + 1 : 1
                    countDrop+= grid.putInCell(coordinate, newValue) ? 1 : 0
                }
            }
        }
    }

    return fullDict
}

type DictionaryCounter = { [index: string]: number }

const verifyMatch3 = async (grid: Grid): Promise<DictionaryCounter> => {
    // Count how many times found a match 3
    let match3 = FindPatternInGrid.run(grid, new GridPattern([[1,1,1]]))
    let match3Dict: DictionaryCounter = {}

    if (match3.length) {
        // change match3 by explosion
        const exploded: Coordinate[] = []
        for (const m3Coords of match3) {
            for (const coordinate of m3Coords) {
                const currentCell = grid.getCell(coordinate) as string
                if (currentCell!=EXPLOSION) {
                    if (grid.putInCell(coordinate, EXPLOSION)) {
                        exploded.push(coordinate)
                        match3Dict[currentCell] = currentCell in match3Dict ? match3Dict[currentCell] + 1 : 1
                    }
                }
            }
        }
    }
    return match3Dict
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
        let specialGemsDict = await verifySpecialGemsGeneration(grid)
        let specialGemsCreated = Object.values(specialGemsDict).length==0 ? 0 : Object.values(specialGemsDict).reduce((accumulator, current) => accumulator + current);
        // verify match 3
        let match3DictCounter = await verifyMatch3(grid)
        let match3Counter = Object.values(match3DictCounter).length==0 ? 0 : Object.values(match3DictCounter).reduce((accumulator, current) => accumulator + current);

        const rightMovement = !!(match3Counter+specialGemsCreated) // if generated gems or match3 found it's right movement
        do {
            await explodeRemoveFill(grid)
            // verify special gems generation
            specialGemsDict = await verifySpecialGemsGeneration(grid)
            specialGemsCreated = Object.values(specialGemsDict).length==0 ? 0 : Object.values(specialGemsDict).reduce((accumulator, current) => accumulator + current);
            // verify match 3
            match3DictCounter = await verifyMatch3(grid)
            match3Counter = Object.values(match3DictCounter).length==0 ? 0 : Object.values(match3DictCounter).reduce((accumulator, current) => accumulator + current);
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
