import readline from "readline";

require('events').EventEmitter.prototype._maxListeners = 100;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string) => {
    rl.on("close", function() {
        console.log("\nAdiós!");
        process.exit(0);
    });
    return new Promise(resolve => rl.question(query, answer => resolve(answer)))
}

const start = async () => {
    let inputValue: any = []
    const msg = "Introducir coordenadas en el formato => xy-xy, o end: "
    inputValue = await question(msg)
    while (inputValue!='end') {
        console.log('\nIntroducido:\t', inputValue)
        const positions = inputValue.toString().split('-')
        if (positions.length== 2) {
            let positionfrom: any = positions[0].split('')
            let positionTo: any = positions[1].split('')
            console.log('Procesado:\t', positionfrom[0], positionfrom[1], positionTo[0], positionTo[1], '\n')
        } else {
            console.log('Ingreso en formato incorrecto!\n')
        }
        inputValue = await question(msg)
    }
    rl.close();
}

start()