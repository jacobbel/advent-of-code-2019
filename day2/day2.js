const fs = require("fs");

function compute(i, prog) {
    code = prog[i];
    switch (code) {
        case 99:
            return 0;
        case 1:
            // add
            prog[prog[i + 3]] = prog[prog[i + 1]] + prog[prog[i + 2]];
            return 4;
        case 2:
            // times
            prog[prog[i + 3]] = prog[prog[i + 1]] * prog[prog[i + 2]];
            return 4;
        default:
            return
    }
}


function main() {

    let program = []

    const input = fs.readFileSync(__dirname + "/input", "utf8");
    program = input.split(",").map(Number);
    findRes(program);
}

function exec(noun, verb, program) {
    program[1] = noun;
    program[2] = verb;
    for (let i = 0; i < program.length;) {
        x = compute(i, program);
        if (x != 0) {
            i += x;
        } else {
            break
        }
    }
    return program[0]
}

function findRes(program) {
    const target = 19690720;
    for (let noun = 0; noun <= 99; noun++) {
        for (let verb = 0; verb <= 99; verb++) {
            const test = exec(noun, verb, program.slice());
            if (test === target) {
                console.log("ans is", noun, verb);
                console.log("res is", 100 * noun + verb);
                return;
            }

        }
    }
}

main();