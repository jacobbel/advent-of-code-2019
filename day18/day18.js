const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input", "utf8").split("\n");

const doors = {};
const keys = {};
const map = {};
let start;

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
            start = xy;
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

function bfs(start, map) {
    const seen = {};
    const queue = new Queue();
    let s = 0;
    let position = { xy: start, steps: s, collected: {} };
    queue.queue(position);
    const dx = [1, 0, -1, 0];
    const dy = [0, 1, 0, -1];
    let keysFound = 0;
    while (queue.length !== 0) {
        const location = queue.dequeue();
        const val = map[location.xy.toString()];
        const collection = location.collected;
        const key = location.xy.toString() + Object.keys(location.collected).sort().toString()
        if (seen.hasOwnProperty(key)) {
            continue;
        }
        if (isLower(val) && !location.collected[val]) {
            collection[val] = true;
            const n = Object.keys(collection).length;
            if (n > keysFound) {
                console.log(`Found ${n} keys with ${location.steps} steps`);
                keysFound = n;
            }
            if (n === numKeys) {
                return;
            }

        }
        seen[key] = true;
        dx.forEach((_, i) => {
            const l = [location.xy[0] + dx[i], location.xy[1] + dy[i]];
            const newPosition = { xy: l, steps: location.steps + 1, collected: { ...collection } };
            const val = map[l.toString()];
            if (val === '#') {
                return;
            }
            if (isUpper(val) && !collection[val.toLowerCase()]) {
                return;
            }
            else {
                queue.queue(newPosition);
            }
        });

    }
}

bfs(start, map, keys, doors);