console.log("inside the sum file")

const secret = "This is a secret";
const sum = (a,b) =>{
    return a+b;
}

module.exports = {sum,secret};