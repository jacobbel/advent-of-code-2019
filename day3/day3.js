const fs = require("fs");

const lines = fs.readFileSync(__dirname + "/input", "utf8");
const wires = lines.split("\n");

function toSteps(wire) {
    return wire.split(',').map(
        step => ({
            direction: step[0],
            distance: parseInt(step.slice(1))
        })
    );
}


function getCoordinates(wire) {
    moves = toSteps(wire);
    coordinates = {};
    let startX = 0;
    let startY = 0;
    let steps = 0;
    for (let i = 0; i < moves.length; i++) {
        const direction = moves[i].direction;
        const distance = moves[i].distance
        let endX = 0, endY = 0;
        if (direction === 'R' || direction === 'L') {
            const sign = direction === 'R' ? 1 : -1;
            endX = startX + distance * sign;
            endY = startY;
            const n = Math.abs(startX - endX)
            for (let j = 0; j <= n; j++) {
                if (j !==0 ) steps++;
                coordinates[`X${startX + j * sign}Y${startY}`] = { distance: Math.abs(startY)
                 + Math.abs(startX + j * sign), steps };
            }
        } else if (direction === 'U' || direction === 'D') {
            const sign = direction === "U" ? 1 : -1;
            endX = startX;
            endY =  startY + distance * sign;
            const n = Math.abs(startY - endY)
            for (let j = 0; j <= n; j++) {
                if (j !== 0) steps++;
                coordinates[`X${startX}Y${startY + j * sign}`] = { distance: Math.abs(startX)
                  + Math.abs(startY + j * sign), steps };
            }
        }
        startX = endX;
        startY = endY;
    }
    return coordinates;
}

function findNearestIntersection(map1, map2) {
    let distance = Infinity;
    for (let coordinate in map1) {
        if (map2[coordinate]) {
            const d = map2[coordinate].distance
            if (distance > d && d !== 0) {
                distance = d;
            }
        }
    }
    return distance;
}

function findMinStep(map1, map2) {
    let minSteps = Infinity;
    for (coordinate in map1) {
        if (map2[coordinate]) {
            const steps = map1[coordinate].steps + map2[coordinate].steps;
            if (steps < minSteps && steps !== 0) {
                minSteps = steps;
            }
        }
    }
    return minSteps;
}

const map1 = getCoordinates(wires[0]);
const map2 = getCoordinates(wires[1]);

console.log("The nearest distance is", findNearestIntersection(map1, map2));

console.log("The min step need is ", findMinStep(map1, map2));