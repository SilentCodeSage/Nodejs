import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const saltRounds = 10;

const db = await mysql.createConnection({
  host: "localhost",
  user: "secretsUser",
  password: "Secrets@123",
  database: "Secrets",
});

const app = express();
const port = 4000;

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
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    await db.execute(
      `Insert Into users (email,password) Values (?,?)`,[email,hash]
    );
    res.render("secrets.ejs");
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {

    //getting the hashed password from  the database for the specific login emailid
    const [rows] = await db.execute(
      `SELECT password FROM users WHERE email = ?`,[email]
    );
    if (rows.length > 0) {

      //comparing the password from database and the user entered password
      const isMatch = await bcrypt.compare(password, rows[0].password);
      if (isMatch) {
        const [result] = await db.execute(
          `SELECT * FROM users Where password = ? and email = ?`,[rows[0].password,email]
        );
        res.render("secrets.ejs");
      }
    }else{console.log("No matched Querry !")};
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
