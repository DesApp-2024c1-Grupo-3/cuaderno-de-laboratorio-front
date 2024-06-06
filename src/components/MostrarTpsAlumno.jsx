import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Container, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Grid
  } from '@mui/material';
import { SubHeader } from './General/SubHeader';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import {getCursoById} from '../services/tps';
import { getTpsByCursoId } from '../services/tps';

const AlumnoTps = () => {
 
  const { idCurso} = useParams();
  const [dato, setDato] = useState(null);
  const [data, setData] = useState(null);
 
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      try {
        const tpsData = await getTpsByCursoId(idCurso);
        const tpsDato = await getCursoById(idCurso);
        console.log("Datos obtenidos:", tpsDato.materia);  // Verifica la estructura de los datos obtenidos
        setDato(tpsDato);
        setData(tpsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        
      }
    }

    fetchData();
  }, [idCurso]);

  const formatFecha = (fechaHora) => {
    const fecha = fechaHora.split('T')[0];
    return fecha;
  };

  return (
    <Box display="flex" flexDirection="column">
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <SubHeader titulo="Mis cursos"/>
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
              Materia
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '20%', fontSize: '15px' }}>Nombre del TP</TableCell>
                    <TableCell style={{ width: '20%', fontSize: '15px' }}>Estado</TableCell>
                    <TableCell style={{ width: '20%', fontSize: '15px' }}>Finalización</TableCell>
                    <TableCell style={{ width: '20%', fontSize: '15px' }}>Nota</TableCell>
                    <TableCell style={{ width: '20%', fontSize: '15px' }}>Entrega</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((tp, index) => (
                    <TableRow
                      key={tp._id}
                      sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                    >
                      <TableCell>{tp.nombre }</TableCell>
                      <TableCell>{tp.estado || 'Desconocido'}</TableCell>
                      <TableCell>{formatFecha(tp.fechaFin)}</TableCell>
                      <TableCell>{tp.calificacion}/ 10</TableCell>
                     
                      <TableCell>
                        <Button
                          variant="contained"
                          sx={{ 
                            backgroundColor: '#c5e1a5',
                            color: '#000000',
                            fontSize: '10px',
                            borderRadius: '30%',
                            '&:hover': { backgroundColor: '#b0d38a' }
                          }}
                          onClick={() => history.push(`/tps/${tp.estado}`)}
                        >
                          Agregar Entrega
                        </Button>
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
            >
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                  component={NavLink}
                  to={`/alumno/curso`}
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
