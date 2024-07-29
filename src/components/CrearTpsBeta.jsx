import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Button, Card, CardContent, Container, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Box, Grid, Typography } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { SubHeader } from './General/SubHeader';
import { crearTp as postCrearTp } from '../services/tps';
import ListaDeGrupos from './Profesores/ListaDeGrupos';

const CrearTpsBeta = () => {
  const { idCurso, profesorId } = useParams();
  const [show, setShow] = useState(false);
  const [gruposParaTrabajo, setGruposParaTrabajo] = useState([]);
  const [tpData, setTpData] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    grupal: false,
    grupo: [],
    consigna: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'grupal') {
      setTpData({ ...tpData, [name]: value === 'true' });
      setShow(value === 'true');
    } else {
      setTpData({ ...tpData, [name]: value });
    }
  };

  const handleConsignaChange = (value) => {
    setTpData({ ...tpData, consigna: value });
  };

  const validarDatos = () => {
    if (!tpData.nombre || !tpData.fechaInicio || !tpData.fechaFin) {
      window.alert('Completa todos los campos obligatorios: Nombre, Fecha Inicio, Fecha Fin');
      return false;
    }
    return true;
  };

  const agregarGrupo = () => {
    setTpData({ ...tpData, grupo: gruposParaTrabajo });
  };

  const crearTp = async () => {
    agregarGrupo();
    if (!validarDatos()) {
      return;
    }
    try {
      const response = await postCrearTp(idCurso, profesorId, tpData);
      if (response.status === 201) {
        window.alert('Trabajo práctico creado correctamente');
      } else {
        console.error('Error al crear TP');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      window.alert('Error en la solicitud');
    }
  };

  useEffect(() => {
    setShow(tpData.grupal);
  }, [tpData]);

  useEffect(() => {
    agregarGrupo();
  }, [gruposParaTrabajo]);

  return (
    <Box display="flex" flexDirection="column">
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Nuevo TP
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
            <form>
              <Box component="div" sx={{}}>
                <Typography variant="h6" gutterBottom>
                   {dato ? dato.materia : 'Cargando...'}
                </Typography>
                <TextField
                  label="Nombre de Tp"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="nombre"
                  value={tpData.nombre}
                  onChange={handleChange}
                />
                <FormLabel>Descripcion</FormLabel>
                <ReactQuill
                  ref={quillRef}
                  value={tpData.consigna}
                  onChange={handleConsignaChange}
                  style={{ marginBottom: '20px' }}
                  modules={{
                    toolbar: [
                      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                      [{size: []}],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{'list': 'ordered'}, {'list': 'bullet'}],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                  formats={[
                    'header', 'font', 'size',
                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet',
                    'link', 'image'
                  ]}
                />
                <Grid container spacing={5}>
                  <Grid item xs={6}>
                    <TextField
                      label="Fecha inicio"
                      type="date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      name="fechaInicio"
                      value={tpData.fechaInicio}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Fecha fin"
                      type="date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      name="fechaFin"
                      value={tpData.fechaFin}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <FormControl margin="normal" fullWidth>
                      <FormLabel>Grupal</FormLabel>
                      <RadioGroup
                        row
                        name="grupal"
                        value={tpData.grupal.toString()}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="true" control={<Radio />} label="Sí" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={5}>
                  </Grid>
                </Grid>
                {show && (
                  <ListaDeGrupos
                    idCurso={idCurso}
                    show={show}
                    closeModal={() => setShow(false)}
                    setGruposParaTrabajo={setGruposParaTrabajo}
                  />
                )}
                <Box 
                  display="flex"
                  justifyContent="space-between"
                  marginTop= '20px'  
                >
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                    component={NavLink}
                    to={`/tps/${idCurso}/${profesorId}`}
                  >Volver
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}
                    onClick={crearTp}
                  >Grabar TP
                  </Button>
                </Box>
              </Box>
            </form>
        
      
          </Container>
        </CardContent>
      </Card>
    </Box>
    
  );
};

export default CrearTpsBeta;
