const fs = require('fs');
const IntMachine = require('../IntMachine');

const input = fs.readFileSync(__dirname + "/input", "utf8").split(",").map(x => +x);

const N = 50;
const computers = [];
let running = true;
let p1 = false;


let nat;
let idle = true;

for (let i = 0; i < N; ++i) {
    const machine = new IntMachine(input.slice());
    machine.queueInput(i);
    computers.push({ machine, queue: [] });
    machine.on("output", (() => {
        const queue = []
        return (val) => {
            queue.push(val);
            if (queue.length === 3) {
                const addr = queue.shift();
                if (addr === 255) {
                    const packet = [queue.shift(), queue.shift()];
                    if (!p1) {
                        console.log("Part 1", packet[1]);
                        p1 = true;
                    }
                    nat = packet;
                    return;
                }
                computers[addr].machine.queueInput(queue.shift());
                computers[addr].machine.queueInput(queue.shift());
            }
        }
    })())
}

const natMon = {};

while (running) {
    for (let computer of computers) {
        let { machine, queue } = computer;
        const next = queue.shift();
        if (!next) {
            machine.queueInput(-1);
        }
        machine.run();
    }
    let newIdle = true;
    for (let i = 0; i < computers.length; ++i) {
        const q = computers[i].machine.inputQueue;

        newIdle = newIdle && q.length === 0;
    }
    idle = newIdle;
    if (idle && nat) {
        const [x, y] = nat;
        if (natMon.hasOwnProperty(y)) {
            console.log("Part 2:", y);
            return;
        }
        natMon[y] = true;
        computers[0].machine.queueInput(x);
        computers[0].machine.queueInput(y);
        nat = undefined;
    }
}