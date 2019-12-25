const fs = require("fs");
const assert = require("assert");

const input = fs.readFileSync(__dirname + "/input", "utf8")
    .split("\n").map(x => x.split("=>")
        .map(x => x.trim().split(",")))
    .map(x => {
        const needs = x[0].map(a => a.trim().split(" ")).map(a => ({ amount: +a[0], name: a[1] }));
        const gets = x[1].map(a => a.trim().split(" ")).map(a => ({ amount: +a[0], name: a[1] }))[0];
        return {
            needs,
            gets
        }
    });

let recipes = {};

for (let i = 0; i < input.length; ++i) {
    let name = input[i].gets.name;
    assert(recipes[name] === undefined);
    recipes[name] = input[i];
}

function getOre(chemical, amount, recipes) {
    const stash = {};
    const queue = [{ amount: amount, chemical }];
    let ore = 0;
    while (queue.length !== 0) {
        const cur = queue.shift();
        const name = cur.chemical;
        if (stash[name] === undefined) {
            stash[name] = 0;
        }
        if (name === "ORE") {
            ore += cur.amount;
        } else if (cur.amount <= stash[name]) {
            stash[name] -= cur.amount;
        } else {
            amountNeeded = cur.amount - stash[name];
            recipe = recipes[name];
            batches = Math.ceil(amountNeeded / recipe.gets.amount);
            const needed = recipe.needs;
            for (let i = 0; i < needed.length; ++i) {
                queue.push({ chemical: needed[i].name, amount: needed[i].amount * batches });
            }
            leftOver = batches * recipe.gets.amount - amountNeeded;
            stash[name] = leftOver;
        }
    }
    return ore;
}

const p1 = getOre("FUEL", 1, recipes);

console.log("Minimum ore needed:", p1);

const capacity = 1000000000000;
let start = 0;
let end = capacity;
let x = capacity / 2;
let minOre = 0;
while (start <= end) {
    minOre = getOre("FUEL", x, recipes);
    if (minOre < capacity) {
        start = x + 1;
    } else if (minOre > capacity) {
        end = x - 1;
    } else {
        break;
    }
    x = Math.floor(start + (end - start) / 2);
}

console.log("Max fuel created:", x);
