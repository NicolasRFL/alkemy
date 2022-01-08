const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
//Enable simple cors usage
app.use(express.json());

const db = mysql.createConnection({
   user: "root",
   host: "localhost",
   password: "",
   database: "Presupuesto",
});

app.post("/create", (req,res) =>{
   const concept = req.body.concept;
   const amount = req.body.amount;
   const opDate = req.body.opDate;
   const opType = req.body.opType;

   db.query(
      "INSERT INTO operaciones (concept,amount,opDate,opType) VALUES (?,?,?,?)",
      [concept,amount,opDate,opType],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Valores Insertados");
        }
      }
    );
}
);

app.get("/operaciones",(req,res)=>{
  db.query("SELECT * FROM operaciones",(err,result)=>{
    if (err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  })
});

app.put("/update", (req, res) => {
  const id = req.body.id;
  const amount = req.body.amount;
  db.query(
    "UPDATE operaciones SET amount = ? WHERE id = ?",
    [amount, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM operaciones WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/",(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.send('Server waiting');
});

var server = app.listen(3030, function () {
   console.log("Server ready at http://localhost:3030");
})