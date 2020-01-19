const fs = require('fs');
const IntMachine = require('../IntMachine');

const input = fs.readFileSync(__dirname + "/input", "utf8").split(",").map(x => +x);

function load(prog, bot) {
    prog.split("")
        .map(x => x.charCodeAt(0))
        .forEach(x => bot.queueInput(x));
}

let springBot = new IntMachine(input.slice());

springBot.on('output', (val) => {
    if (val < 128) {
        process.stdout.write(String.fromCharCode(val));
        springBot.readOutput();
    }
});

script = fs.readFileSync(__dirname + "/walk.ss", "utf8");
load(script, springBot);
springBot.run();

const ans = springBot.readOutput();

console.log("Part 1:", ans);

springBot = new IntMachine(input.slice());
springBot.on('output', (val) => {
    if (val < 128) {
        process.stdout.write(String.fromCharCode(val));
        springBot.readOutput();
    }
});

script = fs.readFileSync(__dirname + "/run.ss", "utf8");
load(script, springBot);
springBot.run();

const ans2 = springBot.readOutput();


console.log("Part 2:", ans2);
