const fs = require("fs");
const IntMachine = require("../IntMachine");

const BLACK = 0;
const WHITE = 1;
const RIGHT = 1;
const LEFT = 0;



const input = fs.readFileSync(__dirname + "/input", "utf8").split(",").map(x => +x);

let map = {};
let location = [0, 0]

let machine = new IntMachine(input);
let direction = [0, 1];
let count = 0;

while (machine.state !== "stopped") {
    let color = map[location.toString()]
    if (color === undefined) {
        if (count === 0) {
            color = WHITE;
        } else {
            color = BLACK;
        }
        count++;
    }
    machine.queueInput(color);
    machine.run();
    const paint = machine.readOutput();
    const turn = machine.readOutput();
    map[location.toString()] = paint;
    if (turn === LEFT) {
        direction = [-direction[1], direction[0]]
    } else if (turn === RIGHT) {
        direction = [direction[1], -direction[0]]
    }
    location = [location[0] + direction[0], location[1] + direction[1]];
}

let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;

for (let coordinate in map) {
    const xy = coordinate.split(",").map(x => +x);
    if (xy[0] < minX) {
        minX = xy[0];
    }
    if (xy[0] > maxX) {
        maxX = xy[0];
    }
    if (xy[1] < minY) {
        minY = xy[1];
    }
    if (xy[1] > maxY) {
        maxY = xy[1];
    }
}

const W = maxX + 1 - minX;
const H = maxY + 1 - minY;

console.log("Min X:", minX, "Max X:", maxX, "Min Y:", minY, "Max Y:", maxY);
console.log("Width:", W, "Height:", H);

function toIndex(xy, W) {
    const idx = xy[0] + -(W * xy[1]);
    return idx;
}

const reset = "\x1b[0m"
const black = "\x1b[40m"
const white = "\x1b[47m"

function toPixel(val) {
    if (val === 0) {
        return black + " " + reset;
    } else if (val === 1) {
        return white + " " + reset;
    } else if (val === 2) {
        return " ";
    }
}


let image = [];
image.length = W * H;
image.fill(toPixel(0));

for (let coordinate in map) {
    const xy = coordinate.split(",").map(x => +x);
    const idx = toIndex(xy, W);
    const val = toPixel(map[coordinate]);
    image[idx] = val;
}



let ret = "";
for (let i = 0; i < image.length; i++) {
    if (i % W === 0 && i != 0) {
        ret += '\n';
    }
    ret += image[i];
}

console.log(ret);