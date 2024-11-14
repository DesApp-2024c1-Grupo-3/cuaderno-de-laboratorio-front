import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Card, CardContent, Button, Typography, TextField, Container, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { getGrupoPorId } from '../services/Grupo';
import { getGruposByTpId } from '../services/tps';
import {
  crearCalificacion,
  getComAlumnByCalifId,
  postEliminarCalificacion
} from '../services/Calificacion';
import { getTpId } from '../services/tps';
import { Header } from './General/HeaderAlum';

const TpEntrega = () => {
  const history = useHistory();


  const { alumnoId, tpId } = useParams();
  const [grupo, setGrupo] = useState([]);
  const [tp, setTp] = useState([]);
  const [alumnos, setAlumnos] = useState([])
  const [entrego, setEntrego] = useState(null);
  const [nota, setNota] = useState('');
  const [comProfe, setComentarioProfe] = useState('');
  const [comentario, setComentario] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [archivo, setArchivo] = useState(null);// descarga de archivos del buffer de subida del profesor
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);//LOGICA PARA WARNING ELIMINACION
  const handleBack = () => {
    history.goBack()
    //history.push('/tpsAlumno/:idCurso/:alumnoId');  // Cambia a la ruta que prefieras
  };

  console.log("archivo", archivo);
  useEffect(() => {
    async function fetchTp() {
      try {
        // Obtener la lista de grupos y verificar si el alumno pertenece a algún grupo
        const grupos = await getGruposByTpId(tpId);

        if (grupos) {
          const grupoEncontrado = grupos.find(grupo =>
            grupo.alumnos.some(alumno => alumno._id === alumnoId)
          );



          if (grupoEncontrado) {
            //console.log("Alumno que hizo la entrega:", alumnoEntregador); // Verificar los datos del alumno
            //console.log("tp.file",  tp.file ); 
            if (tp.file && tp.file.length > 0) {
              const archivos = tp.file.map((file, index) => {
                //console.log("file:", file, file.data, archivos);  
                if (file && file.data) {
                  // Convertimos el array de bytes a Uint8Array
                  const byteArray = new Uint8Array(file.data);
                  // Creamos el Blob
                  const blob = new Blob([byteArray], { type: tp.fileType[index] });

                  // Generamos la URL del Blob
                  const url = URL.createObjectURL(blob);

                  // Si no hay nombre en `fileName`, generamos un nombre por defecto
                  const nombreArchivo = tp.fileName[index] || `archivo_${index + 1}.pdf`

                  // Devolvemos el archivo con su URL y nombre
                  return {
                    url: url,
                    nombre: nombreArchivo,  // Nombre del archivo
                  };
                }

                return null;
              }).filter(item => item !== null);  // Filtramos los elementos nulos

              setArchivo(archivos);
            }
            try {
              const califData = await getComAlumnByCalifId(grupoEncontrado._id, tpId);
              setComentarioProfe(califData);
              setNota(califData.calificacion);
              console.log("CalifData", califData);

              // Asignar el alumno que hizo la entrega
              const alumnoEntregador = grupoEncontrado.alumnos.find(alumno => alumno._id === califData.alumnoId);
              setEntrego(alumnoEntregador); // Guardar el alumno en el estado



            } catch (error) {
              if (error.response && error.response.status === 404 || error.response.status === 500) {
                setComentarioProfe('');
              }
            }

            setGrupo(grupoEncontrado);
            const alumnosData = await getGrupoPorId(grupoEncontrado._id);
            setAlumnos(alumnosData);
          } else {
            console.log('No se encontró un grupo para el alumno:', alumnoId);
          }

        }
        if (tpId) {
          const tpData = await getTpId(tpId);
          setTp(tpData.tp); // Asigna tpData.tp directamente al estado tp
          console.log(tpData.tp.estado);
        } else {
          console.error('tpId es undefined');
          setHasError(true);
        }
      } catch (err) {
        setHasError(true);
      }
    }
    fetchTp();
  }, [tpId, alumnoId]);
  console.log(tpId)
  console.log("tp", tp.grupos);
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
      formData.append('alumnoId', alumnoId);
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
      alert('Entrega eliminada con éxito');
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

  const formatFecha = (fechaHora) => {
    const [year, month, day] = fechaHora.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
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

  //console.log(tp.estado);

  const entregaRendering = () => (
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
                  <Grid item xs={5}>
                    <Typography variant="body1" color="textSecondary">
                      Descarga TP :
                    </Typography>
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
                {!comProfe
                  ? 'Un solo integrante del grupo puede hacer la entrega'
                  : entrego
                    ? `Trabajo práctico entregado por ${entrego.apellido}, ${entrego.nombre}`
                    : 'Trabajo práctico entregado'
                }
              </Typography>

              {!comProfe && (<Button variant="contained" component="label" sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}>
                Subir archivos
                <input type="file" hidden multiple onChange={handleArchivoChange} />
              </Button>)}
              {archivo && archivo.map((archivo, index) => (
                <Typography variant="body2" key={index}>{archivo.name}</Typography>
              ))}
              <Typography variant="h6">
                {comProfe.comentarioAlum && ("Comentario grupal: ")}
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

              {comProfe.calificacion ? ( //ARREGLAR
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <Typography variant="h6" component="div" gutterBottom>
                      Nota: {comProfe.calificacion}
                    </Typography>
                    <Typography variant="h6" component="div" gutterBottom>
                      Devolucion del Profesor :
                      <Typography marginLeft={2} variant="h6">
                        {comProfe.devolucionProf}
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              ) : ('')}
            </Box>
          </Container>
        </CardContent>
        <Box p={2}>
          {comProfe.calificacion ? (
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
            </>
          ) : (
            comProfe ? (

              <Grid container justifyContent="space-between" marginTop="20px">
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                    onClick={() => history.goBack()}
                  >
                    Volver
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} container justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClickOpen}
                  >
                    Eliminar entrega
                  </Button>
                </Grid>
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
                    color="primary"
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
              </>
            )}
          </Grid>
        </Box>
      </Card>
    </Box>
  );

  const loadingRendering = () => <div>Cargando detalles de entrega...</div>;

  const errorRendering = () => <div>Error al cargar los datos de entrega</div>;

  return hasError ? errorRendering() : !grupo ? loadingRendering() : entregaRendering();
};

export default TpEntrega;