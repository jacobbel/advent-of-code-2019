const fs = require('fs');
const q = require('./q');

const input = fs.readFileSync(__dirname + "/input", "utf8").split("\n");

const dr = [1, 0, -1, 0];
const dc = [0, 1, 0, -1];

const map = {};
const portals = {};

for (let row = 0; row < input.length; ++row) {
    for (let col = 0; col < input[0].length; ++col) {
        let location = [col, row];
        const value = input[row][col];

        if (value.match(/[A-Z]/g)) {
            let end;
            let exit;
            for (let i = 0; i < dr.length; ++i) {
                let second;
                let tmp = input[row + dr[i]];
                if (!tmp) continue;
                second = tmp[col + dc[i]] || "";
                if (!second.match(/[A-Z]/)) continue;
                tmp = input[row + dr[i] * 2];
                if (!tmp) continue;
                let third = tmp[col + dc[i] * 2] || "";
                if (third === '.') {
                    end = second;
                    location = [col + dc[i], row + dr[i]];
                    exit = [col + dc[i] * 2, row + dr[i] * 2];
                    break;
                };
            };
            if (!end) continue;
            let portal;
            if (portals.hasOwnProperty(end + value)) {
                portal = end + value;
            } else {
                portal = value + end;
            }
            map[location.toString()] = portal;
            if (!portals.hasOwnProperty(portal)) {
                portals[portal] = [];
            }
            portals[portal].push(exit);
        } else {
            map[location.toString()] = value;
        }
    }
}

const startLocation = portals['AA'][0];
const endLocation = portals['ZZ'][0];

delete portals['AA'];
delete portals['ZZ'];

function bfs(map, portals) {
    const queue = new q();
    const seen = {};
    const start = { location: startLocation, steps: 0 }
    queue.queue(start);
    const end = endLocation;

    while (queue.length !== 0) {
        const { location, steps } = queue.dequeue();
        if (seen.hasOwnProperty(location.toString())) {
            continue;
        }
        seen[location.toString()] = true;
        if (location.toString() === end.toString()) {
            return steps;
        }

        for (let i = 0; i < dr.length; ++i) {
            let newLocation = [...location];
            newLocation[0] += dc[i];
            newLocation[1] += dr[i];
            const value = map[newLocation.toString()];
            if (value === '.') {
                queue.queue(({ location: newLocation, steps: steps + 1 }));
            } else if (value && value.match(/[A-Z]/g)) {
                if (value === 'AA' || value === 'ZZ') {
                    continue;
                }
                let portal;
                if (portals[value]) {
                    portal = portals[value];
                } else {
                    portal = portals[value.split("").reverse().join("")];
                }
                if (location.toString() === portal[0].toString()) {
                    newLocation = portal[1];
                } else {
                    newLocation = portal[0];
                }
                queue.queue({ location: newLocation, steps: steps + 1 });
            }
        }
    }
}

const ans = bfs(map, portals);

console.log("Part 1:", ans);

function bfs2(map, portals) {
    const queue = new q();
    const seen = {};
    const start = { location: startLocation, steps: 0, level: 0 }
    queue.queue(start);
    const end = endLocation;

    while (queue.length !== 0) {
        const { location, steps, level } = queue.dequeue();
        if (seen.hasOwnProperty(location.toString() + "," + level)) {
            continue;
        }
        seen[location.toString() + "," + level] = true;
        if (location.toString() === end.toString() && level === 0) {
            return steps;
        }

        for (let i = 0; i < dr.length; ++i) {
            let newLocation = [...location];
            newLocation[0] += dc[i];
            newLocation[1] += dr[i];
            const value = map[newLocation.toString()];
            if (value === '.') {
                queue.queue(({ location: newLocation, steps: steps + 1, level }));
            } else if (value && value.match(/[A-Z]/g)) {
                if (value === 'AA' || value === 'ZZ') {
                    continue;
                }
                let portal;
                if (portals[value]) {
                    portal = portals[value];
                } else {
                    portal = portals[value.split("").reverse().join("")];
                }
                let exit;
                if (location.toString() === portal[0].toString()) {
                    exit = portal[1];
                } else {
                    exit = portal[0];
                }
                let isUp;
                if (location[0] === 2
                    || location[0] === input[0].length - 3
                    || location[1] === 2
                    || location[1] === input.length - 3
                ) {
                    isUp = true;
                } else {
                    isUp = false;
                }
                if (level === 0 && isUp) {
                    continue;
                } else {
                    queue.queue({
                        location: exit,
                        steps: steps + 1,
                        level: level + (isUp ? -1 : 1)
                    });
                }
            }
        }
    }
}

const ans2 = bfs2(map, portals);

console.log("Part 2:", ans2);