import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Container, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Grid
  } from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
import { getCalificaciones } from '../services/Calificacion'; 
import { getCursoById, getTpsByCursoId } from '../services/tps';
import { Header} from './General/HeaderAlum';

const AlumnoTps = () => {
 
  const { idCurso, alumnoId } = useParams();
  const [dato, setDato] = useState([]);
  const [data, setData] = useState(null);
  const [calificaciones, setCalificaciones] = useState([]);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      try {
        const tpsData = await getTpsByCursoId(idCurso);
        const tpsDato = await getCursoById(idCurso);
        setDato(tpsDato);
        setData(tpsData);
        const califData = await getCalificaciones(alumnoId)
        console.log("Holaa",califData)
        setCalificaciones(califData)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [idCurso, alumnoId]);
  const formatFecha = (fechaHora) => {
    const fecha = fechaHora.split('T')[0];
    return fecha;
  };
  
  return (
    <Box display="flex" flexDirection="column">
      <Header />
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
              Curso - {dato.comision}
          </Typography>
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
              Materia {dato.materia}
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{  width: '20%', fontSize: '18px', paddingLeft: '4%' }}>Nombre del TP</TableCell>
                    <TableCell style={{  width: '20%', fontSize: '18px', paddingLeft: '7%' }}>Estado</TableCell>
                    <TableCell style={{  width: '20%', fontSize: '18px', paddingLeft: '5.5%' }}>Finalización</TableCell>
                    <TableCell style={{  width: '20%', fontSize: '18px', paddingLeft: '8%' }}>Nota</TableCell>
                    <TableCell style={{  width: '20%', fontSize: '18px', paddingLeft: '7%' }}>Entrega</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((tp, index) => (
                    <TableRow
                      key={tp._id}
                      sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                    >
                      <TableCell align="center">{tp.nombre }</TableCell>
                      <TableCell align="center">{tp.estado || 'Desconocido'}</TableCell>
                      <TableCell align="center">{formatFecha(tp.fechaFin)}</TableCell>
                      <TableCell align="center">{} / 10</TableCell>
                     
                      <TableCell align="center">
                        {!tp.grupal?(
                          <Button
                            variant="contained"
                            sx={{ 
                              backgroundColor: '#c5e1a5',
                              color: '#000000',
                              fontSize: '10px',
                              borderRadius: '5%',
                              '&:hover': { backgroundColor: '#b0d38a' }
                            }}
                            onClick={() => history.push(`/entregaAlumno/${alumnoId}/${tp._id}`)}
                          >
                            Agregar
                          </Button>
                          ):(
                            <Button
                            variant="contained"
                            sx={{ 
                              backgroundColor: '#c5e1a5',
                              color: '#000000',
                              fontSize: '10px',
                              borderRadius: '5%',
                              '&:hover': { backgroundColor: '#b0d38a' }
                            }}
                            onClick={() => history.push(`/entregaGrupo/${alumnoId}/${tp._id}`)}
                            >
                              Agregar
                            </Button>
                          )
                        }
                      </TableCell> 
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container 
              spacing={2} 
              justifyContent="center"
              marginTop='20px'
            >
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={() => history.goBack()}
                >
                  Volver
                </Button>
              </Grid>
            </Grid>
          </Container>
        </CardContent>
      </Card>
    </Box>
  );

  
};
export default AlumnoTps;
