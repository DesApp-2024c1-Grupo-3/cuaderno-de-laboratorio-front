import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Card, CardContent, Button, Typography, TextField, Container, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { getGrupoPorId, getCalificacionById } from '../services/Grupo'; // Asegúrate de que esta función esté implementada en el servicio
import { crearCalificacion } from '../services/Calificacion';
import { SubHeader } from './General/SubHeader';

const TpEntrega = () => {
  const { idEntregaGrupal, tpId } = useParams();
  const [grupo, setGrupo] = useState(null);
  const [nota, setNota] = useState('');
  const [comentario, setComentario] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [hasError, setHasError] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function fetchTp() {
      try {
        const grupoData = await getGrupoPorId(idEntregaGrupal);
        setGrupo(grupoData);

        const calificacionData = await getCalificacionById(tpId);
        if (calificacionData) {
          setComentario(calificacionData.comentarioAlum || '');
          setNota(calificacionData.calificacion || '');
          if (calificacionData.file && calificacionData.file.length > 0) {
            setArchivo(calificacionData.file[0]); // Asumimos que solo hay un archivo
          }
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
      archivosSubidos: [],
      comentarioAlumno: '',
      devolucionProf: comentario,
      calificacion: parseFloat(nota),
      tpId: tpId,
      alumnoId: '',
      grupoId: idEntregaGrupal,
    };
    try {
      await crearCalificacion(idEntregaGrupal, calificacionData);
      alert('Calificación guardada con éxito');
      history.goBack();
    } catch (err) {
      console.error('Error al guardar la calificación', err);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `http://localhost:8080/uploads/${archivo}`; // Ajustar la URL según la configuración del backend
    link.download = archivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tpRendering = () => (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <SubHeader titulo="Calificar Trabajo Práctico" />
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
                  {grupo.alumnos.map((integrante, index) => (
                    <TableRow
                      key={integrante.id}
                      sx={{ backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}
                    >
                      <TableCell>{integrante.nombre}</TableCell>
                      <TableCell>{integrante.apellido}</TableCell>
                      <TableCell>{integrante.dni}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2}>
              <Typography variant="h6" component="div" gutterBottom>
                Documento Entregado
              </Typography>
              {archivo && (
                <Button variant="contained" onClick={handleDownload}>
                  Descargar {archivo}
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
                  Enviar Calificación
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
