import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Container, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Grid
} from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
import { getCalificaciones } from '../services/Calificacion';
import { getCursoById, getTpsByCursoId, getGruposByTpId } from '../services/tps';
import { Header } from './General/HeaderAlum';

const AlumnoTps = () => {
  const history = useHistory();
  const { idCurso, alumnoId } = useParams();
  const [dato, setDato] = useState([]);
  const [data, setData] = useState(null);
  const [calificaciones, setCalificaciones] = useState([]);
  
  const handleBack = () => {
    history.push(`/alumno/curso/${alumnoId}`);  // Cambia a la ruta que prefieras
  };
  console.log("calificaciones:", calificaciones)
  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener los TPs y el curso
        const tpsData = await getTpsByCursoId(idCurso);
        const tpsDato = await getCursoById(idCurso);
        console.log("tpsDatos:", tpsDato)
        console.log("tpsData:", tpsData)
        setDato(tpsDato);

        // Filtrar los TPs que no estén en estado "Futuro"
        const tpsFiltered = tpsData.filter(tp => tp.estado !== 'Futuro');
        let tpsParaMostrar = [];
        // Recorrer los TPs filtrados
        // Crear una lista de promesas para los TPs
        const promesas = tpsFiltered.map(async (tp) => {
          try {
            // Obtener los grupos para cada TP filtrado
            const grupos = await getGruposByTpId(tp._id);

            if (!tp.grupal) {
              // Si el TP es individual, agregarlo directamente a la lista
              tpsParaMostrar.push(tp);

            } else {
              // Si el TP es grupal, verificar si el alumno está en algún grupo
              const grupoEncontrado = grupos.find(grupo =>
                grupo.alumnos.some(alumno => alumno._id === alumnoId)
              );

              if (grupoEncontrado) {
                tpsParaMostrar.push(tp); // Agregar el TP a la lista

              }
            }
          } catch (error) {
            console.error("Error al obtener los grupos para el TP", tp._id, error);
          }
        });

        // Esperar a que todas las promesas se resuelvan
        Promise.all(promesas).then(() => {
          // Actualizar el estado con los TPs filtrados
          setData(tpsParaMostrar);

        });



        // Obtener calificaciones
        const califData = await getCalificaciones(alumnoId);
        setCalificaciones(califData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [idCurso, alumnoId]);



  const getCalificacion = (idTp, estado, comentarios) => {
    if (!comentarios || !Array.isArray(comentarios)) {
      return 'No asignada';
    }
  
    // Verificar si existe un comentario para este TP
    const comentario = comentarios.find(c => c.tpId === idTp);
  
    if (!comentario) {
      // Si no hay comentario, retornar "No entregado" para estados distintos a "En marcha"
      return estado !== 'En marcha' ? 'No entregado' : 'No asignada';
    }
  
    // Si hay comentario, verificar la calificación
    return comentario.calificacion || 'No asignada';
  };
  
  

  
  const formatFecha = (fechaHora) => {
    const fecha = fechaHora.split('T')[0];
    return fecha;
  };
  const obtenerFechaActual = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
  };
  
  const compararFechas = (fechaFin) => {
    const fechaActual = obtenerFechaActual();
    const fechaFinFormateada = formatFecha(fechaFin);
  
    if (fechaFinFormateada === fechaActual) {
      return "La fecha es hoy";
    } else if (fechaFinFormateada > fechaActual) {
      return "La fecha es futura";
    } else {
      return "No entregada";
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <Header />
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Comision - {dato.comision}
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
              {dato.materia}
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '20%', fontSize: '18px', paddingLeft: '4%' }}>Nombre del TP</TableCell>
                    <TableCell style={{ width: '20%', fontSize: '18px', paddingLeft: '7%' }}>Tipo</TableCell>
                    <TableCell style={{ width: '20%', fontSize: '18px', paddingLeft: '6%' }}>Estado</TableCell>
                    <TableCell style={{ width: '20%', fontSize: '18px', paddingLeft: '4.5%' }}>Finalización</TableCell>
                    <TableCell style={{ width: '20%', fontSize: '18px', paddingLeft: '7%' }}>Nota</TableCell>
                    <TableCell style={{ width: '20%', fontSize: '18px', paddingLeft: '2.5%' }}>Entrega</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((tp, index) => (

                    <TableRow
                      key={tp._id}
                      sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                    >
                      <TableCell align="center">{tp.nombre}</TableCell>
                      <TableCell align="center">{tp.grupal === false ? 'Individual' : 'Grupal'}</TableCell>
                      <TableCell align="center">{tp.estado}</TableCell>
                      <TableCell align="center">{formatFecha(tp.fechaFin)}</TableCell>
                      <TableCell align="center">
                        {getCalificacion(tp._id, tp.estado, calificaciones) === 'No entregado' ? 
                          'No entregado' : 
                          getCalificacion(tp._id, tp.estado, calificaciones) !== 'No asignada' && tp.estado === 'Cerrado' ? 
                            `${getCalificacion(tp._id, tp.estado, calificaciones)} / 10` : 
                            'No asignada'}
                      </TableCell>



                      <TableCell align="center">
                        {!tp.grupal ? (
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: '#c5e1a5',
                              color: '#000000',
                              fontSize: '10px',
                              borderRadius: '5%',
                              '&:hover': { backgroundColor: '#b0d38a' }
                            }}
                            onClick={() => history.push(`/entregaAlumno/${alumnoId}/${tp._id}/${idCurso}`)}
                          >
                            {(tp.estado === 'En evaluacion') || (tp.estado === 'Cerrado') ? 'Ver' : 'Agregar'}{/* ARREGLAR*/}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: '#c5e1a5',
                              color: '#000000',
                              fontSize: '10px',
                              borderRadius: '5%',
                              '&:hover': { backgroundColor: '#b0d38a' }
                            }}
                            onClick={() => history.push(`/entregaGrupo/${alumnoId}/${tp._id}/${idCurso}`)}
                          >
                            {(tp.estado === 'En evaluacion') || (tp.estado === 'Cerrado') ? 'Ver' : 'Agregar'}{/* ARREGLAR*/}
                          </Button>
                        )
                        }
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
          <>
          <Grid item>
            <Button
              onClick={handleBack}
              variant="contained"
              sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}S
            >
              Volver
            </Button>
          </Grid>
          </>
        </Grid>
      </Card>
    </Box>
  );


};
export default AlumnoTps;
