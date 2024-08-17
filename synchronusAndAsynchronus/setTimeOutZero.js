console.log("Set Timeout");

var a = 10;
var b = 20;

setTimeout(()=>{
    console.log("This is called after 0 sec");
},0);

const add = (a,b) =>{
    return a+b;
}

console.log("sum is :"+add(a,b));