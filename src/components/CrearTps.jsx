import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Container,
  makeStyles,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  ListItem,
  List,
  ListSubheader,
} from '@material-ui/core';
import ReactQuill from 'react-quill'; // Importa ReactQuill
import 'react-quill/dist/quill.snow.css'; // Estilo de ReactQuill
import { conteinerButton } from '../style/buttonStyle';
import { SubHeader } from './General/SubHeader';
import { crearTp as postCrearTp } from '../services/tps';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import ListaDeGrupos from './Profesores/ListaDeGrupos';
import { useEffect } from 'react';
import { ListItemText } from '@mui/material';

const useStyles = makeStyles(() => ({
  card: {},
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto', // Centro el formulario
  },
  conteinerButton: {
    // ... (resto de estilos)
  },
  quillContainer: {
    marginTop: 16,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'left', // Alinea los botones a la izquierda
    marginTop: 16,
  },
  button: {
    marginLeft: 8, // Espacio entre los botones
  },
}));

export default function CrearTps() {
  const classes = useStyles();
  const { idCurso, profesorId } = useParams();
  const [show, setShow] = useState(false);

  const [gruposParaTrabajo, setGruposParaTrabajo] = useState([]);

  console.log(gruposParaTrabajo, 'grupoParatp');

  const hideModal = () => {
    setShow(false);
  };

  const openModal = () => {
    setShow(true);
  };
  const [tpData, setTpData] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    grupal: false,
    grupo: [],
    consigna: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTpData({ ...tpData, [name]: value });
    if (value) {
      openModal;
    } else {
      hideModal;
    }
  };

  const handleConsignaChange = (value) => {
    setTpData({ ...tpData, consigna: value });
  };

  const validarDatos = () => {
    if (!tpData.nombre || !tpData.fechaInicio || !tpData.fechaFin) {
      console.log(tpData.nombre, tpData.fechaInicio, tpData.fechaFin);
      window.alert(
        'Completa todos los campos obligatorios: Nombre, Fecha Inicio, Fecha Fin'
      );
      return false;
    }
    return true;
  };
  const agregarGrupo = () => {
    //setea el valor de la tabla de lista de grupos -> en tpData
    setTpData({ ...tpData, grupo: gruposParaTrabajo });
  };
  const crearTp = async () => {
    agregarGrupo();

    if (!validarDatos()) {
      return;
    }
    try {
      // Lógica para hacer la solicitud al backend
      const response = await postCrearTp(idCurso, profesorId, tpData);
      if (response.status === 201) {
        // Redirige a la página después de crear el TP
        window.alert('Trabajo práctico creado correctamente');
      } else {
        console.error('Error al crear TP');
        // Manejo de errores según sea necesario
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      // Manejo de errores según sea necesario
      window.alert('Error en la solicitud');
    }
  };

  useEffect(() => {
    setShow(tpData.grupal);
    console.log('useEfect', tpData);
  }, [tpData, show, setShow, setTpData]);

  useEffect(() => {
    console.log('useEfct2');
    agregarGrupo();
  }, [gruposParaTrabajo, setGruposParaTrabajo]);

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <SubHeader titulo={'Crear Tps'} />
          <form className={classes.form}>
            <Container>
              <Container style={{ display: 'flex' }}>
                <Container
                  style={{ width: ' 50%', margin: '2% 0%' }}
                  maxWidth="l"
                  className={classes.conteinerButton}
                >
                  <Container>
                    <TextField
                      id="outlined-basic"
                      label="Nombre de Tp"
                      variant="outlined"
                      name="nombre"
                      value={tpData.nombre}
                      onChange={handleChange}
                    />
                  </Container>
                  <br></br>
                  <Container>
                    <TextField
                      id="date"
                      label="Fecha inicio"
                      type="date"
                      sx={{ width: 220 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      name="fechaInicio"
                      value={tpData.fechaInicio}
                      onChange={handleChange}
                    />
                    <br></br>
                    <br></br>
                    <TextField
                      id="date"
                      label="Fecha fin"
                      type="date"
                      sx={{ width: 220 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      name="fechaFin"
                      value={tpData.fechaFin}
                      onChange={handleChange}
                    />
                  </Container>
                  <br></br>
                  <Container>
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        Grupal
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="grupal"
                        value={tpData.grupal.toString()}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="Sí"
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Container>
                </Container>
                <Container
                  style={{
                    width: ' 50%',
                    padding: '2% 0%',
                  }}
                >
                  <ListaDeGrupos
                    idCurso={idCurso}
                    show={show}
                    closeModal={hideModal}
                    setGruposParaTrabajo={setGruposParaTrabajo}
                  ></ListaDeGrupos>
                </Container>
              </Container>
              <br></br>
              <Container className={classes.quillContainer}>
                <FormLabel>Consigna</FormLabel>
                <ReactQuill
                  value={tpData.consigna}
                  onChange={(value) => handleConsignaChange(value)}
                />
              </Container>

              <Container id="botones" className={classes.buttonContainer}>
                <Button
                  color="primary"
                  component={NavLink}
                  to={`/tps/${idCurso}/${profesorId}`}
                  key="botonVolver"
                  className={classes.button}
                >
                  Volver
                </Button>
                <Button
                  variant="contained"
                  component={NavLink}
                  to={`/Administrar_Grupos/${idCurso}`}
                  className={classes.button}
                >
                  Administar Grupos
                </Button>
                <Button
                  variant="contained"
                  onClick={() => crearTp()}
                  className={classes.button}
                >
                  Crear TP
                </Button>
              </Container>
            </Container>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
