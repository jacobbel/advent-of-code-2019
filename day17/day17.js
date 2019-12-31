const fs = require("fs");
const IntMachine = require("../IntMachine");

const input = fs.readFileSync(__dirname + "/input", "utf8").split(",").map(x => +x);

let robot = new IntMachine(input.slice());

robot.run();

const image = robot.outputQueue.splice(0).map(x => String.fromCharCode(x)).join("");

let W, H = 0;

for (let i = 0; i < image.length; ++i) {
    if (image[i] === '\n') {
        ++H;
        if (!W) {
            W = i + 1;
        }
    }
}

function toIndex(xy) {
    const [x, y] = xy;
    return x + y * W;
}

function toXY(i) {
    return [i % W, Math.floor(i / W)];
}

function isRobot(char) {
    return char === '^'
        || char === '>'
        || char === '<'
        || char === 'v';
}

function isScaffold(char) {
    return char === '#' || isRobot(char);
}


let p1 = 0;

const map = {};
let start;

for (let i = 0; i < image.length; ++i) {
    const cur = image[i];
    if (isRobot(cur)) {
        start = toXY(i);
    }
    if (isScaffold(cur)) {
        const xy = toXY(i);
        map[xy.toString()] = true;
        const [x, y] = xy;
        const up = image[toIndex([x, y + 1])];
        const right = image[toIndex([x + 1, y])];
        const down = image[toIndex([x, y - 1])];
        const left = image[toIndex([x - 1, y])];
        const dirs = [left, right, down, up];
        if (dirs.reduce((acc, val) => acc && isScaffold(val), true)) {
            p1 += x * y;
        }
    }
}

function add(xy1, xy2) {
    return [xy1[0] + xy2[0], xy1[1] + xy2[1]];
}


console.log("p1 answer:", p1);

function getDistance(location, map, direction) {
    let d = -1;
    while (map[location.toString()]) {
        location = add(location, direction);
        d++;
    }
    return d;
}

function getDirection(char) {
    switch (char) {
        case 'D': return DOWN;
        case 'U': return UP;
        case 'R': return RIGHT;
        case 'L': return LEFT;
    }
}

function scale(xy, f) {
    return [xy[0] * f, xy[1] * f];
}

function opposite(direction) {
    switch (direction) {
        case 'R': return 'L';
        case 'L': return 'R';
        case 'U': return 'D';
        case 'D': return 'U';
    }
}

function toVec(direction) {
    switch (direction) {
        case 'R': return RIGHT;
        case 'L': return LEFT;
        case 'U': return UP;
        case 'D': return DOWN;
    }
}

const RIGHT = [1, 0];
const LEFT = [-1, 0];
const UP = [0, -1];
const DOWN = [0, 1];

function toLR(from, to) {
    from = toVec(from);
    to = toVec(to);
    const t1 = (Math.atan2(from[1], from[0]) * 180 / Math.PI + 360) % 360;
    const t2 = Math.atan2(to[1], to[0]) * 180 / Math.PI;
    const diff = t2 - t1;
    if (diff === 90 || diff === -270) {
        return ['R']
    } else if (Math.abs(diff) === 180) {
        return ['R', 'R']
    } else {
        return ['L'];
    }
}

function getPath(location, map, direction) {
    const commands = [];
    let prev;
    while (true) {
        const r = { direction: 'R', d: getDistance(location, map, RIGHT) };
        const l = { direction: 'L', d: getDistance(location, map, LEFT) };
        const u = { direction: 'U', d: getDistance(location, map, UP) };
        const d = { direction: 'D', d: getDistance(location, map, DOWN) };
        const move = [u, d, l, r].filter(x => x.direction !== prev).reduce((max, cur) => cur.d > max.d ? cur : max);
        if (move.d === 0) {
            break;
        }
        commands.push(...toLR(direction, move.direction), move.d);
        direction = move.direction;
        prev = opposite(move.direction);
        location = add(scale(getDirection(move.direction), move.d), location);
    }
    return commands;
}

const commands = getPath(start, map, 'U');

function genDict(commands) {
    let dict = {};

    for (let wSize = 5; wSize < 11; ++wSize) {
        for (let i = 0; i < commands.length - wSize; ++i) {
            const pattern = commands.slice(i, i + wSize).toString();
            if (dict[pattern]) {
                dict[pattern]++;
            } else {
                dict[pattern] = 1;
            }
        }
    }

    return dict;
}

// slow! but works
function compress(commands, dict) {
    for (let a in dict) {
        for (let b in dict) {
            for (let c in dict) {
                let offset = 0;
                const sequence = [];
                while (true) {
                    const aTest = commands.slice(offset, offset + a.split(",").length).toString();
                    const bTest = commands.slice(offset, offset + b.split(",").length).toString();
                    const cTest = commands.slice(offset, offset + c.split(",").length).toString();

                    if (aTest === a) {
                        offset += a.split(",").length;
                        sequence.push("A");
                    } else if (bTest === b) {
                        offset += b.split(",").length;
                        sequence.push("B");
                    } else if (cTest === c) {
                        offset += c.split(",").length;
                        sequence.push("C");
                    } else if (offset >= commands.length) {
                        const seq = [...sequence.toString().split("").map(x => x.charCodeAt(0)), '\n'.charCodeAt(0)];
                        const A = [...a.split("").map(x => x.charCodeAt(0)), '\n'.charCodeAt(0)];
                        const B = [...b.split("").map(x => x.charCodeAt(0)), '\n'.charCodeAt(0)];
                        const C = [...c.split("").map(x => x.charCodeAt(0)), '\n'.charCodeAt(0)];

                        return [
                            ...seq, ...A, ...B, ...C
                        ]
                    } else {
                        break;
                    }
                }
            }
        }
    }
}

const dict = genDict(commands);

const sequence = compress(commands, dict);

input[0] = 2;

robot = new IntMachine(input);

robot.inputQueue = sequence;
robot.queueInput('n'.charCodeAt(0));
robot.queueInput('\n'.charCodeAt(0));

robot.run()

const p2 = robot.outputQueue[robot.outputQueue.length - 1];
console.log(robot.outputQueue.reduce((str, x) => str += String.fromCharCode(x), ""));


console.log("p2 answer:", p2);