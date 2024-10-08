import React, { useState, useEffect } from 'react';
import {  useHistory, useParams } from 'react-router-dom';
import { Card, CardContent, Button, Typography, TextField, Container, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle  
 } from '@mui/material';
import { getAlumnoById } from '../services/Alumnos';
import { getTpId } from '../services/tps';
import {getComAlumnIndByCalifId,updateCalificacion,postEliminarCalificacion} from '../services/Calificacion';
import { Header} from './General/HeaderProf';

const TpEntrega = () => {
  const { idEntregaAlumno, profesorId, tpId} = useParams();
 
  const [nota, setNota] = useState('');
  const [tp, setTp] = useState(null);
  const [alumno, setAlumno] = useState([]);
  const [comAlumno, setComentarioAlum]= useState('');
  const [comentario, setComentario] = useState('');
  const [archivo, setArchivo] = useState('');
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);//LOGICA PARA WARNING ELIMINACION
  const [editMode, setEditMode] = useState(false);


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
      try {
        const califData = await getComAlumnIndByCalifId(idEntregaAlumno, tpId);
        setComentarioAlum(califData || '');
        if (califData.file && califData.file.length > 0) {
          const archivos = califData.file.map((file, index) => {
              
            if (file && file.data) {
              // Convertimos el array de bytes a Uint8Array
              const byteArray = new Uint8Array(file.data);
              // Creamos el Blob
              const blob = new Blob([byteArray], { type: califData.fileType[index] });
              
              // Generamos la URL del Blob
              const url = URL.createObjectURL(blob);
          
              // Si no hay nombre en `fileName`, generamos un nombre por defecto
              const nombreArchivo = califData.fileName ? califData.fileName[index] : `archivo_${index + 1}.pdf`;
          
              // Devolvemos el archivo con su URL y nombre
              return {
                url: url,
                nombre: nombreArchivo,  // Nombre del archivo
              };
            }
          
            return null;
          }).filter(item => item !== null);  // Filtramos los elementos nulos
          
          // Actualizamos el estado con los archivos procesados
          setArchivo(archivos);
                 
        }
   
      } catch (error) {
        if (error.response && error.response.status === 404 || error.response.status === 500) {
          setComentarioAlum('');
        }
      }
    }
   
    fetchTp();
  }, [idEntregaAlumno, profesorId, tpId]);

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
  const deleteCalificacion = async (id) => {
    try {
      await postEliminarCalificacion(id);
      } catch (error) {
      console.error('Error al eliminar la calificaion del alumno:', error);
    }
  };
  const handleClickOpen = () => {//LOGICA PARA WARNING ELIMINACION
    setOpen(true);
  };
  const handleClose = () => {//LOGICA PARA WARNING ELIMINACION
    setOpen(false);
  };
  const handleConfirmDelete = async () => {//LOGICA PARA WARNING ELIMINACION
    await deleteCalificacion(comAlumno._id);
    setOpen(false);
    window.location.reload();
  };

  const handleNotaChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 1 && Number(value) <= 10)) {
      setNota(value);}
  };

  const handleComentarioChange = (e) => setComentario(e.target.value);

  const handleSave = async () => {
    const calificacionData = {
      devolucionProf: comentario,
      calificacion: parseFloat(nota),
    };
    try {
      await updateCalificacion(comAlumno._id, calificacionData);
      setEditMode(false);
      alert('Calificación guardada con éxito');
      history.goBack();
    } catch (err) {
      console.error('Error al guardar la calificación', err);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };
  
  const handleDownload = (archivo) => {
    const link = document.createElement('a');
    link.href = archivo.url;
    link.download = archivo.nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const formatFecha = (fecha) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  };
  const titulo = tp ? `${tp.nombre}` : 'Cargando...';
  
  const tpRendering = () => (
    <Box>
      <Header />
      <Card sx={{ mb:2}}>
        <CardContent>
        <div>
            <SubHeader titulo="Título:" nombreTP={titulo} />
            {/* Verifica si tp existe antes de mostrar la consigna y la fecha de fin */}
            {tp && (
              <>
                <Grid container alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="body1" color="textSecondary">
                      Descripción:
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" component="div">
                      {tp.consigna ? (
                        <div dangerouslySetInnerHTML={{ __html: tp.consigna }} />
                      ) : (
                        'No hay consigna'
                      )}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="body1" color="textSecondary">
                      Fecha de fin:
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" component="div">
                      {tp.fechaFin ? formatFecha(tp.fechaFin) : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
          </div>
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
                Tp individual
              </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '33%', fontSize: '18px', paddingLeft: '14%'}}>Nombre </TableCell>
                    <TableCell style={{ width: '33%', fontSize: '18px', paddingLeft: '13.5%'}}>Apellido</TableCell>
                    <TableCell style={{ width: '33%', fontSize: '18px', paddingLeft: '15%'}}>Dni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    alumno && (
                      <TableRow
                        sx={{ backgroundColor:'rgba(0, 0, 0, 0.08)' }}
                      >
                        <TableCell align="center">{alumno.nombre}</TableCell>
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
                {comAlumno ? 'Documento entregado' : 'Documento no entregado. El trabajo practico no fue entregado'}
              </Typography>
              {archivo && archivo.length > 0 && (
                <>
                 
                  {archivo.map((archivo, index) => (
                    <a key={index} href={archivo.url} download={archivo.nombre}>
                      Descargar {archivo.nombre}
                      <br/>
                    </a>
                     
                  ))}
                
                </>
              )}

              {comAlumno && (
                <>
                   
                  <Typography variant="h6">
                    Comentario:
                    <Typography marginLeft={2} variant="h6">
                      {comAlumno.comentarioAlum}
                    </Typography>
                  </Typography>
                         
                 
                </>
              )}
            </Box>
            <Box mt={2} sx={{ display: 'flex' }}>
            <Grid container>
              {(nota !== '') && (
                <>
                  <Grid item xs={8}>
                    <Typography variant="h6" component="div" gutterBottom>
                      Nota: {comAlumno.calificacion}
                      <Typography variant="h6" component="div" gutterBottom>
                      Devolución: {comAlumno.devolucionProf}
                    </Typography>
                    </Typography>
                  </Grid>
                </>
              )}
              {((nota === '') && !editMode && comAlumno) && (
                  <Grid item xs={8}>
                    <Typography variant="h6" component="div" gutterBottom>
                      Aun no se ha calificado.
                    </Typography>
                  </Grid>
              )}
              {(editMode) && (
                <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>  
                  <TextField
                    label="Nota"
                    value={nota}
                    onChange={handleNotaChange}
                    variant="outlined"
                    fullWidth="true"
                    margin="normal"
                    inputProps={{ type: 'number', min: 1, max: 10 }}
                    autoComplete='off'
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
                    autoComplete='off'
                  />
                </Grid>
                </Grid>
              )}
              </Grid>
            </Box>
          </Container>
        </CardContent>
          {!comAlumno && (
                <>
                  <Grid item mx={2}>
                    <Button
                      onClick={() => history.goBack()}
                      variant="contained"
                      color="primary"
                      sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                    >
                      Volver
                    </Button>
                  </Grid>
                </>
              )}   
          <Box display="flex" justifyContent="space-between" p={2}>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              {comAlumno && !editMode && (
                <>
                  <Grid item>
                    <Button
                      onClick={() => history.goBack()}
                      variant="contained"
                      color="primary"
                      sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                    >
                      Volver
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleEdit}
                      sx={{
                        backgroundColor: '#c5e1a5',
                        color: '#000000',
                        '&:hover': { backgroundColor: '#b0d38a' }
                      }}
                    >
                      Editar Calificación
                    </Button>
                  </Grid>
                  <Grid item>
                  <Button variant="contained" color="error" onClick={handleClickOpen}>
                    Eliminar Entrega
                  </Button>
                </Grid>
                </>
              )}
              {comAlumno && editMode && (
                <>
                <Grid item>
                  <Button
                    onClick={() => history.goBack()}
                    variant="contained"
                    color="primary"
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                  >
                    Volver
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSave}
                    sx={{
                      backgroundColor: '#c5e1a5',
                      color: '#000000',
                      '&:hover': { backgroundColor: '#b0d38a' }
                    }}
                  >
                    Calificar
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="error" onClick={handleClickOpen}>
                    Eliminar Entrega
                  </Button>
                </Grid>
              </>
              )}
            </Grid>
          </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirmación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro que quieres eliminar la calificación?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} color="primary">
              Confirmar
            </Button>
          </DialogActions>
          </Dialog> 
      </Card>      
    </Box>
  );

  const loadingRendering = () => <div>Cargando datos del Alumno...</div>;

  const errorRendering = () => <div>Error al cargar los datos del Alumno</div>;

  return hasError ? errorRendering() : !alumno ? loadingRendering() : tpRendering();
};

export default TpEntrega;