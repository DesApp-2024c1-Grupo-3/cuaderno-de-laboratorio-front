import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Card, CardContent, Button, Typography, TextField, Container, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';


import { getGrupoPorId, updateNotaEntrega, getArchivoEntrega } from '../services/Grupo';
import { getTpId } from '../services/tps';
import { getComAlumnByCalifId } from '../services/Calificacion';

const TpEntrega = () => {
  const { idEntregaGrupal, tpId } = useParams();
  const [tp, setTp] = useState(null);

  const [grupo, setGrupo] = useState(null);
  const [nota, setNota] = useState('');

  const [comentario, setComentario] = useState('');
  const [comAlumno, setComentarioAlumno] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [hasError, setHasError] = useState(false);

  const history = useHistory();

  useEffect(() => {
    async function fetchTp() {
      try {

        const gruposData = await getGrupoPorId(idEntregaGrupal);
        setGrupo(gruposData);

        try {
          const califData = await getComAlumnByCalifId(idEntregaGrupal, tpId);
          setComentarioAlumno(califData || 'El Trabajo practico no fue entregado');
        } catch (error) {
          if (error.response && error.response.status === 404 || error.response.status === 500) {
            setComentarioAlumno('El Trabajo practico no fue entregado');
          }
        }
        console.log(comAlumno)

        setComentario(gruposData.comentario || '');

        const notaData = await updateNotaEntrega(idEntregaGrupal)
        setNota(notaData.nota || '');

        const archivoData = await getArchivoEntrega(idEntregaGrupal);
        setArchivo(archivoData);

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

  const handleNotaChange = (e) => setNota(e.target.value);
  const handleComentarioChange = (e) => setComentario(e.target.value);

  const handleSave = async () => {
    const calificacionData = {
      archivosSubidos: [], // Ajustar según tus necesidades
      devolucionProf: comentario,
      calificacion: parseFloat(nota),
      tpId: tpId, // Proporcionar el ID del Trabajo Práctico si está disponible
      alumnoId: '',
      grupoId: idEntregaGrupal, // Proporcionar el ID del grupo si está disponible
    };
    try {
      await crearCalificacion(idEntregaAlumno, calificacionData);
      alert('Calificación guardada con éxito');
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
  const formatFecha = (fecha) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  };
  const titulo = tp ? `${tp.nombre}` : 'Cargando...';




  const tpRendering = () => (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>

          <div>
            <SubHeader titulo="Calificar:" nombreTP={titulo} />
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
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Nombre </TableCell>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Apellido</TableCell>
                    <TableCell style={{ width: '35%', fontSize: '15px' }}>Dni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    grupo.map((integrante, index) => (
                      <TableRow
                        key={integrante.id}
                        sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                      >
                        <TableCell>{integrante.nombre}</TableCell>
                        <TableCell>{integrante.apellido}</TableCell>
                        <TableCell>{integrante.dni}</TableCell>

                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2}>
              <Typography variant="h6" component="div" gutterBottom>
                Documento {comAlumno !== 'El Trabajo practico no fue entregado' ? 'Entregado' : 'no Entregado'}
              </Typography>

              <Typography variant="h6">
                Comentario grupal: {comAlumno}
              </Typography>

              {archivo && (
                <Button
                  variant="contained"
                  onClick={handleDownload}
                  disabled={!archivo || comAlumno === 'El Trabajo practico no fue entregado'}
                >
                  Descargar {archivo ? archivo.nombre : ''}
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
                  onClick={handleSave}
                >
                  Enviar Calificacion
                </Button>
              </Grid>
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
