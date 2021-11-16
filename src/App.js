import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Modal, Button, TextField } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles'


function App() {

    //url obtenida de mockAPI
    const url = 'https://60a6e6f9b970910017eb2862.mockapi.io/users/articles/'

  const [data, setData] = useState([]);
  const estilos = useStyles();
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);



  //obtenemos lo que el usuario ingresa y la captamos por la funcion handlerChange
  const [consolaSeleccionada, setConsolaSeleccionada] = useState({
    name: '',
    empresa : '',
    lanzamiento : '',
    unidades_vendidas: ''
  });

const handlerChange = (e) =>{
  const {name, value} = e.target;
  setConsolaSeleccionada(prevState =>({
    ...prevState,
    [name] : value
  }))
}
console.log(consolaSeleccionada);

//funcion para saber que consola esta seleccionada

const seleccionarConsola=(consola, caso)=>{
  setConsolaSeleccionada(consola);
  (caso==='editar')? abrirCerrarModalEditar(): abrirCerrarModalEliminar()
}



  //---------------------------PETICIONES------------------------------

  //peticion GET
  const peticionGet = async () => {
    await axios.get(url)
      .then(response => {
        setData(response.data);
        console.log(data);
      })
  }

  useEffect(async () => {
    await peticionGet();
  }, [])


  //peticion POST

  const peticionPost = async() =>{
    await axios.post(url, consolaSeleccionada)
    .then(response =>{
      setData(data.concat(response.data))
      abrirCerrarModalInsertar()
    })
  }

  // //peticion PUT

  const peticionPut = async () =>{
    await axios.put(url + consolaSeleccionada.id, consolaSeleccionada)
    .then(response=>{
      let dataNueva= data;
      console.log(dataNueva);
      dataNueva.map(consola =>{
        if(consolaSeleccionada.id === consola.id){
          consola.name = consolaSeleccionada.name;
          consola.empresa= consolaSeleccionada.empresa;
          consola.lanzamiento=consolaSeleccionada.lanzamiento;
          consola.unidades_vendidas=consolaSeleccionada.unidades_vendidas;
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    })
  }
  //peticion DELETE

  const peticionDelete =async()=>{
   await axios.delete(url+consolaSeleccionada.id)
   .then(response =>{
    setData(data.filter(consola => consola.id!==consolaSeleccionada.id ));
    abrirCerrarModalEliminar()
   })
  }

  //--------------------------MANEJO MODAL-----------------------------

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar)
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar)
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar)
  };


  //Body MODAL
  const bodyInsertar = (
      <div className={estilos.modal}>
      <h3>Agregar Nueva Consola</h3>
      <TextField name='name' className={estilos.inputMaterial} label='Nombre' onChange={handlerChange}></TextField>
      <br />
      <TextField name='empresa' className={estilos.inputMaterial} label='Empresa' onChange={handlerChange}></TextField>
      <br />
      <TextField name='lanzamiento' className={estilos.inputMaterial} label='Fecha de Lanzamiento' onChange={handlerChange}></TextField>
      <br />
      <TextField name='unidades_vendidas' className={estilos.inputMaterial} label='Unidades Vendidas' onChange={handlerChange}></TextField>
      <br />
      <div align="right">
        <Button onClick={()=>peticionPost()} color="primary">Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
    )
  
    const bodyEditar = (
      <div className={estilos.modal}>
      <h3> Editar Consola</h3>
      <TextField name='name' className={estilos.inputMaterial} label='Nombre' onChange={handlerChange} value={consolaSeleccionada && consolaSeleccionada.name}></TextField>
      <br />
      <TextField name='empresa' className={estilos.inputMaterial} label='Empresa' onChange={handlerChange} value={consolaSeleccionada && consolaSeleccionada.empresa}></TextField>
      <br />
      <TextField name='lanzamiento' className={estilos.inputMaterial} label='Fecha de Lanzamiento' onChange={handlerChange} value={consolaSeleccionada && consolaSeleccionada.lanzamiento}></TextField>
      <br />
      <TextField name='unidades_vendidas' className={estilos.inputMaterial} label='Unidades Vendidas' onChange={handlerChange} value={consolaSeleccionada && consolaSeleccionada.unidades_vendidas}></TextField>
      <br />
      <div align="right">
        <Button onClick={()=>peticionPut()} color="primary">Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
    )

    const bodyEliminar = (
      <div className={estilos.modal}>
      <h3> Estas seguro de eliminar la consola <b>{consolaSeleccionada && consolaSeleccionada.name}</b></h3>
      <br />
      <div align="right">
        <Button onClick={()=>peticionDelete()} color="secondary">SI</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>NO</Button>
      </div>
    </div>
    )

  return (
    <div className="App">
      <br />
      <Button onClick={()=>abrirCerrarModalInsertar()}>INSERTAR</Button>
      <br />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NOMBRE</TableCell>
              <TableCell>EMPRESA</TableCell>
              <TableCell>LANZAMIENTO</TableCell>
              <TableCell>UNIDADES VENDIDAS (millones)</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map(consola => (
              <TableRow key={consola.id}>
                <TableCell>{consola.name}</TableCell>
                <TableCell>{consola.empresa}</TableCell>
                <TableCell>{consola.lanzamiento}</TableCell>
                <TableCell>{consola.unidades_vendidas}</TableCell>
                <TableCell>
                  <Edit
                    onClick={()=>seleccionarConsola(consola, 'editar')} 
                    className={estilos.iconos} />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Delete
                    onClick={()=>seleccionarConsola(consola, 'eliminar')}  
                    className={estilos.iconos} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal insertar */}
      <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}
        >
        {bodyInsertar}
      </Modal>

        {/* Modal editar */}
        <Modal
        open={modalEditar}
        onClose={abrirCerrarModalEditar}
        >
        {bodyEditar}
      </Modal>

       {/* Modal eliminar */}
       <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}
        >
        {bodyEliminar}
      </Modal>
    </div>
  );
}



const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display:'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'traslate(-50%, -50%)',
    top: '20%',
    left: '30%',
  },
  iconos: {
    cursor: 'pointer',
  },
  inputMaterial: {
    width: '100%'
  },
}))
export default App;
