const fs = require("fs");
const https = require("https");

console.log("Asynchronus");

var a = 10;
var b = 20;

https.get("https://dummyjson.com/products/1",(res) =>{
    console.log("Data Fetched Succesfully: "+res);
});

setTimeout(()=>{
    console.log("This is called after 5 sec");
},5000);

const add = (a,b) =>{
    return a+b;
}

console.log("sum is :"+add(a,b));