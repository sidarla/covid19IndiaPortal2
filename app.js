const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbFile = path.join(__dirname, "covid19IndiaPortal.db");
const app = express();
let db = null;
const initialDbAndServer = async () => {
  try {
    db = await open({
      filename: dbFile,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server is started ........");
    });
  } catch (e) {
    console.log(`server error is ${e.message}`);
    process.exit(1);
  }
};
initialDbAndServer();

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;

  const checkingUser = `select * from user where username='${username}'`;
  const a = await db.get(checkingUser);
  if (a !== undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const comparingPassword = await bcrypt.compare(password, a.password);
    if (comparingPassword === true) {
      const payload = { username: username };
      const sendingAccessToken = jwt.sign(payload, "abcd123");
      response.send(sendingAccessToken);
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      response.send("Login Success!");
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});
