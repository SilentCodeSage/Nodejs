var crypto = require('crypto');

crypto.pbkdf2("password","salt",500000,50,"sha512",(err,key)=>{
    console.log("1");
});
crypto.pbkdf2("password","salt",500000,50,"sha512",(err,key)=>{
    console.log("2");
});
crypto.pbkdf2("password","salt",500000,50,"sha512",(err,key)=>{
    console.log("3");
});
crypto.pbkdf2("password","salt",500000,50,"sha512",(err,key)=>{
    console.log("4");
});
crypto.pbkdf2("password","salt",500000,50,"sha512",(err,key)=>{
    console.log("5");
});
crypto.pbkdf2("password","salt",500000,50,"sha512",(err,key)=>{
    console.log("6");
});