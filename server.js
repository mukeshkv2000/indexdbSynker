const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;
const path = require("path");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "synker"
});

connection.connect();

app.set("views", __dirname + "/view");

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.get("/", function(req, res) {
  res.render("index.html");
});

app.get("/get_from_db", function(req, res) {
  connection.query("SELECT * from content", function(err, rows) {
    res.json(rows[0]);
  });
});

app.get("/ping", function(req, res) {
  res.json({ alive: "yes" });
});

app.get("/update", function(req, res) {
  const content = req.query.data;
  /*Check if there is any row else put one row for all time*/
  connection.query("SELECT * from content", function(err, rows, field) {
    if (rows.length === 0) {
      /*add one row*/
      connection.query(
        "INSERT into content(user_id,content) VALUES (1,'Seeder text')",
        function(err, rows) {
          if (err) {
            console.log(err);
            res.json({ error: "1" });
          } else {
            res.json({ yes: "1" });
          }
        }
      );
    } else {
      /*Sync exisiting data*/
      connection.query(
        "UPDATE content set content='" + content + "' where user_id=1",
        function(err, rows) {
          if (err) {
            console.log(err);
            res.json({ error: "1" });
          } else {
            res.json({ yes: "1" });
          }
        }
      );
    }
  });
});

app.listen(port, () => {
  console.log("app running at port", port);
});
