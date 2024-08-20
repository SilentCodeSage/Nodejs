const http = require('http');

const app = http.createServer((req,res)=>{
    req.url === '/homepage'?res.end('This is the hompage'):res.end("Created Sever")
});

app.listen(3000);

