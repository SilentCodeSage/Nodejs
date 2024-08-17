
const fs = require('fs');

setImmediate(()=> console.log("SetImmediate") );

setTimeout(() => console.log("SetTimeout"));

Promise.resolve("Promise").then(console.log);

fs.readFile("./fileDemo","utf8",()=>{

    setImmediate(()=> console.log("SetImmediate2") );
    setTimeout(() => console.log("SetTimeout2"));
    Promise.resolve("Promise2").then(console.log);
    process.nextTick(() => console.log("Process.nextTick! 2"));

});

process.nextTick(() => console.log("Process.nextTick!"));