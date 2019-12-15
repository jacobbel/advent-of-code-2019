const fs = require("fs");

const orbits = fs.readFileSync(__dirname + "/input", "utf8")
    .split("\n")
    .map(o => o.split(')'))
    .map(x => ({ center: x[0], orbiter: x[1] }));
/**
 * Orbit {
 *  center: B
 *  orbiters: next orbits Orbit[]
 * }
 */
let orbitList = [];

function getOrbitNode(orbit, target) {
    if (orbit.center === target) {
        return orbit;
    } else {
        for (let i = 0; i < orbit.orbiters.length; i++) {
            dest = getOrbitNode(orbit.orbiters[i], target);
            if (dest) {
                return dest;
            }
        }
    }
}

function addOrbit(orbitList, orbit) {
    // find center
    // if orbiter exist add to center, otherwise create it
    let center;
    for (let i = 0; i < orbitList.length; i++) {
        center = getOrbitNode(orbitList[i], orbit.center);
        if (center) {
            break;
        }
    }
    if (!center) {
        center = {
            center: orbit.center,
            orbiters: []
        }
        // console.log("pushing", center, "to orbit list");
        orbitList.push(center);
    }

    // find orbiter, if not exist create it
    let orbiter;
    for (let i = 0; i < orbitList.length; i++) {
        orbiter = getOrbitNode(orbitList[i], orbit.orbiter);
        if (orbiter) {
            break;
        }
    }
    if (!orbiter) {
        orbiter = {
            center: orbit.orbiter,
            orbiters: []
        }
    } else {
        const idx = orbitList.indexOf(orbiter);
        if (idx !== -1) {
            orbitList.splice(idx, 1);
        }
    }
    center.orbiters.push(orbiter);
}

function getOrbitCount(orbit) {
    let count = { direct: 0, indirect: 0 };
    for (let i = 0; i < orbit.orbiters.length; i++) {
        count.direct++;
        const x = getOrbitCount(orbit.orbiters[i]);
        count.direct += x.direct;
        count.indirect += x.indirect;
        count.indirect += x.direct;
    }
    return count;
}

function tracePath(orbit, target) {
    let visited = [];
    visited.push(orbit);
    if (orbit.center === target) {
        return visited;
    } else {
        for (let i = 0; i < orbit.orbiters.length; i++) {
            visited = visited.concat(tracePath(orbit.orbiters[i], target));
            if (visited[visited.length - 1].center === target) {
                return visited;
            }
        }
    }
    return [];
}

for (let i = 0; i < orbits.length; i++) {
    addOrbit(orbitList, orbits[i]);
}

const com = orbitList[0];
const count = getOrbitCount(orbitList[0]);

console.log(count.direct + count.indirect);

const location = getOrbitNode(com, "YOU");
const target = getOrbitNode(com, "SAN");

console.log(location, target);

let l1 = tracePath(com, "YOU");
let l2 = tracePath(com, "SAN");
let index;
for (let i = 0; i < l1.length && l2.length; i++) {
    if (l1[i] != l2[i]) {
        // at most recent ancestor;
        console.log("index is", i - 1);
        index = i;
        break;
    }
}

l1 = l1.slice(index);
l2 = l2.slice(index);

console.log("The minimum orbital hops is:", l1.length - 1 + l2.length - 1);

