const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
   user: "root",
   host: "localhost",
   password: "",
   database: "Presupuesto",
});

app.post("/create", (req,res) =>{
   const concepto = req.body.concepto;
   const monto = req.body.monto;
   const fecha = req.body.fecha;
   const tipo = req.body.tipo;

   db.query(
      "INSERT INTO operaciones (concepto,monto,fecha,tipo) VALUES (?,?,?,?)",
      [concepto,monto,fecha,tipo],
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
  const id=req.body.id;

  db.query("SELECT * FROM operaciones WHERE ?",
  [id],(err,result)=>{
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
  const monto = req.body.monto;
  db.query(
    "UPDATE operaciones SET monto = ? WHERE id = ?",
    [monto, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/",(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.send('Server waiting');
});

var server = app.listen(3030, function () {
   console.log("Server ready at http://localhost:3030");
})