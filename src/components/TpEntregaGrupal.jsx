import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Card, CardContent, Button, Typography, TextField, Container, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
 } from '@mui/material';
import { getGrupoPorId } from '../services/Grupo';
import { getGruposByTpId } from '../services/tps';
import { crearCalificacion,
         getComAlumnIndByCalifId,
         postEliminarCalificacion 
        } from '../services/Calificacion';
import { Header} from './General/HeaderAlum';

const TpEntrega = () => {
  const { idEntregaGrupal, alumnoId, tpId} = useParams();  
  const [grupo, setGrupo] = useState([]);
  const [alumnos, setAlumnos] = useState([])
  const [nota, setNota] = useState('');
  const [comProfe, setComentarioProfe] = useState('');
  const [comentario, setComentario] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [hasError, setHasError] = useState(false);
  const history = useHistory();
  console.log(idEntregaGrupal)
  console.log( tpId)

  useEffect(() => {
    async function fetchTp() {
      try {
        // Obtener la lista de grupos y verificar si el alumno pertenece a algún grupo
        const grupos = await getGruposByTpId(tpId);
        try {
          const califData = await getComAlumnIndByCalifId(idEntregaGrupal, tpId);
          setComentarioProfe(califData );
          setNota(califData.calificacion);
          
          console.log(califData)
          console.log( califData.calificacion)
         
        } catch (error) {
          if (error.response && error.response.status === 404 || error.response.status === 500) {
            setComentarioProfe('');
          }
        }          
        if (grupos) {
          const grupoEncontrado = grupos.find(grupo => 
            grupo.alumnos.some(alumno => alumno._id === idEntregaGrupal)
          );
          console.log(grupoEncontrado)
          if (grupoEncontrado) {
            setGrupo(grupoEncontrado);
            const alumnosData= await getGrupoPorId(grupoEncontrado._id);
            setAlumnos(alumnosData);
          } else {
            console.log('No se encontró un grupo para el alumno:', idEntregaGrupal);
          }
        }
      } catch (err) {
        setHasError(true);
      }
    }
    fetchTp();
  }, [tpId, idEntregaGrupal, alumnoId]);
 
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
      formData.append('alumnoId', idEntregaGrupal);
      formData.append('grupoId', grupo._id);

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
  const entregaRendering = () => (
    <Box>
      <Header />
      <Card sx={{ mb:2}}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
              Entrega grupal
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
              {grupo.nombre}
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
                    alumnos.map((integrante, index) => (
                      <TableRow
                        key={integrante.id}
                        sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                      >
                        <TableCell align="center">{integrante.nombre}</TableCell>
                        <TableCell align="center">{integrante.apellido }</TableCell>
                        <TableCell align="center">{integrante.dni}</TableCell>
                        
                      </TableRow>
                    ))
                 }
                </TableBody> 
              </Table>
            </TableContainer>
            <Box mt={2}>
              <Typography variant="h6" component="div" gutterBottom>
                {!comProfe ? 'Entrega - Un solo integrante del grupo puede hacer la carga.': 'Trabajo practico entregado'}
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

  const loadingRendering = () => <div>Cargando detalles de entrega...</div>;

  const errorRendering = () => <div>Error al cargar los datos de entrega</div>;

  return hasError ? errorRendering() : !grupo ? loadingRendering() : entregaRendering();
};

export default TpEntrega;
