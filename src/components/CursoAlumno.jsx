import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Container, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Typography, Grid
} from '@mui/material';
import { SubHeader } from './General/SubHeader';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { getCursosByAlumnoIdWithAgreggate } from '../services/Alumnos';
import { Header} from './General/HeaderAlum';


const AlumnoCursos = () => {

  const { alumnoId } = useParams();
  const [dato, setDato] = useState([]);

  const history = useHistory();
  
  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const response = await getCursosByAlumnoIdWithAgreggate(alumnoId);
        setDato( response );
        
        console.log(response)
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
      }
    };
    if (alumnoId) {
      fetchCurso();
    }
  }, [alumnoId]);
  
  return (
    <Box display="flex" flexDirection="column">
      <Header />
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <SubHeader titulo="Mis cursos" />
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
              Prrobando por donde sale
            </Typography>
            <div style={{ marginTop: '20px' }}></div>{/*SALTO DE LINEA*/}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{  width: '33%', fontSize: '18px', paddingLeft: '13.5%' }}>Materia</TableCell>
                    <TableCell style={{  width: '33%', fontSize: '18px', paddingLeft: '14%' }}>Curso</TableCell>
                    <TableCell style={{  width: '33%', fontSize: '18px', paddingLeft: '12%' }}>Descripción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dato.map((curso, index) => (
                    <TableRow
                      key={curso._id}
                      sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                    >
                      <TableCell align="center">{curso.materia}</TableCell>
                      <TableCell align="center">{curso.comision}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: '#c5e1a5',
                            color: '#000000',
                            fontSize: '10px',
                            borderRadius: '5%',
                            '&:hover': { backgroundColor: '#b0d38a' }
                          }}
                          onClick={() => history.push(`/tpsAlumno/${curso.cursoId}/${alumnoId}`)}
                        >
                          Ir al Curso
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div style={{ marginTop: '20px' }}></div>{/*SALTO DE LINEA*/}
          </Container>
        </CardContent>
        <Grid container
              mx={2}
              mb={2}
            >
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                  component={NavLink}
                  to={`/`}
                >
                  Salir
                </Button>
              </Grid>
            </Grid>
      </Card>
    </Box>
  );
};





export default AlumnoCursos;
