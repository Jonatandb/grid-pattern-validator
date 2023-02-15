//let fichas = ['1', '2', '3', '4', '5', '6']
//let fichas = ['A', 'B', 'C', 'D', 'E', 'F']
//let fichas = ['💛', '🌲', '🌎', '🪐', '🚽', '🌈']
let fichas = ['💛', '🌲', '🌎', '🪐', '🚽', '🌈', '🍎', '💚', '🟣', '💋']

const getFicha = () => fichas[Math.floor(Math.random(fichas.length) * fichas.length)]

const cantFilas = 10
const cantCols = 8
const matriz = []   // cantCols x cantFilas   ↓

function generarColumna(altura=cantFilas, nroColumna=1) {
  const columna = []
  for(let fila=0; fila < altura; fila++) {
    let piezaActual = getFicha()

    // Evitando 3 piezas verticales iguales:
    if (fila > 1) {
      while (piezaActual == columna[fila - 1] && piezaActual == columna[fila - 2]) {
        let piezaAnterior = piezaActual
        piezaActual = getFicha()
        console.log(`Fila: ${fila + 1}, Columna: ${nroColumna} \t=>\t Se iba a insertar: ${piezaAnterior}, se reemplazó por: ${piezaActual}`)
      }
    }

    columna[fila] = piezaActual
  }
  return columna
}

for(let columna=0; columna < cantCols; columna++) {
  matriz[columna] = generarColumna(altura=cantFilas, nroColumna=columna+1)
}

console.log("");

let linea = ""
for (let col = 0; col < cantCols; col++) {
  linea = linea + `\t${col == 0 ? '\t' : ''}` + (col + 1)
}
console.log("Matriz traspuesta:\n", linea); // Cabeceras de columnas:  0  1 2	3	4	5	6	7

/*Matriz original:                  3 x 6             Matriz traspuesta:   6 x 3
  [ ['A', 'B', 'C', 'D', 'E', 'F'],                   [ ['F', 'F', 'F'],
    ['A', 'B', 'C', 'D', 'E', 'F'],                     ['E', 'E', 'E'],
    ['A', 'B', 'C', 'D', 'E', 'F'] ]                    ['D', 'D', 'D'],
                                                        ['C', 'C', 'C'],
                                                        ['B', 'B', 'B'],
                                                        ['A', 'A', 'A'] ]     */

// La muestro traspuesta:
linea = ''
for (let fila = cantFilas-1; fila >= 0; fila--) {
  linea = ''
  for (let col = 0; col < cantCols; col++) {
    linea = linea + (col == 0 ? `\t${fila + 1}\t` : '\t') + matriz[col][fila]
  }
  console.log(linea)
}

console.log('\nMatriz original:\nColumna:')
// Muestro la matriz original:
for (let fila = 0; fila < cantCols; fila++) {
  linea = ''
  for (let col = 0; col < cantFilas; col++) {
    linea = linea + (col == 0 ? `\t${fila + 1}\t` : '\t') + matriz[fila][col]
  }
  console.log(linea)
}


/** Creo la traspuesta:
let traspuesta = [];
for (let i = 0; i < cantFilas; i++) {
    let fila = [];
    for (let j = 0; j < cantCols; j++) {
        fila.push(matriz[j][i]);
    }
    traspuesta.push(fila);
}
console.log('');

for (let fila = cantFilas-1; fila >= 0; fila--) {
  linea = ''
  for (let col = 0; col < cantCols; col++) {
    linea = linea + (col == 0 ? `\t${fila + 1}\t` : '\t') + traspuesta[fila][col]
  }
  console.log(linea);
}
 */