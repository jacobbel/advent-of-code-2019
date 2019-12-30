const fs = require("fs");

let input = fs.readFileSync(__dirname + "/input", "utf8").repeat(1).split("").map(x => +x);

const phases = 100;

function fft(input, phases) {
    let output;
    for (let i = 0; i < phases; ++i) {
        output = [];
        for (let j = 0; j < input.length; ++j) {
            let z = 0;
            let val = 0;
            let sign = 1;
            z += j;
            while (z < input.length) {
                for (let y = 0; y < j + 1 && z + y < input.length; ++y) {
                    val += sign * input[z + y];
                }
                sign *= -1;
                z += (j + 1) * 2;
            }
            output.push(Math.abs(val % 10));
        }
        input = output;
    }
    return output.slice(0, 8).join("");
}

const p1 = fft(input, phases);

console.log("Part one answer:", p1);

let input2 = fs.readFileSync(__dirname + "/input", "utf8").repeat(10000).split("").map(x => +x);
const offset = +input2.slice(0, 7).join("");

function fastFFT(input, phases, offset) {
    let output;
    const len = input.length - offset;
    for (let i = 0; i < phases; ++i) {
        output = [];
        let sum = 0;
        for (let j = 0; j < len; ++j) {
            const idx = input.length - j - 1;
            sum += input[idx];
            output.push(sum % 10);
        }
        input = output.reverse();
    }
    return output.slice(0, 8).join("");
}

const p2 = fastFFT(input2, phases, offset);

console.log("Part 2 answer:", p2);