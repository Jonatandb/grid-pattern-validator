import { GEMS, GEMS_TO_FILL } from "./Constants"
class Generator {
    grid(limitRow: number, limitColumns: number) {    
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

    elementsToFill(amount: number) {
        const list: string[] = []
        for (let row = 0; row < amount; row++) {
                const id = Math.floor(Math.random() * GEMS_TO_FILL.length)
                list.push(GEMS_TO_FILL[id])
        }
        return list
    }
}

const generator = new Generator()
export default generator