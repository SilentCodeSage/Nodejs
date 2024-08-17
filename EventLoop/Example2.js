const fs = require('fs');

const a = 10

setImmediate(()=> console.log("SetImmediate"),0);

Promise.resolve("Promise").then(console.log);

setTimeout(() => console.log("SetTimeout"),0);

process.nextTick(() => console.log("Process.nextTick!"));

const printA = () =>{
    console.log("A : ",a);
}

printA();
console.log("End of File !");