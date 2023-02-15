import Grid from "../Grid";
import { GEMS_TO_FILL, SLEEP_SECONDS } from "./Constants";

export const sleep =  async (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds*1000));

// Cosmetic function -- begin
export const showTitle = (message: string) => {
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
    console.log(message+'\n\n')
}

export const showRotated = async (grid: string[][], _empty: boolean|null= null) => {
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
    let toShow: string= ""
    for (const row of newGrid.getMatrix()) {
        // _empty is just to show empty cells
        toShow+= c+ ""
        for (const cell of row) {
            toShow+="   "+ (_empty && GEMS_TO_FILL.includes(cell as string) ? "  " : cell)
        }
        toShow+="\n\n"
        c++
    }
    console.log(toShow)
    await sleep(SLEEP_SECONDS)
}

export const showPattern = (matrix: any) => {
    matrix.forEach((element: any) => {
        console.log(element)
    });
}