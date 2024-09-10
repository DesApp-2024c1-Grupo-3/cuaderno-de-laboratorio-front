import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
import { getCursoById } from '../services/tps';
import { getTpsByCursoId } from '../services/tps';
import { Header } from './General/HeaderProf';
import { SubHeader } from './General/SubHeader';
import { margin } from '@mui/system';


export default function Tps() {

  const { idCurso, profesorId } = useParams();
  const [dato, setDato] = useState(null);
  const [data, setData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      try {
        const tpsData = await getTpsByCursoId(idCurso);
        const tpsDato = await getCursoById(idCurso);

        setDato(tpsDato);
        setData(tpsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasError(true);
      }
    }

    fetchData();
  }, [idCurso, profesorId]);


  const handleVolver = () => {
    history.push(`/comision/actual/${profesorId}`);
  };

  const handleAdministrarGrupo = () => {
    history.push(`/Administrar_Grupos/${idCurso}/${profesorId}`);
  };

  const handleNuevoTp = () => {
    history.push(`/crearTps/${idCurso}/${profesorId}`);
  };

  const formatFecha = (fechaHora) => {
    const fecha = fechaHora.split('T')[0];
    return fecha;
  };

  const tpsRendering = () => (
    <Box display="flex" flexDirection="column">
      <Header />
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <SubHeader titulo="Trabajos Prácticos" />
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
              {dato.materia} - {dato.comision}
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)'}} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '25%', fontSize: '18px', paddingLeft: '5%' }}>Nombre del TP</TableCell>
                    <TableCell style={{ width: '25%', fontSize: '18px', paddingLeft: '7.7%' }}>Tipo</TableCell>
                    <TableCell style={{ width: '25%', fontSize: '18px', paddingLeft: '6.8%' }}>Estado</TableCell>
                    <TableCell style={{ width: '30%', fontSize: '18px', paddingLeft: '5.8%' }}>Finalización</TableCell>
                    <TableCell style={{ width: '25%', fontSize: '18px', paddingLeft: '8%' }}>Detalles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((tp, index) => (
                    <TableRow
                      key={tp._id}
                      sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                      
                    >
                      <TableCell align="center">{tp.nombre}</TableCell>
                      <TableCell align="center">{tp.grupal === false ? 'Individual':'Grupal'}</TableCell>
                      <TableCell align="center">{tp.estado || 'Desconocido'}</TableCell>
                      <TableCell align="center">{formatFecha(tp.fechaFin)}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: '#c5e1a5',
                            color: '#000000',
                            fontSize: '10px',
                            borderRadius: '5%',
                            marginLeft: '30%',
                            '&:hover': { backgroundColor: '#b0d38a' }
                          }}
                          onClick={() => history.push(`/tp/${idCurso}/${profesorId}/${tp._id}`)}
                        >
                          Ver
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: '#ffb74d',
                            color: '#000000',
                            fontSize: '10px',
                            borderRadius: '5%',
                            marginRight: '5%',
                            '&:hover': { backgroundColor: '#ffa726' }
                          }}
                          onClick={() => history.push(`/modificarTP/${idCurso}/${profesorId}/${tp._id}`)}
                        >
                          Modificar
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
        <Box display="flex" justifyContent="space-between" p={2}>
        <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={handleVolver}
                >
                  Volver
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={handleAdministrarGrupo}
                >
                  Administrar Grupo
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={handleNuevoTp}
                >
                  Nuevo TP
                </Button>
              </Grid>
            </Grid>
            </Box>
      </Card>
    </Box>
  );

  const loadingRendering = () => (
    <div>Cargando TPs...</div>
  );

  const errorRendering = () => (
    <div>Error al cargar los TPs.</div>
  );

  return hasError
    ? errorRendering()
    : !data
      ? loadingRendering()
      : tpsRendering();
}
