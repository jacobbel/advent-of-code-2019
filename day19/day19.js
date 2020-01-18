const fs = require("fs");
const IntMachine = require("../IntMachine");

const input = fs.readFileSync(__dirname + "/input", "utf8").split(",").map(x => +x);

let affected = 0;
for (let i = 0; i < 50; ++i) {
    for (let j = 0; j < 50; ++j) {
        drone = new IntMachine(input.slice());
        drone.queueInput(j);
        drone.queueInput(i);
        drone.run();
        if (drone.readOutput()) {
            ++affected;
        }
    }
}

console.log("Part 1:", affected);

function run(x, y) {
    const drone = new IntMachine(input.slice());
    drone.queueInput(x);
    drone.queueInput(y);
    drone.run();
    return drone.readOutput();
}

function getWidth(x) {
    let top = 0;
    while (run(x, top) === 0) {
        ++top;
    }
    // too small
    if (run(x, top + 100) === 0) {
        return [0, 0]
    }
    let bottom = top;
    while (run(x, bottom)) {
        ++bottom;
    }
    bottom -= 100;
    let start = x;
    while (run(start, bottom)) {
        ++start;
    }

    return [start - x, bottom];
}

function search(low, high) {
    let best;

    while (high >= low) {
        let x = Math.floor(((high + low) / 2));
        const [width, y] = getWidth(x);

        if (width >= 100) {
            high = x -1;
            best = [x, y];
        } else if (width < 100) {
            low = x + 1;
        }
    }
    return best;

}

const [x, y] = search(0, 10000);
console.log("Part 2:", x * 10000 + y);