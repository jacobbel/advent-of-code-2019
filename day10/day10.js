const fs = require('fs');
assert = require("assert");

let input = fs.readFileSync(__dirname + "/input", "utf8")
    .split("\n")
    .map(line => line.split(""));

const W = input[0].length;

input = input.flat();

function toXY(i, width) {
    return [i % width, ~~(i / width)];
}

function hasAsteroid(i, field, width) {
    const xy = toXY(i, width);
    const x = xy[0];
    const y = xy[1];
    const val = field[x + y * width];
    return val === '#';
}

function getDirection(startX, startY, endX, endY) {
    return Math.atan2(endY - startY, endX - startX);
}

function getDirection(vector) {
    return (Math.atan2(vector[1], vector[0]) + 2 * Math.PI) % (2 * Math.PI);
}

function getVector(startX, startY, endX, endY) {
    let x = endX - startX;
    let y = endY - startY;
    return [x, y];
}

function getMagnitude(vector) {
    let x = vector[0];
    let y = vector[1];
    let mag = Math.sqrt(x ** 2 + y ** 2);
    return mag;
}

function normalize(vector) {
    const mag = getMagnitude(vector);
    return [vector[0] / mag, vector[1] / mag]
}

function toVec(dir, mag) {
    const x = mag * Math.cos(dir);
    const y = mag * Math.sin(dir);
    return [x, y];
}


let ans = 0;
let location;
let map;
for (let i = 0; i < input.length; i++) {
    if (hasAsteroid(i, input, W)) {
        let vectors = {};
        let count = 0;
        const xy = toXY(i, W);
        const x1 = xy[0];
        const y1 = xy[1];
        const debug = [];
        debug.length = input.length;
        debug.fill('.');
        debug[i] = '%';
        for (let j = 0; j < input.length; j++) {
            if (hasAsteroid(j, input, W) && j !== i) {
                debug[j] = "#";
                const xy2 = toXY(j, W);
                const x2 = xy2[0];
                const y2 = xy2[1];
                const vec = getVector(x1, y1, x2, y2);
                const dir = getDirection(vec).toPrecision(15);
                const mag = getMagnitude(vec);
                if (vectors[dir]) {
                    debug[j] = 'O'
                    vectors[dir].push(mag)
                    continue;
                } else {
                    debug[j] = 'X'
                    vectors[dir] = [mag];
                    count++;
                }
            }
        }
        if (count > ans) {
            console.log("New max found", count, xy, i);
            console.log("DEBUG");
            let str = "";
            for (let t = 0; t <= debug.length; t++) {
                if (t % W === 0 && t != 0) {
                    console.log(str);
                    str = "";
                }
                if (t === i) {
                    str += "Z";
                } else {
                    str += debug[t];
                }
            }
            let dirs = [];
            for (let key in vectors) {
                dirs.push([getDirection(key.split(",").map(n => +n)), key]);
            }
            // dirs.sort((a, b) => b[0] - a[0]);
            // console.log("directions", dirs);
            ans = count;
            location = xy;
            map = vectors;
        }
    }
}

console.log("The maximum observed number of asteroid is:", ans);

let sweep = [];

for (let dir in map) {
    assert(+dir >= 0);
    sweep.push({ dir: +dir, mags: map[dir].sort((a, b) => a - b) })
}

sweep.sort((a, b) => {
    a = +a.dir;
    b = +b.dir;

    // rotate to up
    a = a + Math.PI / 2;
    b = b + Math.PI / 2;

    // normalize
    a = (a + Math.PI * 2) % (2 * Math.PI);
    b = (b + Math.PI * 2) % (2 * Math.PI);

    return a - b;
});


let count = 0;

let test = [];
test.length = input.length;
test.fill('.');

for (let i = 0; i < 9; i++) {
    const d = sweep[i].dir;
    let deg = d * 180 / Math.PI;
    const m = sweep[i].mags[0];
    let v = toVec(d, m);
    v = [location[0] + v[0], location[1] + v[1]];
    const idx = Math.round(v[0]) + Math.round(v[1] * W);
    test[idx] = count % 10;
    count++;
}

let str = "";
for (let t = 0; t <= test.length; t++) {
    if (t % W === 0 && t != 0) {
        console.log(str);
        str = "";
    }
    if (t === location[0] + location[1] * W) {
        str += "X";
    } else {
        str += test[t];
    }
}


const dir = sweep[199].dir;
const mag = sweep[199].mags[0];


let bet = toVec(dir, mag);
bet = [Math.round(bet[0]), Math.round(bet[1])];

bet = [bet[0] + location[0], bet[1] + location[1]];

console.log(bet, location);

console.log("Part 2:", bet[0] * 100 + bet[0]);
