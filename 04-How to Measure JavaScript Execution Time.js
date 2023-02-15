// How to Measure JavaScript Execution Time:
// https://dev.to/saranshk/how-to-measure-javascript-execution-time-5h2

const start = Date.now()
console.log(`Execution time: ${Date.now() - start} ms`)
//Execution time Date.now(): 1 ms


console.time('Execution time') // start
console.timeEnd('Execution time') // end
//Execution time console.time(): 2.886962890625 ms
//Execution time console.time(): 2.989ms

const start = performance.now() // start
console.log(`Execution time: ${performance.now() - start} ms`) // end
//Execution time performance.now(): 3.227399999741465 ms
