import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import dotenv from "dotenv";

dotenv.config();

const saltRounds = 10;

const db = await mysql.createConnection({
  host: process.env.HOST,
  user: "secretsUser",
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/secrets", (req, res) => {
  //if user is authenticated => go to secrets page
  if (req.isAuthenticated()) {
    res.render("secrets.ejs");
  } else {
    //if user is not authenticated => redirtect to login page
    res.redirect("login.ejs");
  }
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  //hashing the password
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    await db.execute(`Insert Into users (email,password) Values (?,?)`, [
      email,
      hash,
    ]);
    res.render("/secrets.ejs");
  } catch (error) {
    console.log(error);
  }
});

app.post(
  "/login",
  //triggers the strategy
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      //password from db with the email id logged in with
      const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [
        username,
      ]);
      if (rows.length > 0) {
        const user = rows[0];
        //authentication
        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (isMatch) {
          //null => the callback for error
          //isauthenticated will be true in this case
          return cb(null, user);
        } else {
          //is authenticated will be false in this case
          return cb(null, false);
        }
      } else {
        return cb("user not found");
      }
    } catch (error) {
      console.log(error);
    }
  })
);

//save the data of the user logged in to the local storage
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
