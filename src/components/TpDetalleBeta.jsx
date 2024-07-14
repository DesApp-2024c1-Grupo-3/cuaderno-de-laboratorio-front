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
import { Header} from './General/HeaderProf';

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
          //console.log(tpData);
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
  const formatFecha = (fecha) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  };



  //const cambioEstado= ()

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
                <Grid item>
                    <Button variant="contained" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }} 
                      onClick={() => history.goBack()}>
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
              borderWidth: '10px 20px 20px 10px',
              borderColor: 'rgba(0, 0, 0, 0.08)',
              borderRadius: '1%'
            }}
          >
            <Typography variant="h6" component="div" gutterBottom>
              {tp.grupal ? (
                <Typography sx={{fontSize: '1.2vw',fontWeight: 'bold'}}>Grupos</Typography>
              ) : (
                <Typography sx={{fontSize: '1.2vw',fontWeight: 'bold'}}>Alumnos</Typography>
              )}
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>
                      {tp.grupal ? (
                      <Typography sx={{fontSize: '1vw'}}>Nombre de grupo</Typography>
                      ) : (
                      <Typography sx={{fontSize: '1vw'}}>Nombre de alumno</Typography>
                      )}</TableCell>
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
                            onClick={() => history.push(`/calificarGrupo/${grupo._id}/${tpId} `)}
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
                        <TableCell>{ }/ 10</TableCell>
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
                            onClick={() => history.push(`/CalificarAlumno/${alumno._id}/${tpId}`)}
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
            <div style={{ marginTop: '5%' }}>
              <Grid container spacing={2} alignItems="center">
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
              </Grid>
            </div>
          )}
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

  const loadingRendering = () => <div>Cargando detalles del Tp...</div>;

  const errorRendering = () => <div>Error al cargar los detalles del Tp</div>;

  return hasError ? errorRendering() : !tp ? loadingRendering() : tpRendering();
};

export default TpDetalle;
