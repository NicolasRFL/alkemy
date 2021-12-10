const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(mysql);
app.use(cors);

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



var server = app.listen(3030, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})