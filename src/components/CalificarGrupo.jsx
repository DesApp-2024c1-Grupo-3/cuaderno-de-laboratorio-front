import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Card, CardContent, Button, Typography, TextField, Container, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle  
 } from '@mui/material';
import { Header} from './General/HeaderProf';
import { getGrupoPorId, updateNotaEntrega, getArchivoEntrega } from '../services/Grupo';
import { getTpId } from '../services/tps';
import { getComAlumnByCalifId, updateCalificacion, postEliminarCalificacion} from '../services/Calificacion';


const TpEntrega = () => {
  const { idEntregaGrupal, profesorId, tpId } = useParams();
  const [tp, setTp] = useState(null);
  const [grupo, setGrupo] = useState(null);
  const [nota, setNota] = useState('');

  const [comentario, setComentario] = useState('');
  const [comAlumno, setComentarioAlumno] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);//LOGICA PARA WARNING ELIMINACION

  const history = useHistory();
  console.log(comAlumno._id)
  useEffect(() => {
    async function fetchTp() {
      try {

        const gruposData = await getGrupoPorId(idEntregaGrupal);
        setGrupo(gruposData);

        try {
          const califData = await getComAlumnByCalifId(idEntregaGrupal, tpId);
          setComentarioAlumno(califData );
         
        } catch (error) {
          if (error.response && error.response.status === 404 || error.response.status === 500) {
            setComentarioAlumno('');
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
  }, [idEntregaGrupal, profesorId, tpId]);
 
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
      alert('Calificación guardada con éxito');
      setArchivo(false);
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
  const formatFecha = (fecha) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  };
  const titulo = tp ? `${tp.nombre}` : 'Cargando...';

  
  const tpRendering = () => (
    <Box>
      <Header />
      <Card sx={{ mb: 2 }}>
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
              borderWidth: '10px 20px 20px 10px',
              borderColor: 'rgba(0, 0, 0, 0.08)',
              borderRadius: '1%'
            }}
          >
            <Typography variant="h6" component="div" gutterBottom>
              Tp Grupal
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
                    grupo.map((integrante, index) => (
                      <TableRow
                        key={integrante.id}
                        sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                      >
                        <TableCell align="center">{integrante.nombre}</TableCell>
                        <TableCell align="center">{integrante.apellido}</TableCell>
                        <TableCell align="center">{integrante.dni}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2}>
              <Typography variant="h6" component="div" gutterBottom>
                {comAlumno !== ''? ' Documento entregado' : 'Documento no entregado. El trabajo practico no fue entregado'}
              </Typography>
              <Typography variant="h6">
                {comAlumno !== '' ? "Comentario grupal: " : ''}
                <Typography marginLeft={2}>
                  {comAlumno !== '' ?  comAlumno.comentarioAlum : ''}
                </Typography>
              </Typography>
              <br/>
              {archivo && (
                <Button
                  variant="contained"
                  onClick={handleDownload}
                  disabled={comAlumno.comentarioAlum === ''}
                >
                  Descargar {archivo ? archivo.nombre : ''}
                </Button>
              )}
            </Box>
            <Box mt={2} sx={{ display: 'flex' }}>
              {!comAlumno.comentarioAlum ? ( //IMPLEMENTAR LOGICA PARA QUE NO APAREZCAN LOS RECUADROS DE NOTA Y COMENTARIO DE PROF
              <>
              </>
              ):(
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <TextField
                      label="Nota"
                      value={nota}
                      onChange={handleNotaChange}
                      variant="outlined"
                      fullWidth
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
                      <Grid item>
                      {comAlumno.calificacion ? (
                          <><Typography variant="h6" component="div" gutterBottom>
                            Nota: {comAlumno.calificacion}
                          </Typography>
                          <Typography variant="h6" component="div" gutterBottom>
                            Devolución del Profesor : 
                            <Typography marginLeft={2}>
                              {comAlumno.devolucionProf} 
                            </Typography>
                          </Typography></>
                         ) : (<></>)}
                      </Grid>
                  </Grid>
                  <Grid item style={{ marginLeft: 'auto' }}>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                      onClick={handleClickOpen}
                    >
                      Eliminar entrega del grupo
                    </Button>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                    <DialogTitle id="alert-dialog-title">{"Confirmar Eliminación"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        ¿Está seguro que desea eliminar este trabajo práctico? Esta acción no se puede deshacer.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        Cancelar
                      </Button>
                      <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Confirmar
                      </Button>
                  </DialogActions>
                  </Dialog>
                  </Grid>
                </Grid>
              )}
            </Box>
            <Grid container>
                {comAlumno.comentarioAlum ? (
                  <Grid container
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                  marginTop='20px'
                >
                    <Grid item>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' }}}
                        onClick={() => history.goBack()}
                      >
                        Volver
                      </Button>
                      </Grid>
                      <Grid item xs={12} sm="auto">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' }}}
                            onClick={handleSave}
                          >
                            Enviar Calificacion
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>) : (
                      <Grid container
                      justifyContent="center"
                      marginTop='20px'
                    >
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                        onClick={() => history.goBack()}
                      >
                        Volver
                      </Button>
                    </Grid>
                    )}
            </Grid> 
          </Container>
        </CardContent>
      </Card>
    </Box >
  );

  const loadingRendering = () => <div>Cargando detalles del Tp...</div>;

  const errorRendering = () => <div>Error al cargar los detalles del Tp</div>;

  return hasError ? errorRendering() : !grupo ? loadingRendering() : tpRendering();
};

export default TpEntrega;