class IntMachine {

    count;
    inputQueue;
    outputQueue;
    memory;
    instructionPointer;
    state;
    relativeBase;

    constructor(program) {
        this.instructionPointer = 0;
        this.outputQueue = [];
        this.inputQueue = [];
        this.memory = program;
        this.state = "ready"
        this.relativeBase = 0;
        this.count = 0;
    }

    queueInput(input) {
        this.inputQueue.push(input);
    }

    readOutput() {
        return this.outputQueue.shift();
    }

    readMemory(pointer) {
        const val = this.memory[pointer];
        return val ? val : 0;
    }

    writeValue(mode, address, value) {
        switch (mode) {
            case 0: {
                this.memory[this.memory[address]] = value;
                break;
            }
            case 1: {
                // should never happen
                console.error("writing in immediate mode");
                this.memory[address] = value;
                break;
            }
            case 2: {
                this.memory[this.memory[address] + this.relativeBase] = value;
                break;
            }
        }
    }

    getParameter(mode, value) {
        if (value === undefined) {
            value = 0;
        }
        let p;
        switch (mode) {
            case 0: {
                p = this.readMemory(value);
                break;
            }
            case 1: {
                p = value;
                break;
            }
            case 2: {
                p = this.readMemory(value + this.relativeBase);
                break;
            }
        }
        if (p === undefined) {
            return 0;
        }
        return p;
    }

    // execute program in memory
    run() {
        this.count++;
        this.state = "running";
        while (this.state === "running") {
            let instruction = this.readMemory(this.instructionPointer).toString();
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
                        const p1 = this.getParameter(+instruction[2], this.readMemory(this.instructionPointer + 1));
                        const p2 = this.getParameter(+instruction[1], this.readMemory(this.instructionPointer + 2));
                        this.writeValue(+instruction[0], this.instructionPointer + 3, p1 + p2);
                        this.instructionPointer += 4;
                        break;
                    }
                case 2:
                    {
                        // multiply
                        const pad = 5 - instruction.length;
                        instruction = '0'.repeat(pad) + instruction;
                        // example: 01002
                        const p1 = this.getParameter(+instruction[2], this.readMemory(this.instructionPointer + 1));
                        const p2 = this.getParameter(+instruction[1], this.readMemory(this.instructionPointer + 2));
                        this.writeValue(+instruction[0], this.instructionPointer + 3, p1 * p2);
                        this.instructionPointer += 4;
                        break;
                    }
                case 3:
                    {
                        const pad = 3 - instruction.length
                        instruction = '0'.repeat(pad) + instruction;
                        // input
                        if (!this.inputQueue.length) {
                            this.state = "paused"
                            return this.state;
                        }
                        let p1 = this.inputQueue.shift();
                        this.writeValue(+instruction[0], this.instructionPointer + 1, p1);
                        this.instructionPointer += 2
                        break;
                    }
                case 4:
                    {
                        // output
                        const pad = 3 - instruction.length
                        instruction = '0'.repeat(pad) + instruction;
                        // example 104
                        const p1 = this.getParameter(+instruction[0], this.readMemory(this.instructionPointer + 1))
                        this.outputQueue.push(p1);
                        this.instructionPointer += 2
                        break;
                    }
                case 5:
                    {
                        // jump if true
                        const pad = 5 - instruction.length;
                        instruction = '0'.repeat(pad) + instruction;
                        // example: 1005
                        const p1 = this.getParameter(+instruction[2], this.readMemory(this.instructionPointer + 1));
                        const p2 = this.getParameter(+instruction[1], this.readMemory(this.instructionPointer + 2));
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
                        const p1 = this.getParameter(+instruction[2], this.readMemory(this.instructionPointer + 1));
                        const p2 = this.getParameter(+instruction[1], this.readMemory(this.instructionPointer + 2));
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
                        const p1 = this.getParameter(+instruction[2], this.readMemory(this.instructionPointer + 1));
                        const p2 = this.getParameter(+instruction[1], this.readMemory(this.instructionPointer + 2));
                        this.writeValue(+instruction[0], this.instructionPointer + 3,  +(p1 < p2));
                        this.instructionPointer += 4;
                        break;
                    }

                case 8:
                    {
                        // equal to
                        const pad = 5 - instruction.length;
                        instruction = '0'.repeat(pad) + instruction;
                        // example: 01008
                        const p1 = this.getParameter(+instruction[2], this.readMemory(this.instructionPointer + 1));
                        const p2 = this.getParameter(+instruction[1], this.readMemory(this.instructionPointer + 2));
                        this.writeValue(+instruction[0], this.instructionPointer + 3, +(p1 === p2));
                        this.instructionPointer += 4;
                        break;
                    }
                case 9:
                    {
                        // add relativeBase
                        const pad = 3 - instruction.length
                        instruction = '0'.repeat(pad) + instruction;
                        // example 109
                        const p1 = this.getParameter(+instruction[0], this.readMemory(this.instructionPointer + 1));
                        this.relativeBase += p1;
                        this.instructionPointer += 2;
                        break;
                    }
                default:
                    console.log("illegal code")
                    this.state = "corrupt";
                    return this.state
            }
        }
    }
}

module.exports = IntMachine;