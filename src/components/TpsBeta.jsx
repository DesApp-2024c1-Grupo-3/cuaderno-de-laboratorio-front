import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
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
import { getTpsByCursoId } from '../services/tps';
import { SubHeader } from './General/SubHeader';

export default function Tps() {
  const { idCurso, profesorId } = useParams();
  const [tps, setTps] = useState(null);
  const [hasError, setHasError] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      try {
        const tpsData = await getTpsByCursoId(idCurso);
        setTps(tpsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasError(true);
      }
    }

    fetchData();
  }, [idCurso]);

  const handleVolver = () => {
    history.push(`/comision`);
  };

  const handleAdministrarGrupo = () => {
    // Lógica para administrar grupo
    history.push(`/Administrar_Grupos/${idCurso}`)
  };

  const handleNuevoTp = () => {
    // Lógica para crear un nuevo TP
    history.push(`/crearTps/${idCurso}/${profesorId}`)
  };

  const tpsRendering = () => (
    <Box display="flex" flexDirection="column">
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <SubHeader titulo="Matematicas" />

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
              Tps - Comision
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Nombre del TP</TableCell>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Estado</TableCell>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Descripción</TableCell>
                    <TableCell style={{ width: '15%', fontSize: '15px' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tps.map((tp, index) => (
                    <TableRow
                      key={tp._id}
                      sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                    >
                      <TableCell>{tp.nombre}</TableCell>
                      <TableCell>{tp.estado}</TableCell>
                      <TableCell>{tp.finalizacion}</TableCell>
                      <TableCell>

                        <Button variant="contained"
                          sx={{
                            backgroundColor: '#c5e1a5',
                            color: '#000000',
                            fontSize: '10px',
                            borderRadius: '30%',
                            '&:hover': { backgroundColor: '#b0d38a' }
                          }}
                          onClick={() => history.push(`/tp/${idCurso}/${profesorId}/${tp._id}`)}>Detalles</Button>
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
                <Button variant="contained"
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={handleVolver}>Volver</Button>
              </Grid>
              <Grid item>
                <Button variant="contained"
                  sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={handleAdministrarGrupo}>Administrar Grupo</Button>
              </Grid>
              <Grid item>
                <Button variant="contained"
                  sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={handleNuevoTp}>Nuevo TP</Button>
              </Grid>
            </Grid>
          </Container>
        </CardContent>
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
    : !tps
      ? loadingRendering()
      : tpsRendering();
}



//onClick={() => history.push(`/tp/${idCurso}/${profesorId}/${tp._id}`)}>Detalles</Button>