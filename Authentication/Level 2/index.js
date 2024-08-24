import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";
import bcrypt from 'bcrypt'

const saltRounds = 10;

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
  const email = req.body.username;
  const password = req.body.password;

  //hashing the password
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if(err){
      console.log("password hashing error"+err);
      return;
    }
    db.query(`Insert Into users (email,password) Values ("${email}","${hash}")`,(err,results,fields)=>{
      if(err){
        console.log(err);
        return;
      } 
      res.render("secrets.ejs");
    });

  });
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  //getting the hashed password from  the database for the specific login emailid
  db.query(`SELECT password FROM users Where email = "${email}"`, (err, results, fields) => {
    if (err) {
      console.error(err);
      return;
    }

    //comparing the hased password from the db to the login password
    const currentUserPassword = results[0].password;
    bcrypt.compare(password,currentUserPassword,(err,isMatch)=>{
      if(err){
        console.log(err); 
        return;
      }
      if(isMatch){
        db.query(`SELECT * FROM users Where password = "${currentUserPassword}" and email = "${email}"`, (err, results, fields) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(results);
          res.render("secrets.ejs")
        });
      }else{
        res.send("Incorrect Password.Try again.");
      }
    });
  });
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});