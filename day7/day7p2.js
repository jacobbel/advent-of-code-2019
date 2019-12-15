const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input", "utf8").split(',').map(x => +x);

class IntMachine {

    inputQueue;
    outputQueue;
    memory;
    instructionPointer
    state

    constructor(program) {
        this.instructionPointer = 0;
        this.outputQueue = [];
        this.inputQueue = [];
        this.memory = program;
        this.state = "stopped"
    }

    queueInput(input) {
        this.inputQueue.push(input);
    }

    readOutput() {
        return this.outputQueue.shift();
    }

    // execute program in memory
    run() {
        this.state = "running";
        while (this.instructionPointer !== this.memory.length) {
            let instruction = this.memory[this.instructionPointer].toString();
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
                        const p1 = +instruction[2] ? this.memory[this.instructionPointer + 1] : this.memory[this.memory[this.instructionPointer + 1]];
                        const p2 = +instruction[1] ? this.memory[this.instructionPointer + 2] : this.memory[this.memory[this.instructionPointer + 2]];
                        const r1 = +instruction[0] ? this.instructionPointer + 3 : this.memory[this.instructionPointer + 3];
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
                        const p1 = +instruction[2] ? this.memory[this.instructionPointer + 1] : this.memory[this.memory[this.instructionPointer + 1]];
                        const p2 = +instruction[1] ? this.memory[this.instructionPointer + 2] : this.memory[this.memory[this.instructionPointer + 2]];
                        const r1 = +instruction[0] ? this.instructionPointer + 3 : this.memory[this.instructionPointer + 3];
                        this.memory[r1] = p1 * p2;
                        this.instructionPointer += 4;
                        break;
                    }
                case 3:
                    {
                        // input
                        if (!this.inputQueue.length) {
                            this.state = "paused"
                            return this.state;
                        }
                        const d = this.memory[this.instructionPointer + 1];
                        this.memory[d] = this.inputQueue.shift();
                        this.instructionPointer += 2
                        break;
                    }
                case 4:
                    {
                        // output
                        const pad = 3 - instruction.length
                        instruction = '0'.repeat(pad) + instruction;
                        // example 104
                        const p1 = +instruction[0] ? this.memory[this.instructionPointer + 1] : this.memory[this.memory[this.instructionPointer + 1]];
                        this.outputQueue.push(p1);
                        this.instructionPointer += 2
                        this.state = "stopped";
                        break;
                    }
                case 5:
                    {
                        // jump if true
                        const pad = 5 - instruction.length;
                        instruction = '0'.repeat(pad) + instruction;
                        // example: 1005
                        const p1 = +instruction[2] ? this.memory[this.instructionPointer + 1] : this.memory[this.memory[this.instructionPointer + 1]];
                        const p2 = +instruction[1] ? this.memory[this.instructionPointer + 2] : this.memory[this.memory[this.instructionPointer + 2]];
                        const ret = p1 ? p2 - this.instructionPointer : 3;
                        this.instructionPointer += ret;
                        break;
                    }
                case 6:
                    {
                        // jump if false
                        const pad = 5 - instruction.length;
                        instruction = '0'.repeat(pad) + instruction;
                        // example: 1006
                        const p1 = +instruction[2] ? this.memory[this.instructionPointer + 1] : this.memory[this.memory[this.instructionPointer + 1]];
                        const p2 = +instruction[1] ? this.memory[this.instructionPointer + 2] : this.memory[this.memory[this.instructionPointer + 2]];
                        const ret = !p1 ? p2 - this.instructionPointer : 3;
                        this.instructionPointer += ret;
                        break;
                    }
                case 7:
                    {
                        // less than
                        const pad = 5 - instruction.length;
                        instruction = '0'.repeat(pad) + instruction;
                        // example: 01007
                        const p1 = +instruction[2] ? this.memory[this.instructionPointer + 1] : this.memory[this.memory[this.instructionPointer + 1]];
                        const p2 = +instruction[1] ? this.memory[this.instructionPointer + 2] : this.memory[this.memory[this.instructionPointer + 2]];
                        const r1 = +instruction[0] ? this.instructionPointer + 3 : this.memory[this.instructionPointer + 3];
                        this.memory[r1] = p1 < p2;
                        this.instructionPointer += 4;
                        break;
                    }

                case 8:
                    // equal to
                    const pad = 5 - instruction.length;
                    instruction = '0'.repeat(pad) + instruction;
                    // example: 01008
                    const p1 = +instruction[2] ? this.memory[this.instructionPointer + 1] : this.memory[this.memory[this.instructionPointer + 1]];
                    const p2 = +instruction[1] ? this.memory[this.instructionPointer + 2] : this.memory[this.memory[this.instructionPointer + 2]];
                    const r1 = +instruction[0] ? this.instructionPointer + 3 : this.memory[this.instructionPointer + 3];
                    this.memory[r1] = p1 === p2;
                    this.instructionPointer += 4;
                    break;
                default:
                    console.log("illegal code")
                    this.state = "corrupt";
                    return this.state
            }
        }
    }
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


let testPhases = [4, 3, 2, 1, 0];
let testProg = [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0];

let testMachines = testPhases.map(_ => (new IntMachine(testProg.slice())));

let signal = 0;
for (let i = 0; i < testPhases.length; i++) {
    let machine = testMachines[i];
    machine.queueInput(testPhases[i]);
    machine.queueInput(signal);
    let state = machine.run();
    signal = machine.readOutput();
}
console.log("signal is:", signal);

testProg = [3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5, 55, 1005, 55, 26, 1001, 54,
    -5, 54, 1105, 1, 12, 1, 53, 54, 53, 1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4,
    53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10]


let phases = [9, 7, 8, 5, 6]

let allPhases = getPermutations(phases);

let max = 0;

for (let z = 0; z < allPhases.length; z++) {
    let amps = phases.map(_ => (new IntMachine(input.slice())));
    signal = 0;
    let i = 0
    for (i; i < phases.length; i++) {
        let machine = amps[i];
        machine.queueInput(allPhases[z][i]);
        machine.queueInput(signal);
        machine.run();
        signal = machine.readOutput();
    }
    while (amps[4].state !== "stopped") {
        i = i % phases.length;
        let machine = amps[i];
        machine.queueInput(signal);
        machine.run();
        signal = machine.readOutput();
        i++;
    }
    if (signal > max) {
        max = signal;
    }
}

console.log("The max signal is:", max, "!");



// console.log("feedback signal is", signal);
