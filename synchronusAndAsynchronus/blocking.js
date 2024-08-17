const { error } = require('console');
var crypto = require('crypto');

console.log("Blocking");

var a = 10;
var b = 20;

// crypto.pbkdf2Sync("password","salt",500000,50,"sha512");
// console.log("Sync pbkd");

crypto.pbkdf2("password","salt",500000,50,"sha512",(err,Key)=>{
    console.log("Key Generated!");
});

const add = (a,b) =>{
    return a+b;
}

console.log("sum is :"+add(a,b));
