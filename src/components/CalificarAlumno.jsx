import React, { useState, useEffect } from 'react';
import {  useHistory, useParams } from 'react-router-dom';
import { Card, CardContent, Button, Typography, TextField, Container, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
 } from '@mui/material';
import { getAlumnoById } from '../services/Alumnos';
import { getTpId } from '../services/tps';
import {crearCalificacion} from '../services/Calificacion';
import { SubHeader } from './General/SubHeader';
import { Header} from './General/HeaderProf';

const TpEntrega = () => {
  const { idEntregaAlumno, tpId} = useParams();
 
  const [nota, setNota] = useState('');
  const [tp, setTp] = useState(null);
  const [alumno, setAlumno] = useState([]);
  const [comentario, setComentario] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [hasError, setHasError] = useState(false);
  
  const history = useHistory();
 
  useEffect(() => {
    async function fetchTp() {
      try {
      
        if (tpId) {
          const tpData = await getTpId(tpId);
          setTp(tpData.tp); // Asigna tpData.tp directamente al estado tp

        } else {
          console.error('tpId es undefined');
          setHasError(true);
        }
        const alumnoData = await getAlumnoById(idEntregaAlumno);
        setAlumno(alumnoData);
      } catch (err) {
        setHasError(true);
      }
    }
    fetchTp();
  }, [idEntregaAlumno, tpId]);
  const SubHeader = ({ titulo, nombreTP }) => {
    return (
      <Grid container justifyContent="center" alignItems="center" >
        <Typography variant="h5" component="div">
          <span style={{ color: '#272727' }}>{titulo} </span>
          <span style={{ fontWeight: 'bold', color: '#272727' }}>{nombreTP}</span>
        </Typography>
      </Grid>
    );
  };

  const handleNotaChange = (e) => setNota(e.target.value);
  const handleComentarioChange = (e) => setComentario(e.target.value);

  const handleSave = async () => {
    const calificacionData = {
      archivosSubidos: [], // Ajustar según tus necesidades
      comentarioAlumno: '',
      devolucionProf: comentario,
      calificacion: parseFloat(nota),
      tpId: tpId, // Proporcionar el ID del Trabajo Práctico si está disponible
      alumnoId: idEntregaAlumno,
      grupoId: '', // Proporcionar el ID del grupo si está disponible
    };
    try {
      await crearCalificacion(idEntregaAlumno, calificacionData);
      alert('Calificación guardada con éxito');
      history.goBack();
    } catch (err) {
      console.error('Error al guardar la calificación', err);
    }
  };
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = archivo.url;
    link.download = archivo.nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleEntrega = () => {
    history.push(`/calificaion/${idEntrega}/${profesorId}`);
  };
  const titulo = tp ? `${tp.nombre}` : 'Cargando...';
  
  const tpRendering = () => (
    <Box>
      <Header />
      <Card sx={{ mb:2}}>
        <CardContent>
        <SubHeader titulo="Trabajo Practico:" nombreTP={titulo} />
         
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
                Tp individual
              </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Nombre </TableCell>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Apellido</TableCell>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Dni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    alumno && (
                      <TableRow
                        sx={{ backgroundColor:'rgba(0, 0, 0, 0.08)' }}
                      >
                        <TableCell>{alumno.nombre} </TableCell>
                        <TableCell>{alumno.apellido}</TableCell>
                        <TableCell>{alumno.dni}</TableCell>
                      </TableRow>
                    )
                  }
                </TableBody> 
              </Table>
            </TableContainer>
            <Box mt={2}>
              <Typography variant="h6" component="div" gutterBottom>
                Documento Entregado
              </Typography>
              {archivo && (
                <Button variant="contained" onClick={handleDownload}>
                  Descargar {archivo.nombre}
                </Button>
              )}
            </Box>
            <Box mt={2}>
              <TextField
                label="Nota"
                value={nota}
                onChange={handleNotaChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Comentario"
                value={comentario}
                onChange={handleComentarioChange}
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
            </Box>
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
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={handleSave}
                >
                  Enviar Calificacion
                </Button>
              </Grid>              
            </Grid>
          </Container>
        </CardContent>
      </Card>      
    </Box>
  );

  const loadingRendering = () => <div>Cargando datos del Alumno...</div>;

  const errorRendering = () => <div>Error al cargar los datos del Alumno</div>;

  return hasError ? errorRendering() : !alumno ? loadingRendering() : tpRendering();
};

export default TpEntrega;

