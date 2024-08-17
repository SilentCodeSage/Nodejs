const fs = require('fs');

setImmediate(()=>console.log("SetImmaediate"));

setTimeout(()=>console.log("setTimeout"));

Promise.resolve("Promise").then(console.log);

fs.readFile("./fileDemo.txt","utf8",() =>{
    console.log("File Reading");
});

process.nextTick(()=>{
    process.nextTick(()=>console.log("Inside nextTick"));
    Promise.resolve("Promise").then(console.log);
    console.log('nextTick');
});

console.log("End of file");