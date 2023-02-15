//let fichas = ['1', '2', '3', '4', '5', '6']
//let fichas = ['A', 'B', 'C', 'D', 'E', 'F']
//let fichas = ['💛', '🌲', '🌎', '🪐', '🚽', '🌈']
let fichas = ['💛', '🌲', '🌎', '🪐', '🚽', '🌈', '🍎', '💚', '🟣', '💋']

/* Tablero de prueba
      [ [1  , 2  , 1  , 5  , 2  ],
        [5  , 3  , 1  , 2  , 4  ],
        [1  , 1  , 4  , 4  , 2  ] ],
*/

const getFicha = () => fichas[Math.floor(Math.random(fichas.length) * fichas.length)]

// Verificación de getFicha:
// let results = { total: 0 }
// for (let i = 0; i < 1000; i++) {
//   let tmp = getFicha()
//   results.total++
//   if(results[tmp]) {
//     results[tmp]++
//   } else {
//     results[tmp] = 1
//   }
// }
// console.log(JSON.stringify(results))
// // {
// //   "total":1000,
// //   "A":185,
// //   "B":169,
// //   "C":162,
// //   "D":140,
// //   "E":164,
// //   "F":180
// // }

const cantFilas = 10
const cantCols = 8
const matriz = []   // cantFilas x cantCols   →

for(let fila=0; fila < cantFilas; fila++) {
  matriz[fila] = []
  for(let col=0; col < cantCols; col++) {
    let piezaActual = getFicha()

    // Evitando 3 piezas verticales iguales:
    // Si se está creando la tercer fila (o alguna posterior)
    // verificar si la pieza actual es igual a la dos de abajo
    // y si es así, reemplazar por otra:
    if(fila > 1) {
      while(piezaActual == matriz[fila-1][col] && piezaActual == matriz[fila-2][col]) {
        let piezaAnterior = piezaActual
        piezaActual = getFicha()
        console.log(`Fila: ${fila+1}, Columna: ${col+1} \t=>\t Se iba a insertar: ${piezaAnterior}, se reemplazó por: ${piezaActual}`);
      }
    }

    matriz[fila][col] = piezaActual

  }
}
console.log("");

let linea = ""
for(let col=0; col < cantCols; col++) {
  linea = linea + `\t${col == 0 ? '\t': ''}` + (col+1)
}
console.log(linea); // 0	1	2	3	4	5	6	7

// linea = ""
// for(let fila=0; fila < filas; fila++) {
//   linea = ''
//   for(let col=0; col < cantCols; col++) {
//     linea = linea + (col == 0 ? `\t${fila}) `: '\t') + matriz3x5[fila][col];
//   }
//   console.log(linea);
// }

linea = ''
for (let fila = cantFilas-1; fila >= 0; fila--) {
  linea = ''
  for (let col = 0; col < cantCols; col++) {
    linea = linea + (col == 0 ? `\t${fila+1}\t` : '\t') + matriz[fila][col]
  }
  console.log(linea)
}