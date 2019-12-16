const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input", "utf8")
    .split("\n")
    .map(s => s
        .replace(/<|>|=|x|y|z/g, "")
        .split(",")
        .map(n => +n))
    .map(v => ({ x: v[0], y: v[1], z: v[2] }));

console.log(input);


function getVelocityChange(vector, set) {
    const ans = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < set.length; i++) {
        const cur = set[i];
        for (let d in cur) {
            if (cur[d] > vector[d]) {
                ++ans[d];
            } else if (cur[d] < vector[d]) {
                --ans[d];
            }
        }
    }
    return ans
}

/**
 * returns v1 + v2
 * @param {*} v1 
 * @param {*} v2 
 */
function addVectors(v1, v2) {
    const ans = { ...v1 };
    for (let d in v1) {
        ans[d] += v2[d];
    }
    return ans;
}

function vectorToString(vector) {
    let ret = "";
    for (let d in vector) {
        ret += "x:" + vector[d];
    }
    return ret;
}

function positionsToString(positions) {
    let ret = "";
    for (let i = 0; i < positions.length; ++i) {
        ret += "v" + i + vectorToString(positions[i]);
    }
    return ret;
}

let positions = input.slice();
let velocities = new Array(input.length).fill({ x: 0, y: 0, z: 0 });
let history = {};

for (let i = 0; i < 1000; ++i) {
    const nextPos = [];
    const nextVel = [];
    for (let j = 0; j < positions.length; ++j) {
        const curPos = positions[j];
        const curVel = velocities[j];
        const delta = getVelocityChange(curPos, positions);
        const newVel = addVectors(delta, curVel);
        const newPos = addVectors(curPos, newVel);
        nextPos.push(newPos);
        nextVel.push(newVel);
    }
    positions = nextPos;
    velocities = nextVel;
}

function getEnergy(v1) {
    let ans = 0;
    for (let d in v1) {
        ans += Math.abs(v1[d]);
    }
    return ans;
}

let totalEnergy = 0;

for (let i = 0; i < positions.length; i++) {
    const p = getEnergy(positions[i]);
    const k = getEnergy(velocities[i]);
    const t = k * p;
    totalEnergy += t;
}

console.log("The total energy in the system is:", totalEnergy);

function toHash(d, set) {
    let ret = "";
    for (let i = 0; i < set.length; ++i) {
        ret += "#" + i + "," + set[i][d];
    }
    return ret;
}

const dims = ["x", "y", "z"];

let counts = [];

for (let l = 0; l < dims.length; ++l) {
    let count = 0;
    positions = input.slice();
    velocities = new Array(input.length).fill({ x: 0, y: 0, z: 0 });
    let initial = toHash(dims[l], positions.slice()) + toHash(dims[l], velocities.slice());
    let test = "";

    while (test !== initial) {
        const nextPos = [];
        const nextVel = [];
        for (let j = 0; j < positions.length; ++j) {
            const curPos = positions[j];
            const curVel = velocities[j];
            const delta = getVelocityChange(curPos, positions);
            const newVel = addVectors(delta, curVel);
            const newPos = addVectors(curPos, newVel);
            nextPos.push(newPos);
            nextVel.push(newVel);
        }
        positions = nextPos;
        velocities = nextVel;
        test = toHash(dims[l], positions) + toHash(dims[l], velocities);
        count++;
    }
    counts.push(count);
}

console.log("counts:", counts);

function gcd(k, n) {
    return k ? gcd(n % k, k) : n;
}


function lcm(k, n) {
    return Math.abs(k * n) / gcd(k, n);
}
let ans = counts.reduce(lcm);

console.log("The answer is :", ans);


// positions = input.slice();
// velocities = new Array(input.length).fill({ x: 0, y: 0, z: 0 });
// history = {};
// history[positionsToString(positions)+positionsToString(velocities)] = true;
// let idx = 0;

// too slow!!!
// while (history[positionsToString(positions)+positionsToString(velocities)] !== false) {
//     const nextPos = [];
//     const nextVel = [];
//     for (let j = 0; j < positions.length; ++j) {
//         const curPos = positions[j];
//         const curVel = velocities[j];
//         const delta = getVelocityChange(curPos, positions);
//         const newVel = addVectors(delta, curVel);
//         const newPos = addVectors(curPos, newVel);
//         nextPos.push(newPos);
//         nextVel.push(newVel);
//     }
//     positions = nextPos;
//     velocities = nextVel;
//     const hash = positionsToString(positions) + positionsToString(velocities);
//     if (history[hash]) {
//         history[hash] = false;
//     } else {
//         history[hash] = true;
//     }
//     idx++;
// }

// console.log(idx);
