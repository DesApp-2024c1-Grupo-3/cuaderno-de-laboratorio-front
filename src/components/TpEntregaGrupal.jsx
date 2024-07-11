import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Card, CardContent, Button, Typography, TextField, Container, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
 } from '@mui/material';
import { getGrupoPorId } from '../services/Grupo';
import { getGruposByTpId } from '../services/tps';

//import { obtenerCalificacionesPorGrupo } '../services/calificacion';
//import {subirArchivo} '../services/calificacion';
import { crearCalificacion } from '../services/Calificacion';

const TpEntrega = () => {
  const { idEntregaGrupal, tpId} = useParams();  
  const [grupo, setGrupo] = useState([]);
  const [alumnos, setAlumnos] = useState([])
  const [nota, setNota] = useState('');
  const [comentario, setComentario] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [hasError, setHasError] = useState(false);
  const history = useHistory();
 
/*   const [calificacionData, setCalificacionData] = useState({
    nota: '',
    comentario: '',
    archivo: null,
  }); */
  


 /*  useEffect(() => {
    const fetchCalificacion = async () => {
      try {
        const data = await getCalificacionById(idCalificacion);
        setCalificacionData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCalificacion();
  }, [idCalificacion]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCalificacionData((prev) => ({ ...prev, [name]: value }));
  };
   */
  useEffect(() => {
    async function fetchTp() {
      try {
        // Obtener la lista de grupos y verificar si el alumno pertenece a algún grupo
        const grupos = await getGruposByTpId(tpId);
                  
        if (grupos) {
          const grupoEncontrado = grupos.find(grupo => 
            grupo.alumnos.some(alumno => alumno._id === idEntregaGrupal)
          );
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
  }, [tpId, idEntregaGrupal]);
  //console.log('Grupos obtenido aca:', grupo._id);

 /*  const verificarArchivo = async (grupoId) => {
    try {
      const calificaciones = await obtenerCalificacionesPorGrupo(grupoId); // Define esta función en tu servicio
      if (calificaciones.length > 0) {
        setArchivoCargado(true);
      }
    } catch (err) {
      setHasError(true);
    }
  }; */

  const handleNotaChange = (e) => setNota(e.target.value);
  const handleComentarioChange = (e) => setComentario(e.target.value);
  const handleArchivoChange = (e) => setArchivos(Array.from(e.target.files));
   /*
    = (e) =>  {  if (archivoCargado) {
      alert('Ya se ha cargado un archivo para este grupo');
      return;
    }
    setArchivo(e.target.files[0]);
  }; 
 */
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
  const entregaRendering = () => (
    <Box>
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
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Nombre </TableCell>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Apellido</TableCell>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Dni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    alumnos.map((integrante, index) => (
                      <TableRow
                        key={integrante.id}
                        sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                      >
                        <TableCell>{integrante.nombre}</TableCell>
                        <TableCell>{integrante.apellido }</TableCell>
                        <TableCell>{integrante.dni}</TableCell>
                        
                      </TableRow>
                    ))
                 }
                </TableBody> 
              </Table>
            </TableContainer>
            <Box mt={2}>
              <Typography variant="h6" component="div" gutterBottom>
                Entrega de documento - Un solo integrante del grupo puede hacer la carga.
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

  const loadingRendering = () => <div>Cargando detalles de entrega...</div>;

  const errorRendering = () => <div>Error al cargar los datos de entrega</div>;

  return hasError ? errorRendering() : !grupo ? loadingRendering() : entregaRendering();
};

export default TpEntrega;