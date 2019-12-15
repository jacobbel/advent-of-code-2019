const fs = require("fs");
const readline = require("readline");

/**
 *  Part 1
 *  Fuel required to launch a module: mass divided by 3, rounded down and subtract 2
 *  Part 2 
 *  Account for the mass of fuel
 *  negative fuel can be counted as zero mass.
 */

/**
 * @param {number} mass The mass of the module 
 * @returns {number} The fuel required for module
 */
function calculateFuel(mass) {
    return Math.floor(mass / 3) - 2;
}

/**
 * @param {number} mass 
 */
function calculateFuelRequired(mass) {
    const fuel = calculateFuel(mass);
    return fuel > 0 ? fuel + calculateFuelRequired(fuel) : 0;
}


function main() {
    let fuel1 = 0;
    let fuel2 = 0;

    let lineReader = readline.createInterface({
        input: fs.createReadStream(__dirname + "/input")
    });

    lineReader.on("line", line => {
        fuel1 += calculateFuel(parseFloat(line));
        fuel2 += calculateFuelRequired(parseFloat(line));
    });

    lineReader.on("close", () => {
        console.log("Fuel required part 1:", fuel1);
        console.log("Fuel required part 2:", fuel2);
    });

}

main();