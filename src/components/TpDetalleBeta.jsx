import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { getAlumnosByCursoId } from '../services/Alumnos';
import { getTpPorId, getCursoPorId, getGruposByTpId } from '../services/tps';
import { SubHeader } from './General/SubHeader';

const TpDetalle = () => {
  const { idCurso, tpId } = useParams();
  const [tp, setTp] = useState(null);
  const [curso, setCurso] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [hasError, setHasError] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function fetchTp() {
      try {
        if (tpId) {
          const tpData = await getTpPorId(idCurso, tpId);
          setTp(tpData);
          const cursoData = await getCursoPorId(idCurso);
          setCurso(cursoData);
          const alumnos = await getAlumnosByCursoId(idCurso);
          setAlumnos(alumnos);
          if (tpData.grupal) {
            // Suponiendo que tienes un servicio para obtener los grupos por TP
            const gruposData = await getGruposByTpId(tpId); 
            setGrupos(gruposData);
          }
        } else {
          console.error('tpId es undefined');
          setHasError(true);
        }
      } catch (err) {
        setHasError(true);
      }
    }
    fetchTp();
  }, [idCurso, tpId]);

  const formatFecha = (fechaHora) => {
    const fecha = fechaHora.split('T')[0]; // Divide la fecha y la hora y toma solo la parte de la fecha
    return fecha;
  };
  //const cambioEstado= ()

  const tpRendering = () => (
    <Box>
      <Card sx={{ mb:2}}>
        <CardContent>
          <SubHeader titulo="Detalle" />
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
              TP {tp.nombre}
            </Typography>  
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Nombre del TP</TableCell>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Estado</TableCell>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Nota</TableCell>
                    <TableCell style={{ width: '15%', fontSize: '15px' }}>Entrega</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tp.grupal ? (
                    grupos.map((grupo, index) => (
                      <TableRow
                        key={grupo.id}
                        sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                      >
                        <TableCell>{grupo.nombre}</TableCell>
                        <TableCell>{grupo.estado || 'Desconocido'}</TableCell>
                        <TableCell>{grupo.calificacion}/ 10</TableCell>
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
                            onClick={() => history.push(`/entregaGrupo/${grupo._id}`)}
                          >
                            Ver entrega
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    alumnos.map((alumno, index) => (
                      <TableRow
                        key={alumno.id}
                        sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                      >
                        <TableCell>{alumno.nombre} {alumno.apellido}</TableCell>
                        <TableCell>{alumno.estado || 'Desconocido'}</TableCell>
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
                            onClick={() => history.push(`/entregaAlumno/${alumno._id}`)}
                          >
                            Ver entrega
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody> 
              </Table>
            </TableContainer>
            {tp && curso && (
              <div>
                
                <h3>fechaInicio: {formatFecha(tp.fechaInicio)}</h3> {/* Muestra solo la fecha */}
               {/* <h3>fechaFin: {formatFecha(tp.fechaFin)}</h3>  Muestra solo la fecha */}
                {curso.alumnos && (
                  <h3>Cantidad alumnos: {curso.alumnos.length}</h3>
                )}
                {tp.grupos && (
                  <h3>Cantidad grupos: {tp.grupos.length}</h3>
                )}
                {tp.consigna && (
                  <div>
                    <h3>Consigna:</h3>
                    <div dangerouslySetInnerHTML={{ __html: tp.consigna }} />
                  </div>                    
                )}
                </div>
            )}
            <Grid container 
              spacing={2} 
              justifyContent="space-between"
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

  const loadingRendering = () => <div>Cargando detalles del Tp...</div>;

  const errorRendering = () => <div>Error al cargar los detalles del Tp</div>;

  return hasError ? errorRendering() : !tp ? loadingRendering() : tpRendering();
};

export default TpDetalle;
