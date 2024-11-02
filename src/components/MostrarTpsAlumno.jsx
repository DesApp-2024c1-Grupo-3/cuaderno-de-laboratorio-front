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
  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener los TPs y el curso
        const tpsData = await getTpsByCursoId(idCurso);
        const tpsDato = await getCursoById(idCurso);
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



  const getCalificacion = (idTp) => {
    // Asegúrate de que calificaciones esté definido y sea un array antes de buscar
    if (!calificaciones || !Array.isArray(calificaciones)) {
      return 'No asignada';  // o un valor por defecto adecuado
    }
    const calificacion = calificaciones.find(c =>
      c.tpId === idTp);
    // Retorna la calificación si se encuentra, o un mensaje por defecto
    return calificacion && calificacion.calificacion ? calificacion.calificacion : 'No asignada';
  };
  const estadoTp = (idTp) => {
    if (!calificaciones || !Array.isArray(calificaciones)) {
      return 'No asignada';  // o un valor por defecto adecuado
    }
    const calificacion = calificaciones.find(c => c.tpId === idTp);
    if (calificacion && calificacion.calificacion) {
      return 'Cerrado';
    } else if (calificacion && !calificacion.calificacion) {
      return 'En evaluación';
    } else {
      return 'En marcha';
    }
  }
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
                      <TableCell align="center">{estadoTp(tp._id) || 'Desconocido'}</TableCell>
                      <TableCell align="center">{formatFecha(tp.fechaFin)}</TableCell>
                      <TableCell align="center">{getCalificacion(tp._id) !== 'No asignada' ?
                        `${getCalificacion(tp._id)} / 10` : 'No asignada'}</TableCell>

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
                            {(estadoTp(tp._id) === 'En evaluación') || (estadoTp(tp._id) === 'Cerrado') ? 'Ver' : 'Agregar'}
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
                            {(estadoTp(tp._id) === 'En evaluación') || (estadoTp(tp._id) === 'Cerrado') ? 'Ver' : 'Agregar'}
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
