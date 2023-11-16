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
} from '@material-ui/core';
import { conteinerButton } from '../style/buttonStyle';
import { SubHeader } from './General/SubHeader';
import { crearTp as postCrearTp } from '../services/tps';
import { useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';


const useStyles = makeStyles(() => ({
  card: {},
  conteinerButton,
}));

export default function CrearTps() {
  const classes = useStyles();
  const { idCurso, profesorId } = useParams();

  const [tpData, setTpData] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    grupal: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTpData({ ...tpData, [name]: value });
  };

  const validarDatos = () => {
    if (!tpData.nombre || !tpData.fechaInicio || !tpData.fechaFin) {
      window.alert('Completa todos los campos obligatorios: Nombre, Fecha Inicio, Fecha Fin');
      return false;
    }
    return true;
  };

  const crearTp = async () => {
    if (!validarDatos()) {
      return;
    }
    try {
      // Lógica para hacer la solicitud al backend
      const response = await postCrearTp(idCurso, profesorId, tpData);
      console.log(response);
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

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <SubHeader titulo={'Crear Tps'} />
          <Container maxWidth="l" className={classes.conteinerButton}>
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
                  <FormControlLabel value="true" control={<Radio />} label="Sí" />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Container>
          </Container>
          <Button
            color="primary"
            component={NavLink}
            to={`/tps/${idCurso}/${profesorId}`}
            key="botonVolver"
          >
            Volver
          </Button>
          <Button
            variant="contained"
            onClick={() => crearTp()}
          >
            Crear TP
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
