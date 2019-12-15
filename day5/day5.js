const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input", "utf8").split(',').map(x => +x);

function compute(i, prog, input) {
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
                prog[prog[i + 1]] = input;
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

function exec(noun, verb, program, input) {
    program[1] = noun;
    program[2] = verb;
    for (let i = 0; i < program.length;) {
        x = compute(i, program, input);
        if (x != 0) {
            i += x;
        } else {
            break
        }
    }
    return program[0]
}

exec(input[1], input[2], input, 5);