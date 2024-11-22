import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Card, CardContent, Button, Typography, TextField, Container, Box, MenuItem, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { Header } from './General/HeaderProf';
import { getGrupoPorId, updateNotaEntrega, getArchivoEntrega } from '../services/Grupo';
import { getTpId } from '../services/tps';
import { getAlumnoById } from '../services/Alumnos';
import { getComAlumnByCalifId, updateCalificacion, postEliminarCalificacion } from '../services/Calificacion';

const TpEntrega = () => {
  const { idEntregaGrupal, tpId, profesorId, idCurso } = useParams();
  const [tp, setTp] = useState(null);
  const [grupo, setGrupo] = useState(null);
  const [nota, setNota] = useState('');
  const [comentario, setComentario] = useState('');
  const [comAlumno, setComentarioAlumno] = useState(null);
  const [entrego, setEntrego] = useState(null);
  const [tpSubido, setTpSubido] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const history = useHistory();
  const handleBack = () => {
    history.push(`/tpsAlumno/${idCurso}/${alumnoId}`);
    //history.push('/tpsAlumno/:idCurso/:alumnoId');  // Cambia a la ruta que prefieras
  };
  
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

        const gruposData = await getGrupoPorId(idEntregaGrupal);
        setGrupo(gruposData);

        if (tpId) {
          const tpData = await getTpId(tpId);
          setTp(tpData.tp); // Asigna tpData.tp directamente al estado tp

          if (tpData.tp.file && tpData.tp.file.length > 0) {
            const archivosConvertidos = convertirArchivos(tpData.tp.file, tpData.tp.fileType, tpData.tp.fileName);
            setTpSubido(archivosConvertidos); // Guardar los archivos convertidos en el estado
          } 
        } else {
          console.error('tpId es undefined');
          setHasError(true);
        }
        try {
          const califData = await getComAlumnByCalifId(idEntregaGrupal, tpId);
          setComentarioAlumno(califData);
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
                const nombreArchivo = califData.fileName[index] || `archivo_${index + 1}.pdf`

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
          //setNota(califData?.calificacion);
          if (tp?.estado === 'En evaluacion' && (!califData || !califData.calificacion)) {
            setNota('No entregado');
          } else {
            setNota(califData?.calificacion || 'No asignada');
          }

          const alumnoEntregador = await getAlumnoById(califData.alumnoId);
          setEntrego(alumnoEntregador);

        } catch (error) {
          if (error.response && error.response.status === 404 || error.response.status === 500) {
            setComentarioAlumno('');
          }
        }
      } catch (err) {
        setHasError(true);
      }
    }
    fetchTp();
  }, [idEntregaGrupal, tpId]);


  const handleNotaChange = (e) => {
    const value = e.target.value;
    // Permite tanto números como 'No entregado'
    if (value === '' || (Number(value) >= 1 && Number(value) <= 10)) {
      setNota(value);
    }
  };


  const handleComentarioChange = (e) => setComentario(e.target.value);

  const handleSave = async () => {
    const calificacionData = {
      devolucionProf: comentario,
      calificacion: nota === 'No entregado' ? 'No entregado' : parseFloat(nota),
    };
    try {
      await updateCalificacion(comAlumno._id, calificacionData);
      setEditMode(false);
      const updatedCalifData = await getComAlumnByCalifId(idEntregaGrupal, tpId);
      setComentarioAlumno(updatedCalifData);
      alert('Calificación guardada con éxito');
      history.goBack();
    } catch (err) {
      console.error('Error al guardar la calificación', err);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
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

  const formatFecha = (fechaHora) => {
    const [year, month, day] = fechaHora.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };


  const SubHeader = ({ titulo, nombreTP }) => (
    <Grid container justifyContent="center" alignItems="center">
      <Typography variant="h5" component="div">
        <span style={{ color: '#272727' }}>{titulo} </span>
        <span style={{ fontWeight: 'bold', color: '#272727' }}>{nombreTP}</span>
      </Typography>
    </Grid>
  );

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
                    Consigna:
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
                      {tpSubido && tpSubido.length > 0 && (
                        <>
                          {tpSubido.map((archivo, index) => (
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

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Typography variant="body1" color="textSecondary">
                    Fechas:
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" component="div">
                    Inicio: {formatFecha(tp.fechaInicio)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" component="div">
                    Fin: {formatFecha(tp.fechaFin)}
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}
          <Container maxWidth="xl" sx={{ mt: 1, mb: 1, border: 'solid', borderWidth: '20px', borderColor: 'rgba(0, 0, 0, 0.08)', borderRadius: '1%' }}>
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
                {comAlumno && entrego ? `Trabajo práctico entregado por ${entrego.apellido}, ${entrego.nombre}` : 'Documento no entregado. El trabajo practico no fue entregado'}
                <br />
                {archivo && archivo.length > 0 && (
                  <>
                    Documento entregado: <span style={{ color: 'blue' }}>Descargar</span>
                  </>
                )}
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
              {comAlumno && (
                <>
                  <Typography variant="h6">
                    Comentario grupal:
                    <Typography marginLeft={2} variant="h6">
                      {comAlumno.comentarioAlum}
                    </Typography>
                  </Typography>
                  <br />
                </>
              )}
            </Box>
            <Box mt={2} sx={{ display: 'flex' }}>
              <Grid container>
                {comAlumno ? (
                  (comAlumno.calificacion || comAlumno.devolucionProf) ? (
                    <>
                      {comAlumno.calificacion && (
                        <Grid item xs={8}>
                          <Typography variant="h6" component="div" gutterBottom>
                            Nota: {comAlumno.calificacion}
                          </Typography>
                        </Grid>
                      )}
                      {comAlumno.devolucionProf && (
                        <Grid item xs={8}>
                          <Typography variant="h6" component="div" gutterBottom>
                            Devolución: {comAlumno.devolucionProf}
                          </Typography>
                        </Grid>
                      )}
                    </>
                  ) : (
                    <Typography variant="h6" component="div" gutterBottom>
                      Aun no se ha calificado.
                    </Typography>
                  )
                ) : ('')}


                {(editMode) && (
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Nota"
                        value={nota}
                        onChange={handleNotaChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      >
                        {[...Array(10)].map((_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </TextField>
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
                onClick={() => history.push(`/tp/${idCurso}/${profesorId}/${tpId}`)}
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
                    onClick={() => history.push(`/tp/${idCurso}/${profesorId}/${tpId}`)}
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
                    onClick={() => history.push(`/tp/${idCurso}/${profesorId}/${tpId}`)}
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
