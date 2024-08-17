var {sum,sub} =  require("./calculate/index");

const a = 100;
const b = 20;

const subR = sub(a,b);
const sumR = sum(a,b);
console.log(subR,sumR);