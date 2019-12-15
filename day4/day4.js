
const min = 183564;
const max = 657474;

/** 
 * Password requirements
 * 6 digit number
 * 2 adjacent digits are teh same
 * Digits are in ascending order
 * 
 */

function containsAdjacent(pass) {
    let i = 1;
    let count = 1;
    let cur = pass[0];
    while (i != pass.length) {
        if (cur == pass[i]) {
            count++;
        } else if (count == 2) {
            return true;
        } else {
            count = 1;
            cur = pass[i];
        }
        i++;
    }
    return count === 2;
}

function isValid(pass) {
    if (!containsAdjacent(pass.toString())
    ) {
        return false;
    }
    let cur = pass[0];
    for (let j = 0; j < pass.length; j++) {
        if (pass[j] < cur) {
            return;
        }
        cur = pass[j];
    }
    return true
}

let count = 0;

for (let i = min; i <= max; i++) {
    if (isValid(i.toString())) {
        count++;
    }
}

console.log(count);