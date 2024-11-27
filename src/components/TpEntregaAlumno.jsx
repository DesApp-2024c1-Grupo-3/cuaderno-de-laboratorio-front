import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Card, CardContent, Button, Typography, TextField, Container, Box, Grid, Modal,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { getAlumnoById } from '../services/Alumnos';
import {
  crearCalificacion,
  getComAlumnIndByCalifId,
  postEliminarCalificacion
} from '../services/Calificacion';
import { getTpId } from '../services/tps';
import { Header } from './General/HeaderAlum';

const TpEntrega = () => {
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const { alumnoId, tpId, idCurso } = useParams();
  const [nota, setNota] = useState('');
  const [tp, setTp] = useState(null);
  const [alumno, setAlumno] = useState([]);
  const [comProfe, setComentarioProfe] = useState('');
  const [comentario, setComentario] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [archivo, setArchivo] = useState(null);// descarga de archivos del buffer de subida del profesor
  const [archivoCalif, setArchivoCalif] = useState(null);// desgarga y vista del atp subido por el alumno
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);//LOGICA PARA WARNING ELIMINACION
  const handleBack = () => {
    history.push(`/tpsAlumno/${idCurso}/${alumnoId}`);  // Cambia a la ruta que prefieras
  };
  console.log("archivo", archivo);
  console.log("Parametro de entradas" , { idCurso }, { tpId });
  console.log("Trabajo Practico", tp);
  // Función para convertir los archivos a objetos Blob y generar las URLs de descarga
  const convertirArchivos = (files, fileTypes, fileNames) => {
    if (!files || files.length === 0) return [];

    return files.map((file, index) => {
      if (file && file.data) {
        // Convierte el array de bytes a Uint8Array
        const byteArray = new Uint8Array(file.data);
        // Crea el Blob con el tipo de archivo especificado
        const blob = new Blob([byteArray], { type: fileTypes[index] });
        // Genera la URL del Blob para descarga
        const url = URL.createObjectURL(blob);
        // Asigna un nombre por defecto si no hay uno
        const nombreArchivo = fileNames[index] || `archivo_${index + 1}.pdf`;

        return { url, nombre: nombreArchivo };
      }
      return null;
    }).filter(item => item !== null); // Filtramos los elementos nulos
  };
  useEffect(() => {
    async function fetchTp() {
      try {
        console.log("Parametro" , { tpId });
        const alumnoData = await getAlumnoById(alumnoId);
        setAlumno(alumnoData);
        try {
          const califData = await getComAlumnIndByCalifId(alumnoId, tpId);
          setComentarioProfe(califData);
          setNota(califData.calificacion);


        } catch (error) {
          if (error.response && error.response.status === 404 || error.response.status === 500) {
            setComentarioProfe('');
          }
        }
        if (tpId) {
          
          const tpData = await getTpId(tpId);
          setTp(tpData.tp); // Asigna tpData.tp directamente al estado tp
          // Convertir archivos solo si `tp.file` existe y tiene contenido
          console.error('el estado es',tpData.tp.estado);
          if (tpData.tp.file && tpData.tp.file.length > 0) {
            const archivosConvertidos = convertirArchivos(tpData.tp.file, tpData.tp.fileType, tpData.tp.fileName);
            setArchivo(archivosConvertidos); // Guardar los archivos convertidos en el estado
          }
        } else {
          console.error('tpId es undefined');
          setHasError(true);
        }

      } catch (err) {
        setHasError(true);
      }

    }
    fetchTp();
  }, [alumnoId, tpId]);
  useEffect(() => {
    if (comProfe?.file && comProfe.fileType && comProfe.fileName) {
      const archivosConvertidos = convertirArchivos(comProfe.file, comProfe.fileType, comProfe.fileName);
      setArchivoCalif(archivosConvertidos);
    }
  }, [comProfe]);

  const handleComentarioChange = (e) => setComentario(e.target.value);
  const handleArchivoChange = (e) => setArchivos(Array.from(e.target.files));
  console.log('Archivos:', archivos); // Depuración
  const handleSave = async () => {
    try {
      if (archivos.length > 10) {
        setModalMessage('No puedes subir más de 10 archivos.');
        setModalOpen(true);
        return;
      }

      // Validación de tamaño total de archivos
      const totalSize = archivos.reduce((sum, archivo) => sum + archivo.size, 0);
      if (totalSize > 16 * 1024 * 1024) { // 16MB en bytes
        setModalMessage('El tamaño total de los archivos no puede superar los 16MB.');
        setModalOpen(true);
        return;
      }
      const formData = new FormData();

      archivos.forEach((archivo, index) => {
        formData.append('file', archivo);
      });

      formData.append('comentarioAlum', comentario);
      formData.append('tpId', tpId);
      formData.append('alumnoId', alumnoId);

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
  const handleClickOpen = () => {//LOGICA PARA WARNING ELIMINACION
    setOpen(true);
  };
  const handleClose = () => {//LOGICA PARA WARNING ELIMINACION
    setOpen(false);
  };
  const handleConfirmDelete = async () => {//LOGICA PARA WARNING ELIMINACION
    await deleteCalificacion(comProfe._id);
    setOpen(false);
    window.location.reload();
  };

  const formatFecha = (fecha) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(fecha);
    date.setDate(date.getDate() + 1); // Añade un día
    return date.toLocaleDateString('es-ES', options);
  };
  const titulo = tp ? `${tp.nombre}` : 'Cargando...';

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
  const handleCloseModal = () => {
    setModalOpen(false);
  };
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
                      Descarga TP :
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" component="div">
                      {archivo && archivo.length > 0 && (
                        <>
                          {archivo.map((archivo, index) => (
                            <a key={index} href={archivo.url} download={archivo.nombre}>
                              <br />
                              {archivo.nombre}
                              <br />
                            </a>
                          ))}
                        </>
                      )}
                      <br />
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
              Alumno
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
                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}
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
            <>
              <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '8px',
                  }}
                >
                  <Typography variant="h6" component="h2">
                    Error
                  </Typography>
                  <Typography sx={{ mt: 2 }}>{modalMessage}</Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={handleCloseModal}
                  >
                    Cerrar
                  </Button>
                </Box>
              </Modal>
            </>
            <Box mt={2}>
              <Typography variant="h6" component="div" gutterBottom>
                {!comProfe && tp && tp.estado === "En marcha"  
                  ? 'Entrega del trabajo práctico.'
                  : 'Trabajo práctico no entregado.'
                }
              </Typography>
              {comProfe && (
                <Grid container alignItems="center">
                  <Grid item xs={5}>
                    <Typography variant="h6" component="div" gutterBottom>
                      Descarga TP enviado :
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2" component="div">
                      {archivoCalif && archivoCalif.length > 0 && (
                        <>
                          {archivoCalif.map((archivo, index) => (
                            <a key={index} href={archivo.url} download={archivo.nombre}>
                              <br />
                              {archivo.nombre}
                              <br />
                            </a>
                          ))}
                        </>
                      )}
                      <br />
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {!comProfe && tp && tp.estado === "En marcha" && (
                <>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}
                  >
                    Subir archivos
                    <input type="file" hidden multiple onChange={handleArchivoChange} />
                  </Button>
                  <Typography variant="body2" color="red" mt={1}>
                    Tamaño máximo de archivos a subir (16Mb)
                  </Typography>
                </>
              )}
              {archivos && archivos.map((archivo, index) => (
                <Typography variant="body2" key={index}>{archivo.name}</Typography>
              ))}
              <Typography variant="h6">
                {comProfe.comentarioAlum && ("Comentario Del Alumno: ")}
                <Typography marginLeft={2} variant="h6">
                  {comProfe.comentarioAlum}
                </Typography>
              </Typography>
              <br />
            </Box>
            <Box mt={2}>
              {!comProfe && (nota && <TextField
              label="Nota"
              value={nota}
              variant="outlined"
              fullWidth
              margin="normal"
            />)}
            {!comProfe && tp && tp.estado === "En marcha" && (
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
            )}
            {tp && tp.estado === "Cerrado" && comProfe.calificacion && (
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h6" component="div" gutterBottom>
                    Nota: {comProfe.calificacion}
                  </Typography>
                  <Typography variant="h6" component="div" gutterBottom>
                    Devolución del Profesor:
                    <Typography marginLeft={2} variant="h6">
                      {comProfe.devolucionProf}
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Box>

          </Container>
        </CardContent>
        <Box p={2}>

          {comProfe.calificacion ? (
            <>
              <Grid item>
                <Button
                  onClick={handleBack}
                  variant="contained"
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }} S
                >
                  Volver
                </Button>
              </Grid>
            </>
          ) : (
            comProfe ? (
              <Grid container justifyContent="space-between" marginTop="20px">
                <Grid item>
                  <Button
                    onClick={handleBack}
                    variant="contained"
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }} S
                  >
                    Volver
                  </Button>
                </Grid>
                {tp && tp.estado === "En marcha" && (
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClickOpen}
                  >
                    Eliminar entrega
                  </Button>
                </Grid>
                 )}
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Confirmar Eliminación"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      ¿Está seguro que desea eliminar esta entrega? Esta acción no se puede deshacer.
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
            ) : ('')
          )}
          <Grid container
            spacing={2}
            justifyContent="space-between"
            marginTop='20px'
          >
            {!comProfe && (
              <>
                <Grid item>
                  <Button
                    onClick={handleBack}
                    variant="contained"
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }} S
                  >
                    Volver
                  </Button>
                </Grid>
                {tp && tp.estado === "En marcha" && (
                  <Grid item>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}
                    onClick={handleSave}
                    >
                    Cargar TP
                  </Button>
                </Grid>
                )}
              </>
            )}
          </Grid>
        </Box>
      </Card>
    </Box>
  );

  const loadingRendering = () => <div>Cargando datos del Alumno...</div>;

  const errorRendering = () => <div>Error al cargar los datos del Alumno</div>;

  return hasError ? errorRendering() : !alumno ? loadingRendering() : tpRendering();
};

export default TpEntrega;