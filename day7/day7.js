const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input", "utf8").split(',').map(x => +x);

class IntMachine {

    inputQueue;
    outputQueue;
    memory;
    instructionPointer
    state

    IntMachine(program) {
        instructionPointer = 0;
        outputQueue = [];
        inputQueue = [];
        this.memory = program;
        this.state = "stopped"
    }

    // execute program in memory
    run() {
        this.state = "running";
        while (instructionPointer !== this.memory.length) {
            let instruction = memory[i].toString();
            const op = parseInt(instruction.slice(-2));
            switch (op) {
                case 99:
                    { 
                        this.state = "stopped";
                        this.instructionPointer += 1;
                        return this.state;
                    }
                case 1:
                    {
                        // add
                        const pad = 5 - instruction.length;
                        instruction = '0'.repeat(pad) + instruction;
                        // example: 01002
                        const p1 = +instruction[2] ? this.memory[i + 1] : this.memory[this.memory[i + 1]];
                        const p2 = +instruction[1] ? this.memory[i + 2] : this.memory[this.memory[i + 2]];
                        const r1 = +instruction[0] ? i + 3 : this.memory[i + 3];
                        this.memory[r1] = p1 + p2;
                        this.instructionPointer += 4;
                        break;
                    }
                case 2:
                    {
                        // multiply
                        const pad = 5 - instruction.length;
                        instruction = '0'.repeat(pad) + instruction;
                        // example: 01002
                        const p1 = +instruction[2] ? this.memory[i + 1] : this.memory[this.memory[i + 1]];
                        const p2 = +instruction[1] ? this.memory[i + 2] : this.memory[this.memory[i + 2]];
                        const r1 = +instruction[0] ? i + 3 : this.memory[i + 3];
                        this.memory[r1] = p1 * p2;
                        this.instructionPointer += 4;
                        break;
                    }
                case 3:
                    {
                        // input
                        if (!this.inputQueue.length) {
                            state = "paused"
                            return this.state;
                        }
                        this.memory[this.memory[i + 1]] = this.inputQueue.shift();
                        this.instructionPointer += 2
                    }
                case 4:
                    {
                        // output
                        const pad = 3 - instruction.length
                        instruction = '0'.repeat(pad) + instruction;
                        // example 104
                        const p1 = +instruction[0] ? this.memory[i + 1] : this.memory[this.memory[i + 1]];
                        console.log("output is", p1);
                        this.outputQueue.push(p1);
                        this.instructionPointer += 2
                    }
                case 5:
                    {
                        // jump if true
                        const pad = 5 - instruction.length;
                        instruction = '0'.repeat(pad) + instruction;
                        // example: 1005
                        const p1 = +instruction[2] ? this.memory[i + 1] : this.memory[this.memory[i + 1]];
                        const p2 = +instruction[1] ? this.memory[i + 2] : this.memory[this.memory[i + 2]];
                        ret = p1 ? p2 - i : 3;
                        this.instructionPointer += ret;

                    }
                case 6:
                    {
                        // jump if false
                        const pad = 5 - instruction.length;
                        instruction = '0'.repeat(pad) + instruction;
                        // example: 1006
                        const p1 = +instruction[2] ? this.memory[i + 1] : this.memory[this.memory[i + 1]];
                        const p2 = +instruction[1] ? this.memory[i + 2] : this.memory[this.memory[i + 2]];
                        ret = !p1 ? p2 - i : 3;
                        this.instructionPointer += ret;

                    }
                case 7:
                    {
                        // less than
                        const pad = 5 - instruction.length;
                        instruction = '0'.repeat(pad) + instruction;
                        // example: 01007
                        const p1 = +instruction[2] ? this.memory[i + 1] : this.memory[this.memory[i + 1]];
                        const p2 = +instruction[1] ? this.memory[i + 2] : this.memory[this.memory[i + 2]];
                        const r1 = +instruction[0] ? i + 3 : this.memory[i + 3];
                        this.memory[r1] = p1 < p2;
                        this.instructionPointer += 4;
                    }

                case 8:
                    // equal to
                    const pad = 5 - instruction.length;
                    instruction = '0'.repeat(pad) + instruction;
                    // example: 01008
                    const p1 = +instruction[2] ? this.memory[i + 1] : this.memory[this.memory[i + 1]];
                    const p2 = +instruction[1] ? this.memory[i + 2] : this.memory[this.memory[i + 2]];
                    const r1 = +instruction[0] ? i + 3 : this.memory[i + 3];
                    this.memory[r1] = p1 === p2;
                    this.instructionPointer += 4;
                default:
                    console.log("illegal code")
                    this.state = "corrupt";
                    return this.state
            }
        }
    }


}

function compute(i, prog, input, output) {
    let instruction = prog[i].toString();
    const op = parseInt(instruction.slice(-2));
    switch (op) {
        case 99:
            { return 0; }
        case 1:
            {
                // add
                const pad = 5 - instruction.length;
                instruction = '0'.repeat(pad) + instruction;
                // example: 01002
                const p1 = +instruction[2] ? prog[i + 1] : prog[prog[i + 1]];
                const p2 = +instruction[1] ? prog[i + 2] : prog[prog[i + 2]];
                const r1 = +instruction[0] ? i + 3 : prog[i + 3];
                prog[r1] = p1 + p2;
                return 4;
            }
        case 2:
            {
                // multiply
                const pad = 5 - instruction.length;
                instruction = '0'.repeat(pad) + instruction;
                // example: 01002
                const p1 = +instruction[2] ? prog[i + 1] : prog[prog[i + 1]];
                const p2 = +instruction[1] ? prog[i + 2] : prog[prog[i + 2]];
                const r1 = +instruction[0] ? i + 3 : prog[i + 3];
                prog[r1] = p1 * p2;
                return 4;
            }
        case 3:
            {
                // mov
                prog[prog[i + 1]] = input.shift();
                return 2
            }
        case 4:
            {
                // output
                const pad = 3 - instruction.length
                instruction = '0'.repeat(pad) + instruction;
                // example 104
                const p1 = +instruction[0] ? prog[i + 1] : prog[prog[i + 1]];
                console.log("output is", p1);
                output.output = p1;
                return 2
            }
        case 5:
            {
                // jump if true
                const pad = 5 - instruction.length;
                instruction = '0'.repeat(pad) + instruction;
                // example: 1005
                const p1 = +instruction[2] ? prog[i + 1] : prog[prog[i + 1]];
                const p2 = +instruction[1] ? prog[i + 2] : prog[prog[i + 2]];
                ret = p1 ? p2 - i : 3;
                return ret;

            }
        case 6:
            {
                // jump if false
                const pad = 5 - instruction.length;
                instruction = '0'.repeat(pad) + instruction;
                // example: 1006
                const p1 = +instruction[2] ? prog[i + 1] : prog[prog[i + 1]];
                const p2 = +instruction[1] ? prog[i + 2] : prog[prog[i + 2]];
                ret = !p1 ? p2 - i : 3;
                return ret;

            }
        case 7:
            {
                // less than
                const pad = 5 - instruction.length;
                instruction = '0'.repeat(pad) + instruction;
                // example: 01007
                const p1 = +instruction[2] ? prog[i + 1] : prog[prog[i + 1]];
                const p2 = +instruction[1] ? prog[i + 2] : prog[prog[i + 2]];
                const r1 = +instruction[0] ? i + 3 : prog[i + 3];
                prog[r1] = p1 < p2;
                return 4;
            }

        case 8:
            // equal to
            const pad = 5 - instruction.length;
            instruction = '0'.repeat(pad) + instruction;
            // example: 01008
            const p1 = +instruction[2] ? prog[i + 1] : prog[prog[i + 1]];
            const p2 = +instruction[1] ? prog[i + 2] : prog[prog[i + 2]];
            const r1 = +instruction[0] ? i + 3 : prog[i + 3];
            prog[r1] = p1 === p2;
            return 4;
        default:
            console.log("illegal code")
            return
    }
}

function exec(program, input) {
    let output = { output: undefined };
    for (let i = 0; i < program.length;) {
        x = compute(i, program, input, output);
        if (x != 0) {
            i += x;
        } else {
            output.halt = true;
            break
        }
    }
    return output.output
}

function permutate(prefix, list, acc) {
    if (list.length === 0) {
        acc.push(prefix);
        return;
    }
    for (let i = 0; i < list.length; i++) {
        let remaining = list.slice(0, i).concat(list.slice(i + 1));
        permutate(prefix.concat(list.slice(i, i + 1)), remaining, acc);
    }
}


function getPermutations(list) {
    let acc = []
    permutate([], list, acc);
    return acc;
}

let phases = [0, 1, 2, 3, 4]

for (let k = 0; k < phases.length; k++) {
    for (let j = 0; j < phases.length; j++) {

    }
}

let allPerms = getPermutations(phases);
let max = 0;
for (let j = 0; j < allPerms.length; j++) {
    let signal = 0;
    let setting = allPerms[j];
    for (let i = 0; i < phases.length; i++) {
        signal = exec(input.slice(), [setting[i], signal]);
    }
    if (signal > max) {
        max = signal;
    }
}

console.log("p1 max:", max);

phases = [5, 6, 7, 8, 9]
allPerms = getPermutations(phases);

let signal = 0;
let halt = false;
let testProg = [3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26,
    27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5];
let testPhases = [9, 8, 7, 6, 5];

let amps = new Array(5).fill(testProg.slice())

for (let i = 0; i < phases.length; i++) {
    signal = exec(amps[i], [testPhases[i], signal]);
}
let i = 0;
while (!halt) {
    signal = exec(amp[i], [signal]);
    i += i % phases.length;
}

console.log("test signal", signal);

// let max = 0;
// for (let j = 0; j < allPerms.length; j++) {
//     let signal = 0;
//     let setting = allPerms[j];
//     for (let i = 0; i < phases.length; i++) {
//         signal = exec(input, [setting[i], signal]);
//     }
//     if (signal > max) {
//         max = signal;
//     }
// }
