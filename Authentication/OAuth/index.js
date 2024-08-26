import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
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
const port = 3000;

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

app.get("/secrets", async (req, res) => {
  //if user is authenticated => go to secrets page
  if (req.isAuthenticated()) {
    
    try {
      const [rows] = await db.execute("Select scret from users Where email = ?",[req.user.email]);
      let secret = rows[0].secret;
      if(secret){
        
        res.render("secrets.ejs", { secret });
      }else{
        secret = rows[0].secret;
        res.render("secrets.ejs", {secret});
      }
    } catch (error) {
      console.log(error);

      
    }
    
  } else {
    //if user is not authenticated => redirtect to login page
    console.log("Not authenticated");
    res.redirect("/login");
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log("Error");
    } else {
      res.redirect("/");
    }
  });
});

app.get("/submit",(req,res) =>{
  if (req.isAuthenticated()) {
    res.render("submit.ejs");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", async (req, res) => {
  const secret = req.body.secret;
  try {
    // Use correct SQL syntax and column name 'scret'
    const [result] = await db.execute("UPDATE users SET scret = ? WHERE email = ?", [secret, req.user.email]);

    // Send a response or handle success
    res.status(200).send("Secret updated successfully");
    res.render("submit.ejs");
  } catch (error) {
    console.error('Error updating secret:', error);

    // Send an error response
    res.status(500).send("Error updating secret");
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
    res.render("secrets.ejs");
  } catch (error) {
    console.log("error");
    console.log(error);
  }
});

app.post(
  "/login",
  //triggers the strategy
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

passport.use(
  "local",
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

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.ID,
      clientSecret: process.env.OSECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      try {
        const [rows] = await db.execute("Select * From users Where email = ?", [
          profile.email,
        ]);

        if (rows.length == 0) {
          const [result] = await db.execute(
            "Insert Into users (email,password) Values (?,?)",
            [profile.email, "google"]
          );
          cb(null, result[0]);
        } else {
          //User Existing
          return cb(null, rows[0]);
        }
      } catch (error) {
        cb(error);
      }
    }
  )
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
