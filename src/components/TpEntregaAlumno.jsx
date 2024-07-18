import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { Card, CardContent, Button, Typography, TextField, Container, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
 } from '@mui/material';
import { getAlumnoById } from '../services/Alumnos';
import { crearCalificacion,
         getComAlumnIndByCalifId,
         postEliminarCalificacion 
} from '../services/Calificacion';
import { Header} from './General/HeaderAlum';

const TpEntrega = () => {
  const { idEntregaAlumno, alumnoId, tpId} = useParams();
  const [nota, setNota] = useState('');
  const [alumno, setAlumno] = useState([]);
  const [comProfe, setComentarioProfe] = useState('');
  const [comentario, setComentario] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [hasError, setHasError] = useState(false);
  
  const history = useHistory();
 
  useEffect(() => {
    async function fetchTp() {
      try {
        const alumnoData = await getAlumnoById(idEntregaAlumno);
        setAlumno(alumnoData);
        try {
          const califData = await getComAlumnIndByCalifId(idEntregaAlumno, tpId);
          setComentarioProfe(califData );
          setNota(califData.calificacion);
          
          console.log(califData)
          console.log( califData.calificacion)
         
        } catch (error) {
          if (error.response && error.response.status === 404 || error.response.status === 500) {
            setComentarioProfe('');
          }
        }         
              
      } catch (err) {
        setHasError(true);
      }

    }
    fetchTp();
  }, [idEntregaAlumno, alumnoId]);

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
      alert('Entrega realizada con éxito');
      history.goBack();
    } catch (err) {
      console.error('Error al guardar', err);
    }
  };
  const deleteCalificacion = async (id) => {
    try {
      await postEliminarCalificacion(id);
      alert(' eliminada con éxito');
      history.goBack();
      } catch (error) {
      console.error('Error al eliminar la calificaion del alumno:', error);
    }
  };
  //console.log(comProfe)
  
  const tpRendering = () => (
    <Box>
      <Header />
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
            Tp
            </Typography>  
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '33%', fontSize: '18px', paddingLeft: '14%' }}>Nombre </TableCell>
                    <TableCell style={{ width: '33%', fontSize: '18px', paddingLeft: '13.5%' }}>Apellido</TableCell>
                    <TableCell style={{ width: '33%', fontSize: '18px', paddingLeft: '15%' }}>Dni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    alumno && (
                      <TableRow
                        sx={{ backgroundColor:'rgba(0, 0, 0, 0.08)' }}
                      >
                        <TableCell align="center">{alumno.nombre} </TableCell>
                        <TableCell align="center">{alumno.apellido}</TableCell>
                        <TableCell align="center">{alumno.dni}</TableCell>
                      </TableRow>
                    )
                  }
                </TableBody> 
              </Table>
            </TableContainer>
            <Box mt={2}>
              <Typography variant="h6" component="div" gutterBottom>
                {!comProfe && ('Entrega de Trabajo practico')}
              </Typography>
               {!comProfe &&( <Button variant="contained" component="label" sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}>
                  Subir archivos
                  <input type="file" hidden multiple onChange={handleArchivoChange} />
                </Button>)}
              {archivos && archivos.map((archivo, index) => (
                <Typography variant="body2" key={index}>{archivo.name}</Typography>
              ))}
              <Typography variant="h6">
                {comProfe.comentarioAlum &&("Comentario Del Alumno: ") }
                <Typography marginLeft={2}>
                  {comProfe.comentarioAlum}
                </Typography>
              </Typography>
              <br/>
            </Box>
            <Box mt={2}>
             {!comProfe &&(nota && <TextField
                label="Nota"
                value={nota}
                
                variant="outlined"
                fullWidth
                margin="normal"
              />)}
              
              {!comProfe && (
              <TextField
                label="Comentario"
                value={comentario}
                onChange={handleComentarioChange}
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
            />)}
            {comProfe.calificacion &&( 
              <Grid container spacing={2} alignItems="center">              
                <Grid item xs={4}>
                  <Typography variant="h6" component="div" gutterBottom>
                  Nota: {comProfe.calificacion}
                  </Typography>
                  <Typography variant="h6" component="div" gutterBottom>
                      Devolucion del Profesor : 
                    <Typography marginLeft={2}>
                      {comProfe.devolucionProf}
                    </Typography>
                  </Typography>
                </Grid>
              </Grid> 
            )}{ comProfe.calificacion || comProfe && (
            <Grid item>
               <Button
                  variant="contained"
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={
                    () => deleteCalificacion(comProfe._id)
                     
                  }
                >
                  Eliminar entrega
                  </Button>
              </Grid>
            )}  
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
                {!comProfe && (<Button
                  variant="contained"
                  sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={handleSave}
                >
                  Cargar TP
                </Button>)}
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
