const fs = require('fs');
const a = 10

setImmediate(()=> console.log("SetImmediate") );

fs.readFile("./fileDemo","utf8",()=>{
    console.log("File Reading completed !");
});

setTimeout(() => console.log("SetTimeout"));

const printA = () =>{
    console.log("A : ",a);
}

printA();
console.log("End of File !");