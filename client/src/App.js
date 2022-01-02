import './App.css';
import { useMemo, useState,useEffect,useRef } from "react";
//Implementing state hook
import Axios from "axios";
//Using Axios for AJAX requirement
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import 'bootstrap/dist/css/bootstrap.min.css';
import BTable from 'react-bootstrap/Table';

import { BrowserRouter as Router, Routes, Route,Link } from "react-router-dom";
import { useTable, useSortBy } from 'react-table';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="abm" element={<ABM/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  );
}

function NotFound() {
  return <p className='m404'>Error 404 Ha llegado a una página que no existe</p>;
}

function Navbar(){
  return (<nav id="navbar" className="fixed-top">
  <Link to="/" className="vinculo">Home</Link>
  <Link to="abm" className="vinculo">ABM</Link>
</nav>);
}

function useInterval(callback, delay) {
  //https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  const intervalRef = useRef();
  const callbackRef = useRef(callback);

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setInterval ticks again, it
  // will still call your old callback.
  //
  // If you add `callback` to useEffect's deps, it will work fine but the
  // interval will be reset.

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the interval:

  useEffect(() => {
    if (typeof delay === 'number') {
      intervalRef.current = window.setInterval(() => callbackRef.current(), delay);

      // Clear interval if the components is unmounted or the delay changes:
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);
  
  // Returns a ref to the interval ID in case you want to clear it manually:
  return intervalRef;
}

function Home(){
  const [listTransactions, setListTransactions] = useState([]);
  const [bal,setBal] = useState(0);

  const [loadingData, setLoadingData] = useState(true);

  const columns = useMemo(() => [
    {
      Header: "Concepto",
      accessor: "concept",
    },
    {
      Header: "Monto",
      accessor: "amount",
    },
    {
      Header: "Fecha",
      accessor: "opDate",
    },
    {
      Header: "Tipo",
      accessor: "opType",
    },
  ],[]);

  useEffect(() => {
    async function getData() {
      await Axios
        .get("http://localhost:3030/operaciones")
        .then((response) => {
          // check if the data is populated
          console.log(response.data);
          setListTransactions(response.data);
          // you tell it that you had the result
          setLoadingData(false);
        });
    }
    if (loadingData) {
      // if the result is not ready so you make the axios call
      getData();
    }
  }, []);


  const getTransactions = () => {
    Axios.get("http://localhost:3030/operaciones").then((response) => {
      let res = response.data;
      if (res.length !== listTransactions.length){
        setListTransactions(res);
      }
      else{
        for (let i = 0; i < listTransactions.length; i+=1){
          if (listTransactions[i].amount!==res[i].amount){
            // Only compare the amount since it's the only modifiable part of the list.
            setListTransactions(res);
            break;
          }
        }
      }
    });
  };

  useInterval(() => {
    getTransactions();
  }, 3000);
  

  useEffect(() => {
    setBal(() => {
      var bala=0;
      for (var i = 0; i < listTransactions.length; i+=1){
        if (listTransactions[i].opType==="Ingreso"){
          bala+=listTransactions[i].amount;
        }
        else{
          bala-=listTransactions[i].amount;
        }
      }
      return bala;});
  }, [listTransactions]);

  return (
  <div className="App">
    <Container id="table">
      <h1 className="title">Ultimas 10 transacciones:</h1>
      <Table columns={columns} data={listTransactions.slice(-10).reverse()} maxRows={10}/>
    <h1 id="balance">
      Balance actual: <Badge bg="info">{bal}</Badge>
    </h1>
    </Container>
  </div>
);
};

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  },useSortBy)

  return (
    <BTable striped bordered hover size="sm" {...getTableProps()}>
      <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map(column => (
          // Add the sorting props to control sorting. For this example
          // we can add them into the header props
          <th {...column.getHeaderProps(column.getSortByToggleProps())}>
            {column.render('Header')}
            {/* Add a sort direction indicator */}
            <span>
              {column.isSorted
                ? column.isSortedDesc
                  ? ' 🔽'
                  : ' 🔼'
                : ''}
            </span>
          </th>
        ))}
        </tr>
      ))}
      </thead>
      <tbody>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </BTable>
  )
}

function ABM() {
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState(-1);
  const [opDate,setDate] = useState(new Date().toJSON().slice(0,10));
  const [opType, setOpType] = useState("");
  const [listTransactions, setListTransactions] = useState([]);
  const [bal,setBal] = useState(0);

  const [loadingData, setLoadingData] = useState(true);
  const [error,setError]=useState(false);
  const [errorAmount,setErrorAmount]=useState(false);
  const [errorType,setErrorType]=useState(false);
  const [errorUpdate,setErrorUpdate]=useState(false);
  const [isShowingAlert, setShowingAlert] = useState(false);
  
  const columns = useMemo(() => [
    {
      Header: "Concepto",
      accessor: "concept",
    },
    {
      Header: "Monto",
      accessor: "amount",
    },
    {
      Header: "Fecha",
      accessor: "opDate",
    },
    {
      Header: "Tipo",
      accessor: "opType",
    },
    {
      Header: "Modificar",
      accessor: "modify",
      Cell: row => {
        const [upd,setUpd] =useState();
        return (
        <Row sm="6" className="justify-content-center">
          <Col sm="4">
            <Form.Control type="number" onChange={(e)=>{
            setUpd(e.target.value)}}/>
          </Col>
          <Col sm="2">
              <Button className={!errorUpdate ? "btn-primary" : "btn-danger"} onClick={() => {
                updateTransactionAmount(row.cell.row.original.id,upd);
                }}>
                Update
              </Button>
          </Col>
          {errorUpdate ? <div className="alert-danger mt-1">El monto debe ser un numero entero y positivo.</div> : ''}
        </Row> 
        );
        },
    },
    {
      Header: "Borrar",
      accessor: "delete",
      Cell: row => {  
        return (       
        <Button onClick={() => {deleteTransaction(row.cell.row.original.id);}}>
          Delete
        </Button>);
        }
      },
  ],[]);

  useEffect(() => {
    async function getData() {
      await Axios
        .get("http://localhost:3030/operaciones")
        .then((response) => {
          // check if the data is populated
          console.log(response.data);
          setListTransactions(response.data);
          // you tell it that you had the result
          setLoadingData(false);
        });
    }
    if (loadingData) {
      // if the result is not ready so you make the axios call
      getData();
    }
  }, []);


  const getTransactions = () => {
    Axios.get("http://localhost:3030/operaciones").then((response) => {
      setListTransactions(response.data);
    });
  };

  const addTransaction = () => {
    if (validateAdd()){
      setError(false);
      setShowingAlert(true);
      Axios.post("http://localhost:3030/create", {
        concept: concept,
        amount: amount,
        opDate: opDate,
        opType: opType, 
      }).then(() => {
        getTransactions();
      });
    }
    else{
      setError(true);
    }
  };

  function validateAdd(){
    let validAmount =validateAmount(amount);
    let validType = validateType();
    setErrorAmount(!validAmount);
    setErrorType(!validType);
    return (validType && validAmount);
  }

  function validateAmount(a){
    if (a>0){
      setAmount(a);
      return true;
    }
    setAmount(a);
    return false;
  }

  function validateType(){
    if (opType==="Ingreso" || opType==="Egreso"){
      return true;
    }
    return false;
  }
  
  const updateTransactionAmount = (id,newAmount) => {
    if (validateAmount(newAmount)){
      setErrorUpdate(false);
      Axios.put("http://localhost:3030/update", { amount: newAmount, id: id }).then(() => {
        getTransactions();
            });
      }
    else{
      setErrorUpdate(true);
    }
  };

  const deleteTransaction = (id) => {
    Axios.delete(`http://localhost:3030/delete/${id}`).then(() => {
      getTransactions();
          });
  };

  useEffect(() => {
    setBal(() => {
      let aux=0;
      for (var i = 0; i < listTransactions.length; i+=1){
        if (listTransactions[i].opType==="Ingreso"){
          aux+=listTransactions[i].amount;
        }
        else{
          aux-=listTransactions[i].amount;
        }
      }
      return aux;});
  }, [listTransactions]);

  return (
  <div className="App">
    <section className="title">
      <h1>Formulario para agregar una transaccion:</h1>
    </section>
    <Container>
      <Form className="information">
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Concepto:</Form.Label>
          <Col sm="10">
            <Form.Control type="text" required onChange={(event) => {setConcept(event.target.value);}}/>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Monto:</Form.Label>
          <Col sm="10">
              <Form.Control type="number" required min="0" onChange={(event) => {validateAmount(event.target.value)}}/>
              {errorAmount ? <div className="alert-danger mt-1">El monto debe ser un numero entero y positivo.</div> : ''}
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Tipo:</Form.Label>
          <Col sm="10">
            <Form.Select required onChange={(event)=>{setOpType(event.target.value);}}>
              <option id="selectLabel" value="" disabled selected>Seleccione tipo</option>
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
            </Form.Select>
            {errorType ? <div className="alert-danger mt-1">Selecciona un tipo de transaccion</div> : ''}
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Fecha </Form.Label>
          <Col sm="10">
            <Form.Control type="date" onChange={(e) => {setDate(e.target.value)}} />
          </Col>
        </Form.Group>
        <Button variant="success" onClick={addTransaction}>Add Transaction</Button>
      </Form>
      <div className={`alert alert-success ${isShowingAlert ? 'alert-shown' : 'alert-hidden'}`}
          id="succAlert" onTransitionEnd={() => setShowingAlert(false)}
        >Enviado con exito!</div>
      {error ? <div className='alert alert-danger'>La solicitud no se envio!</div> :''}
    </Container>
    <Container id="table">
    <Table
          columns={columns}
          data={listTransactions.reverse()}
          usePagination={true}
        />
    <h3>
      Balance actual: <Badge bg="info">{bal}</Badge>
    </h3>
    <p></p>
    </Container>
  </div>
);
};