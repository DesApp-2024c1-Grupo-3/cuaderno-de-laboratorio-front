import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { Card, CardContent, Button, Typography, TextField, Container, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
 } from '@mui/material';
import { getAlumnoById } from '../services/Alumnos';
import { getTpPorId} from '../services/tps';
import { getGrupoPorId, updateNotaEntrega, getArchivoEntrega } from '../services/Grupo';
import { SubHeader } from './General/SubHeader';

const TpEntrega = () => {
  const { idEntrega, idCurso, tpId} = useParams();

  console.log(idEntrega);
  console.log(idCurso);
  console.log(tpId);
  const [tp, setTp] = useState(null);
  const [grupo, setGrupo] = useState([]);
  const [nota, setNota] = useState('');
  const [alumno, setAlumno] = useState(null);
  const [comentario, setComentario] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [hasError, setHasError] = useState(false);
  
  const history = useHistory();
 
  useEffect(() => {
    async function fetchTp() {
      try {
        const tpData = await getTpPorId(idCurso, tpId);
        console.log(tpData),
        setTp(tpData);
        
        const gruposData = await getGrupoPorId(idEntrega); 
        setGrupo(gruposData);
        setComentario(gruposData.comentario || '');

        const notaData = await updateNotaEntrega(idEntrega)
        setNota(notaData.nota || '');
        
        const alumnoData = await getAlumnoById(idEntrega);
        console.log(alumnoData);
        setAlumno(alumnoData);
      
                
        const archivoData = await getArchivoEntrega(idEntrega);
        setArchivo(archivoData);
      } catch (err) {
        setHasError(true);
      }
    }
    fetchTp();
  }, [idCurso, tpId, idEntrega]);
  console.log(alumno);
  //console.log(alumno.nombre);

  const handleNotaChange = (e) => setNota(e.target.value);
  const handleComentarioChange = (e) => setComentario(e.target.value);

  const handleSave = async () => {
    try {
      await updateNotaEntrega(idEntrega, { nota, comentario });
      alert('Nota guardada con éxito');
    } catch (err) {
      console.error('Error al guardar la nota', err);
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

  const tpRendering = () => (
    <Box>
      <Card sx={{ mb:2}}>
        <CardContent>
          <SubHeader titulo="Tp sucio" />
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
                  {tp? (
                    console.log(tp.grupal),
                    grupo.map((integrante, index) => (
                      <TableRow
                        key={integrante.id}
                        sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                      >
                        <TableCell>{integrante.nombre}</TableCell>
                        <TableCell>{integrante.apellido }</TableCell>
                        <TableCell>{integrante.dni}</TableCell>
                        
                      </TableRow>
                    ))
                  ) : (
                    alumno && (
                    
                      <TableRow
                        
                        sx={{ backgroundColor:'rgba(0, 0, 0, 0)' }}
                      >
                        <TableCell>{alumno.nombre} </TableCell>
                        <TableCell>{alumno.apellido}</TableCell>
                        <TableCell>{alumno.dni}</TableCell>
                        <TableCell>
                          
                          
                        </TableCell>
                      </TableRow>
                    )
                  )}
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
                  onClick={handleEntrega}
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

  const loadingRendering = () => <div>Cargando detalles del Tp...</div>;

  const errorRendering = () => <div>Error al cargar los detalles del Tp</div>;

  return hasError ? errorRendering() : !grupo ? loadingRendering() : tpRendering();
};

export default TpEntrega;
