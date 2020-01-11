const fs = require("fs");
const pq = require("./pq");

const input = fs.readFileSync(__dirname + "/input2", "utf8").split("\n");

const doors = {};
const keys = {};
const map = {};
const startLocations = [];

class Item {
    constructor(data) {
        return {
            next: undefined,
            data
        }
    }
}

class Queue {
    next = undefined;
    last = undefined;
    length = 0;

    dequeue() {
        const ret = this.next;
        this.next = this.next.next;
        if (this.last === ret) {
            this.last = undefined;
        }
        --this.length
        return ret.data;
    }

    queue(data) {
        const item = new Item(data);
        if (this.last) {
            this.last.next = item;
        } else {
            this.next = item;
            this.last = this.next;
        }
        this.last = item;
        ++this.length;
    }
}

function isUpper(a) {
    return a.charCodeAt(0) >= 'A'.charCodeAt(0)
        && a.charCodeAt(0) <= 'Z'.charCodeAt(0);
}

function isLower(a) {
    return a.charCodeAt(0) >= 'a'.charCodeAt(0)
        && a.charCodeAt(0) <= 'z'.charCodeAt(0);
}


for (let i = 0; i < input.length; ++i) {
    for (let j = 0; j < input[i].length; ++j) {
        const xy = [j, i];
        const val = input[i][j];
        if (val === '@') {
            startLocations.push(xy);
        } else if (val === "#" || val === ".") {
        }
        else if (isLower(val)) {
            keys[val] = xy;
        } else if (isUpper(val)) {
            doors[val] = xy;
        }
        map[xy.toString()] = val;
    }
}

const numKeys = Object.keys(keys).length;


const graph = {};

function bfs(start, name, map) {
    const seen = {};
    graph[name] = []
    const queue = new Queue();
    let s = 0;
    let position = { xy: start, steps: s };
    queue.queue(position);
    const dx = [1, 0, -1, 0];
    const dy = [0, 1, 0, -1];
    while (queue.length !== 0) {
        const location = queue.dequeue();

        const key = location.xy.toString();
        const val = map[key];
        if (seen.hasOwnProperty(key)) {
            continue;
        }
        if ((isLower(val) || isUpper(val)) && val !== name) {
            graph[name].push({ val, w: location.steps });
            if (!graph[val]) {
                bfs(location.xy, val, map);
            }
            continue;
        }

        seen[key] = true;

        dx.forEach((_, i) => {
            const l = [location.xy[0] + dx[i], location.xy[1] + dy[i]];
            const newPosition = { xy: l, steps: location.steps + 1 };
            const val = map[l.toString()];
            if (val === '#') {
                return;
            }
            else {
                queue.queue(newPosition);
            }
        });

    }
}

startLocations.forEach((x, i) => bfs(x, i, map));

function dijkstra(graph) {
    let keysFound = 0;
    const queue = new pq((a, b) => a.steps < b.steps);
    const seen = new Set();
    const startState = {
        positions: [
            "0", "1", "2", "3"
        ],
        steps: 0,
        keys: {}
    }
    queue.push(startState);

    while (queue.size() !== 0) {
        const state = queue.pop();
        const key = state.positions.reduce((str, cur) => str + cur.toString(), "")
            + Object.keys(state.keys).sort().toString();

        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        const positions = state.positions;
        const collection = state.keys;
        positions.forEach(pos => {
            if (isLower(pos)) {
                collection[pos.toString()] = true;
                if (Object.keys(collection).length > keysFound) {
                    keysFound = Object.keys(collection).length;
                    console.log(`Found ${keysFound} in ${state.steps}`);
                    if (keysFound === numKeys) {
                        process.exit();
                    }
                }
            }
        });

        positions.forEach((pos, i) => {
            const neighbors = graph[pos];
            neighbors && neighbors.forEach((node => {
                if (isUpper(node.val)
                    && !collection.hasOwnProperty(node.val.toLowerCase())) {
                    return;
                }
                const newState = {
                    positions: [...state.positions],
                    steps: state.steps + node.w,
                    keys: { ...collection }
                }
                newState.positions[i] = node.val;
                queue.push(newState);
            }))
        });
    }

}

console.log(graph);
dijkstra(graph);
