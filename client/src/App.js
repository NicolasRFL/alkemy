import './App.css';
import { useMemo, useState,useEffect } from "react";
//Implementing state hook
import Axios from "axios";
//Using Axios for AJAX requirement

function App() {
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState(0);
  const opDate = new Date();
  const [opType, setOpType] = useState("");

  const [newAmount, setNewAmount] = useState(0);

  const [listTransactions, setListTransactions] = useState(['Concepto','Cantidad','Tipo','Fecha','Actualizar']);

  // const columns = useMemo(() => [
  //   {
  //     Header: "Concepto",
  //     accessor: "state",
  //   },
  //   {
  //     Header: "Cantidad",
  //     accessor: "positive",
  //   },
  //   {
  //     Header: "Fecha",
  //     accessor: "recovered",
  //   },
  //   {
  //     Header: "Tipo",
  //     accessor: "recovered",
  //   },
  //   {
  //     Header: "Modificar",
  //     accessor: "recovered",
  //   },
  // ]);

  const getTransactions = () => {
    Axios.get("http://localhost:3030/operaciones").then((response) => {
      setListTransactions(response.data);
    });
  };

  const addTransaction = () => {
    Axios.post("http://localhost:3030/create", {
      concept: concept,
      amount: amount,
      opDate: opDate,
      opType: opType, 
    }).then(() => {
      getTransactions();
    });
  };

  const updateTransactionAmount = (id) => {
    Axios.put("http://localhost:3030/update", { amount: newAmount, id: id }).then(() => {
      getTransactions();
          });
  };

  const deleteTransaction = (id) => {
    Axios.delete(`http://localhost:3030/delete/${id}`).then(() => {
      getTransactions();
          });
  };

  useEffect(() => {
    const interval_id = setInterval(getTransactions, 300);
    return () => {
     // Stop the interval when the component unmounts. 
     // Otherwise it will keeep going and you will get an error.
     clearInterval(interval_id);
   }
}, []);

  return (<div className="App">
  <div className="information">
    <label>Concepto:</label>
    <input type="text" onChange={(event) => {setConcept(event.target.value);}}/>
    <label>Cantidad:</label>
    <input type="number" onChange={(event) => {setAmount(event.target.value);}}/>
    <label>Tipo:</label>
    <input type="text" onChange={(event) => {setOpType(event.target.value);}}/>
    <button onClick={addTransaction}>Add Transaction</button>
  </div>
  <div>
    {(listTransactions.slice(Math.max(listTransactions.length - 10, 0))).map((val, key) => {
      return (
        <div className='tableTransactions'>
          <div>
            Concepto: {val.concept}
          </div>
          <div>
            Cantidad: {val.amount}
          </div>
          <div>            
            Tipo: {val.opType}
          </div>
          <div className='fecha'>
            Fecha: {val.opDate}
          </div>
          <div className='upd'>
            <input type="text" placeholder="Change amount" onChange={(event) => {
                setNewAmount(event.target.value);
              }}/>
            <button onClick={() => {updateTransactionAmount(val.id);}}>
              Update
            </button>
            <button onClick={() => {deleteTransaction(val.id);}}>
              Delete
            </button>
          </div>
        </div>
      );
    })}
  </div>
</div>
);
};

export default App;
