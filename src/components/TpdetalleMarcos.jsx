import React, { useState, useEffect } from 'react';
import { useHistory, useParams, NavLink } from 'react-router-dom';
import {
  Card, Paper, Typography, TableRow, TableHead, TableContainer, TableCell,
  TableBody, Table, Grid, Box, Button, Container, CardContent, Dialog, 
  DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { getAlumnosByCursoId } from '../services/Alumnos';
import { getCalificacionesByTpId } from '../services/Calificacion';
import { getTpPorId, getCursoPorId, getGruposByTpId, cerrarTp } from '../services/tps';
import { Header } from './General/HeaderProf';


const TpDetalle = () => {
  const { idCurso, profesorId, tpId } = useParams();
  const [tp, setTp] = useState(null);
  const [curso, setCurso] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  // Verifica si el TP está cerrado
  const isTPClosed = tp && tp.estado === 'Cerrado';

  useEffect(() => {
    async function fetchTp() {
      try {
        if (tpId) {
          const tpData = await getTpPorId(idCurso, tpId);
          setTp(tpData);
          console.log('tp', tpData);
          const cursoData = await getCursoPorId(idCurso);
          setCurso(cursoData);
          const alumnos = await getAlumnosByCursoId(idCurso);
          setAlumnos(alumnos);
          const calificacionesData = await getCalificacionesByTpId(tpId);
          setCalificaciones(calificacionesData);
          console.log('Datos de calificaciones', calificacionesData);
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
  }, [idCurso, profesorId, tpId]);

  const getCalificacion = (id, tipo) => {
    // Asegúrate de que calificaciones es un array válido
    if (!calificaciones || !Array.isArray(calificaciones)) {
      return 'No entregado';
    }
  
    // Buscar la calificación asociada al alumno o grupo
    const calificacion = calificaciones.find(c =>
      tipo === 'alumno' ? c.alumnoId === id : c.grupoId === id
    );
  
    // Si hay un comentario pero no hay calificación, marcar como "No asignada"
    if (calificacion && !calificacion.calificacion) {
      return 'No asignada';
    }
  
    // Si hay una calificación válida, mostrarla
    if (calificacion && calificacion.calificacion) {
      return `${calificacion.calificacion} / 10`;
    }
  
    // Si no hay comentario y el estado es 'En marcha', 'En evaluación' o 'Cerrado'
    if (!calificacion && ['En marcha', 'En evaluacion', 'Cerrado'].includes(tp.estado)) {
      return 'No entregado';
    }
  
    // En cualquier otro caso
    return 'No asignada';
  };
  
  

  const SubHeader = ({ titulo, nombreTP }) => {
    return (
      <Grid container justifyContent="center" alignItems="center" >
        <Typography variant="h4" component="div">
          <span sx={{ color: '#272727' }}>{titulo} </span>
          <span sx={{ fontWeight: 'bold', color: '#272727' }}>{nombreTP}</span>
        </Typography>
      </Grid>
    );
  };
  const formatFecha = (fechaHora) => {
    const [year, month, day] = fechaHora.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };


  const handleCerrarTP = async () => {
    if (isTPClosed) {
      alert('El TP ya está cerrado.');
      return;
    }

    // Verificar si hay calificaciones "No asignada" para cualquier alumno/grupo.
    const alumnosSinNota = curso.alumnos.some(alumno => {
      const calificacion = getCalificacion(alumno._id, 'alumno');
      // Permite cerrar si la calificación es "No entregado", pero no si es "No asignada"
      return calificacion === 'No asignada';
    });

    const gruposSinNota = tp.grupos.some(grupo => {
      const calificacion = getCalificacion(grupo._id, 'grupo');
      // Permite cerrar si la calificación es "No entregado", pero no si es "No asignada"
      return calificacion === 'No asignada';
    });

    if (alumnosSinNota || gruposSinNota) {
      alert('No se puede cerrar el TP. Todos los alumnos y grupos deben tener una calificación asignada.');
      return;
    }

    try {
      const response = await cerrarTp(tpId);
      if (response.status === 200) {
        alert('El TP ha sido cerrado exitosamente.');
        history.goBack();
      } else {
        alert('Hubo un error al intentar cerrar el TP.');
      }
    } catch (error) {
      alert('Hubo un error al intentar cerrar el TP.');
    }
  }

  
  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleConfirmClose = async () => {
    await handleCerrarTP();
    setOpen(false);
  };

  const tpRendering = () => (
    <Box>
      <Header />
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <SubHeader titulo="Detalle del TP:" nombreTP={tp.nombre} />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="body1" color="textSecondary">
                Consigna:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2" component="div">
                <div dangerouslySetInnerHTML={{ __html: tp.consigna }} />
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="body1" color="textSecondary">
                Fechas:
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" component="div">
                Inicio: {formatFecha(tp.fechaInicio)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" component="div">
                Fin: {formatFecha(tp.fechaFin)}
              </Typography>
            </Grid>
          </Grid>
          {tp.grupal ? (
            ''
          ) : (
            <Grid container justifyContent="flex-end">
              <Grid item mb={1}>
                <Button variant="contained"
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={() => history.push(`/tps/${idCurso}/${profesorId}`)}>
                  Volver
                </Button>
              </Grid>
            </Grid>
          )}

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
              {tp.grupal ? (
                <Typography sx={{ fontSize: '1.2vw', fontWeight: 'bold' }}>Grupos</Typography>
              ) : (
                <Typography sx={{ fontSize: '1.2vw', fontWeight: 'bold' }}>Alumnos</Typography>
              )}
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '20%', fontSize: '18px', paddingLeft: '7%' }}>
                      {tp.grupal ? (
                        <Typography sx={{ fontWeight: 'bold' }}>Nombre de grupo</Typography>
                      ) : (
                        <Typography sx={{ fontWeight: 'bold' }}>Nombre de alumno</Typography>
                      )}</TableCell>
                    <TableCell style={{ width: '20%', fontSize: '18px', paddingLeft: '9.5%' }}>Estado</TableCell>
                    <TableCell style={{ width: '20%', fontSize: '18px', paddingLeft: '10.5%' }}>Nota</TableCell>
                    <TableCell style={{ width: '20%', fontSize: '18px', paddingLeft: '9.2%' }}>Entrega</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tp.grupal ? (

                    grupos.map((grupo, index) => (
                      <TableRow
                        key={grupo.id}
                        sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                      >
                        <TableCell align="center">{grupo.nombre}</TableCell>
                        <TableCell align="center">{tp.estado}</TableCell>
                        <TableCell align="center">{getCalificacion(grupo._id, 'grupo')}</TableCell>
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
                            onClick={() => history.push(`/calificarGrupo/${grupo._id}/${profesorId}/${tpId}/${idCurso}`)}
                          >
                            Ver
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
                        <TableCell align="center">{alumno.nombre} {alumno.apellido}</TableCell>
                        <TableCell align="center">{tp.estado}</TableCell>
                        <TableCell align="center">{getCalificacion(alumno._id, 'alumno')}</TableCell>
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
                            onClick={() => history.push(`/CalificarAlumno/${alumno._id}/${profesorId}/${tpId}/${idCurso}`)}
                          >
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {tp && curso && (
              <div style={{ marginTop: '5%' }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Mostrar la cantidad de alumnos solo si no hay grupos */}
                  {tp.grupos.length === 0 && (
                    <>
                      <Grid item xs={3}>
                        <Typography variant="body1" color="textSecondary">
                          Cantidad de alumnos:
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" component="div">
                          {curso.alumnos.length}
                        </Typography>
                      </Grid>
                    </>
                  )}

                  {/* Mostrar la cantidad de grupos si existen */}
                  {tp.grupos.length > 0 && (
                    <>
                      <Grid item xs={3}>
                        <Typography variant="body1" color="textSecondary">
                          Cantidad de grupos:
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" component="div">
                          {tp.grupos.length}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </div>
            )}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              {tp && tp.estado === "En evaluacion" && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleClickOpen()}
                style={{
                  backgroundColor: isTPClosed ? 'grey' : 'red',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: isTPClosed ? 'lightgrey' : 'darkred'
                  },
                  cursor: isTPClosed ? 'not-allowed' : 'pointer'
                }}
                disabled={isTPClosed} // Deshabilita el botón si el TP está cerrado
              >
                Cerrar TP
              </Button>
              )}
            </div>
          </Container>
        </CardContent>
        <Grid item mx={2} mb={2}>
          <Button
            component={NavLink}
            to={`/tps/${idCurso}/${profesorId}`}
            variant="contained"
            color="primary"
            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
          >
            Volver
          </Button>
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirmación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro que quieres cerrar el trabajo práctico?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmClose} color="primary">
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );

  const loadingRendering = () => <div>Cargando detalles del Tp...</div>;

  const errorRendering = () => <div>Error al cargar los detalles del Tp</div>;

  return hasError ? errorRendering() : !tp ? loadingRendering() : tpRendering();
};

export default TpDetalle;