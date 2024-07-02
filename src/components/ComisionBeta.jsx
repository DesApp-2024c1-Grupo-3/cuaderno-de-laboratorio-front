import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Container,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import { getDataFromBackend } from '../constants/curso';
import { getCurso as getTodosLosUsuarios_fake } from '../services/curso-fake';
import { getCursoPorIdProfesor } from '../services/curso';
import { useParams, NavLink } from 'react-router-dom';
import { SubHeader } from './General/SubHeader';
import { getProfesorPorId } from '../services/Profesor';


const profesorId = '667759deca2ecc5c938c2c46';

// define el cuatrimestre y el año
const getCuatrimestreYAnio = () => {
  const fecha = new Date();
  const mes = fecha.getMonth() + 1; // Los meses en JavaScript son de 0 a 11
  const anio = fecha.getFullYear();
  let cuatrimestre = '';

  if (mes >= 3 && mes <= 7) {
    cuatrimestre = `Primer Cuatrimestre ${anio}`;
  } else if (mes >= 8 && mes <= 12) {
    cuatrimestre = `Segundo Cuatrimestre ${anio}`;
  } else {
    cuatrimestre = `Anterior ${anio}`;
  }

  return cuatrimestre;
}


const loadingRendering = () => {
  return (
    <div>
      <p>Cargando...</p>
    </div>
  );
};
export default function Comision() {
  const { estadoCurso } = useParams();

  const [comision, setComision] = useState(null);
  const [profesor, setProfesor] = useState([]);
  const [hasError, setHasError] = useState(false);

  // Obtener el cuatrimestre actual
  const cuatrimestreActual = getCuatrimestreYAnio();


  const tituloHeader = `Listado De Cursos | ${cuatrimestreActual}`;

  useEffect(() => {
    async function fetchCommision() {
      const getFunction = getDataFromBackend
        ? getCursoPorIdProfesor
        : getTodosLosUsuarios_fake;

      try {
        // Agregar el ID del profesor según la información que tengas en tu base de datos local.
        const comision = await getFunction(profesorId);
        setComision(comision);
        const data = await getProfesorPorId(profesorId);
        setProfesor(data);

      } catch (err) {
        console.log('Ocurrió este error.', err);
        setHasError(true);
      }
    }

    fetchCommision();
  }, [profesorId]);


  const comisionRendering = () => (
    <Box display="flex" flexDirection="column">
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography sx={{ fontSize: '30px' }}>{profesor.apellido} {profesor.nombre}</Typography>
          <Container
            maxWidth="xl"
            sx={{
              mt: 1,
              mb: 1,
              border: 'solid',
              borderWidth: '10px 20px 20px 10px',
              borderColor: 'rgba(0, 0, 0, 0.08)',
              borderRadius: '1%'
            }}
          >
            <Typography variant="h6" component="div" gutterBottom>
              {tituloHeader}
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Comisiones</TableCell>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Descripción</TableCell>
                    <TableCell style={{ width: '15%', fontSize: '15px' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comision.map((it, index) => (
                    <TableRow
                      key={it._id}
                      sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                    >
                      <TableCell>{it.materia.nombre}</TableCell>
                      <TableCell>{it.comision}</TableCell>
                      <TableCell>

                        <Button variant="contained"
                          sx={{
                            backgroundColor: '#c5e1a5',
                            color: '#000000',
                            fontSize: '10px',
                            borderRadius: '30%',
                            '&:hover': { backgroundColor: '#b0d38a' }
                          }}
                          component={NavLink}
                          to={`/tps/${it._id}/${profesorId}`}>Detalles</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container
              spacing={2}
              justifyContent="space-between"
              marginTop='20px'
              marginLeft='41.5%'
            >
              <Grid item>
                <Button Button variant="contained" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }} component={NavLink} to="/">Volver</Button>
              </Grid>
            </Grid>
          </Container>
        </CardContent>
      </Card>
    </Box>
  );

  const errorRendering = () => {
    return (
      <Alert severity="warning">
        No pudimos cargar el usuario. ¿Levantaste la API?{' '}
        <span role="img" aria-label="thinking">
          🤔
        </span>
      </Alert>
    );
  };

  return hasError
    ? errorRendering()
    : comision == null
      ? loadingRendering()
      : comisionRendering();
}