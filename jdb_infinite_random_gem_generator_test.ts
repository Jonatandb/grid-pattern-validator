
const GEMS: string[] = ["🍌","🍎","🍏","🍇","🍑","🍉","🥝","🍋"]

class GeneratorJDB {
  private gems: string[] = []

  constructor() {
    for (let i = 0; i < 6; i++) {
      const id = Math.floor(Math.random() * GEMS.length)
      this.gems.push(GEMS[id])
    }
  }

  elementsToFill(amount: number) {
    const extracted = this.gems.splice(0, amount)
    this.gems.push(...extracted)
    return extracted
  }

  showGems() {
    console.log('GeneratorJDB - Gems:', JSON.stringify(this.gems));
  }
}

const generator = new GeneratorJDB()

generator.showGems()
console.log('Requested 2 gems: ->', JSON.stringify(generator.elementsToFill(2)))
generator.showGems()
console.log('Requested 2 gems: ->', JSON.stringify(generator.elementsToFill(2)))
generator.showGems()
console.log('Requested 2 gems: ->', JSON.stringify(generator.elementsToFill(2)))
generator.showGems()
console.log('Requested 4 gems: ->', JSON.stringify(generator.elementsToFill(4)))
generator.showGems()

