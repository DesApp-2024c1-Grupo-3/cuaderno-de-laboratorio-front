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
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const useStyles = makeStyles(() => ({
  card: {},
  conteinerButton,
}));

const body = {
  nombre: 'Carpinteria ',
  calificacion: '7',
  fechaInicio: '2023-08-30T12:00:00',
  fechaFin: '2023-08-30T12:00:00',
  grupal: true,
};

export default function CrearTps() {
  const classes = useStyles();
  const { idCurso, profesorId } = useParams();

  const crearTp = async () => {
    try {
      // Lógica para hacer la solicitud al backend
      const response = await postCrearTp(idCurso, profesorId, body);
      console.log(response);
      if (response.status == 201) {
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
              />
            </Container>
            <br></br>
            <Container>
              <TextField
                id="date"
                label="Fecha inicio"
                type="date"
                defaultValue="2017-05-24"
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <br></br>
              <br></br>
              <TextField
                id="date"
                label="Fecha fin"
                type="date"
                defaultValue="2017-05-24"
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Container>
            <br></br>
            {/* <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
            ></Box> */}
            <Container>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Grupal
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel value="si" control={<Radio />} label="Si" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>

              <Button disabled>Integrantes:</Button>

              <Button disabled>Minimo:</Button>
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
