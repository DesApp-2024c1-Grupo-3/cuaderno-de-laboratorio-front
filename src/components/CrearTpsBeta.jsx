import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { Button, Card, CardContent, Container, FormControl, FormLabel, RadioGroup, 
  FormControlLabel, Radio, TextField, Box, Grid, Typography 
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getCursoById, crearTp as postCrearTp, crearTpMultipart } from '../services/tps';
import ListaDeGrupos from './Profesores/ListaDeGrupos';
import { Header} from './General/HeaderProf';

const CrearTpsBeta = () => {
  const { idCurso, profesorId } = useParams();
  const [dato, setDato] = useState(null);
  const [show, setShow] = useState(false);
  const [archivos, setArchivos] = useState([]);
  const [gruposParaTrabajo, setGruposParaTrabajo] = useState([]);
  const [tpData, setTpData] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    grupal: false,
    grupo: [],
    consigna: '',
    cuatrimestre: false,
  });
  const history = useHistory();
  const quillRef = useRef(null); // Asegúrate de que quillRef esté definido correctamente

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'grupal') {
      setTpData((prev) => ({ ...prev, [name]: value === 'true' }));
      setShow(value === 'true');
    } else {
      setTpData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleArchivoChange = (e) => setArchivos(Array.from(e.target.files));
  console.log('Archivos:', archivos); // Depuración
  const handleSave = async () => {
    try {
      const formData = new FormData();
      
      archivos.forEach((archivo, index) => {
        formData.append('file', archivo);
      });
      formData.append('nombre', tpData.nombre); // Nombre del TP
      formData.append('fechaInicio', tpData.fechaInicio); // Fecha de inicio
      formData.append('fechaFin', tpData.fechaFin); // Fecha de fin
      formData.append('grupal', tpData.grupal); // Si es grupal
      formData.append('grupos', JSON.stringify(tpData.grupo)); // Grupos seleccionados
      formData.append('consigna', tpData.consigna); // Consigna del trabajo

      await crearTpMultipart( profesorId, idCurso, formData);
        window.alert('Trabajo práctico creado correctamente');
        history.goBack();
      
    } catch (err) {
      console.error('Error al guardar', err);
    }
  };
  const handleConsignaChange = (value) => {
    setTpData((prev) => ({ ...prev, consigna: value }));
  };
  
  const validarDatos = () => {
    if (!tpData.nombre || !tpData.fechaInicio || !tpData.fechaFin) {
      window.alert('Completa todos los campos obligatorios: Nombre, Fecha Inicio, Fecha Fin');
      return false;
    }
    return true;
  };

  const agregarGrupo = () => {
    setTpData((prev) => ({ ...prev, grupo: gruposParaTrabajo }));
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
        history.goBack();
      } else {
        console.error('Error al crear TP');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      window.alert('Error en la solicitud');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tpsDato = await getCursoById(idCurso);
        console.log("Datos obtenidos:", tpsDato); // Verifica la estructura de los datos obtenidos
        setDato(tpsDato);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [idCurso]);

  useEffect(() => {
    agregarGrupo();
  }, [gruposParaTrabajo]);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.root.setAttribute('autocorrect', 'off');
      editor.root.setAttribute('spellcheck', 'false');
    }
  }, []);

  return (
    <Box display="flex" flexDirection="column">
      <Header />
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

                    <Typography variant="h6" component="div" gutterBottom>
                      {archivos && ('Subir Trabajo practico')}
                    </Typography>
                    {archivos &&( <Button variant="contained" component="label" sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}>
                        Subir archivos
                        <input type="file" hidden multiple onChange={handleArchivoChange} />
                      </Button>)}
                    {archivos && archivos.map((archivo, index) => (
                      <Typography variant="body2" key={index}>{archivo.name}</Typography>
                    ))}
                                     
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
                
              </Box>
            </form>
          </Container>
        </CardContent>
          <Box 
                  display="flex"
                  justifyContent="space-between"
                  p={2}  
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
                    onClick={handleSave}
                    
                  >Grabar TP
                  </Button>
                </Box>
      </Card>
    </Box>
  );
};

export default CrearTpsBeta;
