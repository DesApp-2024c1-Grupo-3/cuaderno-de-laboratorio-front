import React, { useEffect, useState } from 'react';
import {
  Button, Card, CardContent, Container, Box, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, Paper, Alert
} from '@mui/material';
import { getDataFromBackend } from '../constants/curso';
import { getCurso as getTodosLosUsuarios_fake } from '../services/curso-fake';
import { getCursoPorIdProfesor } from '../services/curso';
import { useParams, NavLink } from 'react-router-dom';
import { SubHeader } from './General/SubHeader';
import { getProfesorPorId } from '../services/Profesor';

import { Header } from './General/HeaderProf';


//const profesorId = '669028aeb16ac395eec3432c'; //PARA BORRAR , LO DEJO PARA NO ROMPER NADA

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
  const { profesorId } = useParams(); // viene del login
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
      <Header />
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography sx={{ fontSize: '30px' }}>Comisiones</Typography>
          <Container
            maxWidth="xl"
            sx={{
              mt: 1,
              mb: 1,
              border: 'solid',
              borderWidth: '20px',
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
                    <TableCell align="center" sx={{ width: '33%', fontSize: '18px' }}>Materia</TableCell>
                    <TableCell align="center" sx={{ width: '33%', fontSize: '18px' }}>Comision</TableCell>
                    <TableCell align="center" sx={{ width: '33%', fontSize: '18px' }}>Trabajos Practicos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comision.map((it, index) => (
                    <TableRow
                      key={it._id}
                      sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                    >
                      <TableCell align="center">{it.materia.nombre}</TableCell>
                      <TableCell align="center">{it.comision}</TableCell>
                      <TableCell align="center" sx={{
                        display: 'flex',
                        justifyContent: 'center', // Centra horizontalmente
                        alignItems: 'center' // Centra verticalmente
                      }}>

                        <Button
                          sx={{
                            backgroundColor: '#c5e1a5',
                            color: '#000000',
                            fontSize: '10px',
                            borderRadius: '5%',
                            '&:hover': { backgroundColor: '#b0d38a' }
                          }}
                          component={NavLink}
                          to={`/tps/${it._id}/${profesorId}`}>Trabajos Practicos</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div style={{ marginTop: '20px' }}></div>{/*SALTO DE LINEA*/}
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