const fs = require("fs");

let input = fs.readFileSync(__dirname + "/input", "utf8");

const layers = [];

const w = 25;
const h = 6;
const size = w*h;


for (let i = 0; i < input.length; i += size) {
    let layer = [];
    for (let j = 0; j < size; j++) {
        layer.push(input[i + j]);
    }
    layers.push(layer);
}

let count = Infinity;
let fewest = 0;
for (let i = 0; i < layers.length; i++) {
    let zeros = layers[i].reduce((acc, x)=> acc + (x === "0"), 0);
    if (zeros < count) {
        count = zeros;
        fewest = i;
    }
}

let target = layers[fewest];
let ones = target.reduce((acc, x)=> acc + (x === "1"), 0);
let twos = target.reduce((acc, x)=> acc + (x === "2"), 0);

console.log("The answer is:", ones * twos);

console.log(layers);

let image = [];

for (let i = 0; i < target.length; i++) {
    let pixel = "2";
    for (let j = 0; j < layers.length; j++) {
        let cur = layers[j][i];
        if (pixel === "2") {
            pixel = cur;
        } else {
            continue;
        }
    }
    image.push(pixel);
}

console.log(image);

const reset = "\x1b[0m"
const black = "\x1b[40m"
const white = "\x1b[47m"

function toPixel(val) {
    if (val === "0") {
        return black + " " + reset;
    } else if ( val === "1") {
        return white + " " + reset;
    } else if (val === "2") {
        return " ";
    }
}

let ret = "";
for (let i = 0; i < image.length; i++) {
    if (i % w === 0 && i !=0) {
        ret += '\n';
    }
    ret += toPixel(image[i]);
}

console.log(ret);
