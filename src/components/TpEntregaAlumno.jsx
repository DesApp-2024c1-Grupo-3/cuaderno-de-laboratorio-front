import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { Card, CardContent, Button, Typography, TextField, Container, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
 } from '@mui/material';
import { getAlumnoById } from '../services/Alumnos';
import {crearCalificacion} from '../services/Calificacion';

const TpEntrega = () => {
  const { idEntregaAlumno, tpId} = useParams();
  const [nota, setNota] = useState('');
  const [alumno, setAlumno] = useState([]);
  const [comentario, setComentario] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [hasError, setHasError] = useState(false);
  
  const history = useHistory();
 
  useEffect(() => {
    async function fetchTp() {
      try {
        const alumnoData = await getAlumnoById(idEntregaAlumno);
        setAlumno(alumnoData);
              
      } catch (err) {
        setHasError(true);
      }

    }
    fetchTp();
  }, [idEntregaAlumno]);

  const handleNotaChange = (e) => setNota(e.target.value);
  const handleComentarioChange = (e) => setComentario(e.target.value);
  const handleArchivoChange = (e) => setArchivos(Array.from(e.target.files));

  const handleSave = async () => {
    try {
      const formData = new FormData();
      //formData.append('file', archivo);
      archivos.forEach((archivo, index) => {
        formData.append('file', archivo);
      });
      formData.append('comentarioAlum', comentario);
      formData.append('tpId', tpId);
      formData.append('alumnoId', idEntregaAlumno);
      

      await crearCalificacion(formData);
      alert('Calificación guardada con éxito');
      history.goBack();
    } catch (err) {
      console.error('Error al guardar', err);
    }
  };
  
  const tpRendering = () => (
    <Box>
      <Card sx={{ mb:2}}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
              Entrega Individual
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
            Tp Moderno
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
                Entrega de documento 
              </Typography>
              <Button variant="contained" component="label">
                Subir archivos
                <input type="file" hidden multiple onChange={handleArchivoChange} />
              </Button>
              {archivos && archivos.map((archivo, index) => (
                <Typography variant="body2" key={index}>{archivo.name}</Typography>
              ))}
            </Box>
            <Box mt={2}>
              {nota && <TextField
                label="Nota"
                value={nota}
                onChange={handleNotaChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />}
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
                  Cargar TP
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
