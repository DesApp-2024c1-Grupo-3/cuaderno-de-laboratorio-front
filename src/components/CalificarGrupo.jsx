import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Card, CardContent, Button, Typography, TextField, Container, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle  
 } from '@mui/material';
import { Header } from './General/HeaderProf';
import { getGrupoPorId, updateNotaEntrega, getArchivoEntrega } from '../services/Grupo';
import { getTpId } from '../services/tps';
import { getComAlumnByCalifId, updateCalificacion, postEliminarCalificacion} from '../services/Calificacion';

const TpEntrega = () => {
  const { idEntregaGrupal, tpId } = useParams();
  const [tp, setTp] = useState(null);
  const [grupo, setGrupo] = useState(null);
  const [nota, setNota] = useState('');
  const [comentario, setComentario] = useState('');
  const [comAlumno, setComentarioAlumno] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [calificado, setCalificado] = useState(null);

  const history = useHistory();
  
  useEffect(() => {
    async function fetchTp() {
      try {

        const gruposData = await getGrupoPorId(idEntregaGrupal);
        setGrupo(gruposData);

        try {
          const califData = await getComAlumnByCalifId(idEntregaGrupal, tpId);
          setComentarioAlumno(califData );
          setCalificado(califData?.calificado);
         
        } catch (error) {
          if (error.response && error.response.status === 404 || error.response.status === 500) {
            setComentarioAlumno('');
            setCalificado(null);
          }
        }
        if (tpId) {
          const tpData = await getTpId(tpId);
          setTp(tpData.tp); // Asigna tpData.tp directamente al estado tp

        } else {
          console.error('tpId es undefined');
          setHasError(true);
        }
      } catch (err) {
        setHasError(true);
      }
    }
    fetchTp();
  }, [idEntregaGrupal, tpId]);

  const handleNotaChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 1 && Number(value) <= 10)) {
      setNota(value);
    }
  };
  
  const handleComentarioChange = (e) => setComentario(e.target.value);
  
  const handleSave = async () => {
    const calificacionData = {
      devolucionProf: comentario,
      calificacion: parseFloat(nota),
      calificado: true,
    };
    try {
      await updateCalificacion(comAlumno._id, calificacionData);
      setEditMode(false);
      setCalificado(true); // Actualiza el estado local
      const updatedCalifData = await getComAlumnByCalifId(idEntregaGrupal, tpId);
      setComentarioAlumno(updatedCalifData);
      alert('Calificación guardada con éxito');
      //history.goBack();
    } catch (err) {
      console.error('Error al guardar la calificación', err);
    }
  };
  
  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = archivo.url;
    link.download = archivo.nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteCalificacion = async (id) => {
    try {
      await postEliminarCalificacion(id);
      window.location.reload();
    } catch (error) {
      console.error('Error al eliminar la calificación:', error);
    }
  };

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleConfirmDelete = async () => {
    await deleteCalificacion(comAlumno._id);
    setOpen(false);
  };

  const formatFecha = (fecha) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  };

  const SubHeader = ({ titulo, nombreTP }) => (
    <Grid container justifyContent="center" alignItems="center">
      <Typography variant="h5" component="div">
        <span style={{ color: '#272727' }}>{titulo} </span>
        <span style={{ fontWeight: 'bold', color: '#272727' }}>{nombreTP}</span>
      </Typography>
    </Grid>
  );

//console.log('Estado de calificado:', comAlumno.calificado);
console.log('Estado de editMode:', editMode);

  const tpRendering = () => (
    <Box>
      <Header />
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <SubHeader titulo="Título:" nombreTP={tp ? tp.nombre : 'Cargando...'} />
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
          <Container maxWidth="xl" sx={{ mt: 1, mb: 1, border: 'solid', borderWidth: '10px 20px 20px 10px', borderColor: 'rgba(0, 0, 0, 0.08)', borderRadius: '1%' }}>
            <Typography variant="h6" component="div" gutterBottom>
              Tp Grupal
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
                  {grupo && grupo.map((integrante, index) => (
                    <TableRow key={integrante.id} sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}>
                      <TableCell align="center">{integrante.nombre}</TableCell>
                      <TableCell align="center">{integrante.apellido}</TableCell>
                      <TableCell align="center">{integrante.dni}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2}>
              <Typography variant="h6" component="div" gutterBottom>
                {comAlumno ? 'Documento entregado' : 'Documento no entregado. El trabajo practico no fue entregado'}
              </Typography>
              {comAlumno && (
                <>
                  <Typography variant="h6">
                    Comentario grupal:
                    <Typography marginLeft={2} variant="h6">
                      {comAlumno.comentarioAlum}
                    </Typography>
                  </Typography>
                  <br/>
                  {archivo && (
                    <Button variant="contained" onClick={handleDownload} sx={{
                      backgroundColor: '#c5e1a5',
                      color: '#000000',
                      '&:hover': { backgroundColor: '#b0d38a' }
                    }}>
                      Descargar {archivo.nombre}
                    </Button>
                  )}
                </>
              )}
            </Box>
            <Box mt={2} sx={{ display: 'flex' }}>
              <Grid container>
              {(calificado === true) && (
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
              {(calificado === false && !editMode && comAlumno) && (
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

  const loadingRendering = () => <div>Cargando detalles del Tp...</div>;

  const errorRendering = () => <div>Error al cargar los detalles del Tp</div>;

  return hasError ? errorRendering() : !grupo ? loadingRendering() : tpRendering();
};

export default TpEntrega;
