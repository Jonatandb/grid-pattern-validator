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

export const showPattern = (matrix: any) => {
    matrix.forEach((element: any) => {
        console.log(element)
    });
}