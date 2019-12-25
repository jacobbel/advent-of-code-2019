const fs = require("fs");
const IntMachine = require("../IntMachine");
const assert = require("assert");

const input = fs.readFileSync(__dirname + "/input", "utf8").split(",").map(x => +x);

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;
const WALL = 0;
const EMPTY = 1;
const TARGET = 2;

let repairBot = new IntMachine(input);

const map = {};

function exploreAllPaths(bot, location, map) {
    let target = undefined;

    const dirs = [
        { dir: NORTH, val: 1 },
        { dir: SOUTH, val: -1 },
        { dir: EAST, val: 1 },
        { dir: WEST, val: -1 }
    ];

    for (let i = 0; i < dirs.length; ++i) {
        const newLocation = [...location];
        const { dir, val } = dirs[i];
        const idx = dir === NORTH || dir === SOUTH ? 1 : 0;
        newLocation[idx] += val;
        if (map[newLocation.toString()] === undefined) {
            bot.queueInput(dir);
            bot.run();
            let output = bot.readOutput();
            map[newLocation.toString()] = output;
            if (output === EMPTY || output === TARGET) {
                const res = exploreAllPaths(bot, newLocation, map);
                assert(output !== TARGET || !res);
                if (output === TARGET) {
                    target = newLocation;
                } else if (res) {
                    target = res;
                }
                let opposite;
                if (dir === NORTH) {
                    opposite = SOUTH
                } else if (dir === SOUTH) {
                    opposite = NORTH
                } else if (dir === EAST) {
                    opposite = WEST
                } else {
                    opposite = EAST;
                };
                bot.queueInput(opposite);
                bot.run();
                output = bot.readOutput();
                assert(output !== WALL);
            }
        }
    }
    return target;
}

let targetLocation = exploreAllPaths(repairBot, [0, 0], map);

console.log("The oxygen system is at:", targetLocation);


function getMinCommands(map, target) {
    const queue = [];
    const seen = {};
    queue.push({ steps: 0, location: [0, 0] });
    seen[[0, 0].toString()] = true;
    while (queue.length !== 0) {
        let { steps, location } = queue.shift();
        if (location.toString() === target.toString()) {
            return steps;
        } else {
            const [x, y] = location;
            const up = [x, y + 1];
            const down = [x, y - 1];
            const right = [x + 1, y];
            const left = [x - 1, y];
            let dirs = [up, down, left, right];
            for (let i = 0; i < dirs.length; ++i) {
                const location = dirs[i].toString();
                if (map[location] !== undefined && map[location] !== WALL && !seen[location]) {
                    queue.push({ steps: steps + 1, location: dirs[i] });
                    seen[dirs[i].toString()] = true;
                }
            }
        }
    }
}

const p2 = getMinCommands(map, targetLocation);

console.log("The min number of commands is:", p2);

function getFillTime(map, startLocation) {
    const queue = [];
    const seen = {};
    queue.push({ steps: 0, location: startLocation });
    seen[startLocation.toString()] = true;
    let ret;
    while (queue.length !== 0) {
        let { steps, location } = queue.shift();
        ret = steps;
        const [x, y] = location;
        const up = [x, y + 1];
        const down = [x, y - 1];
        const right = [x + 1, y];
        const left = [x - 1, y];
        let dirs = [up, down, left, right];
        for (let i = 0; i < dirs.length; ++i) {
            const location = dirs[i].toString();
            if (map[location] !== undefined && map[location] !== WALL && !seen[location]) {
                queue.push({ steps: steps + 1, location: dirs[i] });
                seen[dirs[i].toString()] = true;
            }
        }

    }
    return ret;
}

const time = getFillTime(map, targetLocation);
console.log("The time to fill the area is:", time);