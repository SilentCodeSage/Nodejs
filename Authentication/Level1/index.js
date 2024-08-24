import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

const db = mysql.createConnection({
  host: 'localhost',
  user: 'secretsUser',     
  password: 'Secrets@123', 
  database: 'Secrets'  
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', db.threadId);
});

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  console.log(req.body)
  const email = req.body.username;
  const password = req.body.password;

  db.query(`Insert Into users (email,password) Values ("${email}","${password}")`,(err,results,fields)=>{
    if(err){
      console.log(err);
      return;
    }
    console.log(results)
  });
  res.render("secrets.ejs");
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password

  db.query(`SELECT * FROM users Where password = "${password}" and email = "${email}"`, (err, results, fields) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(results);
    res.render("secrets.ejs")
  });
  

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
