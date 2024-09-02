import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import {
    Button, Card, CardContent, Container, FormControl, FormLabel, RadioGroup, InputLabel, Select, MenuItem,
    FormControlLabel, Radio, TextField, Box, Grid, Typography
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getTpId, updateTp } from '../services/tps'; // Asegúrate de importar el servicio adecuado
import ListaDeGrupos from './Profesores/ListaDeGrupos';
import { Header } from './General/HeaderProf';

const TpModificar = () => {
    const { idCurso, profesorId, tpId } = useParams();
    const [show, setShow] = useState(false);
    const [gruposParaTrabajo, setGruposParaTrabajo] = useState([]);
    const [tpData, setTpData] = useState({
        nombre: '',
        fechaInicio: '',
        fechaFin: '',
        grupal: false,
        grupo: [],
        consigna: '',
        cuatrimestre: false,
        estado: 'Futuro',
    });
    const history = useHistory();
    const quillRef = useRef(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'grupal') {
            setTpData((prev) => ({ ...prev, [name]: value === 'true' }));
            setShow(value === 'true');
        } else {
            setTpData((prev) => ({ ...prev, [name]: value }));
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

    const actualizarTp = async () => {
        agregarGrupo();
        if (!validarDatos()) {
            return;
        }
        try {
            const response = await updateTp(tpId, tpData);

            if (response.status === 200) {
                window.alert('Trabajo práctico actualizado correctamente');
                history.goBack();
            } else {
                console.error('Error al actualizar TP', error);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            window.alert('Error en la solicitud', error);
        }
    };

    const modificarTp = async () => {
        if (!validarDatos()) {
            return;
        }
        try {
            const response = await updateTp(tpId, tpData);  // Asegúrate de que `tpId` y `tpData` están definidos correctamente
            if (response.status === 200) {  // Verifica que `response` tenga un objeto `status`
                window.alert('Trabajo práctico modificado correctamente');
                history.goBack();
            } else {
                console.error('Error al modificar TP', response);  // Agrega `response` para más contexto
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);  // Captura y muestra el error en la consola
            window.alert('Error en la solicitud');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTpId(tpId);
                const tp = response.tp; // Acceder al objeto tp dentro del response

                setTpData({
                    nombre: tp?.nombre || '',
                    fechaInicio: tp?.fechaInicio ? tp.fechaInicio.split('T')[0] : '',
                    fechaFin: tp?.fechaFin ? tp.fechaFin.split('T')[0] : '',
                    grupal: tp?.grupal || false,
                    grupo: tp?.grupos || [],
                    consigna: tp?.consigna || '',
                    cuatrimestre: tp?.cuatrimestre || false,
                    estado: tp?.estado || 'Futuro'  // Asignar el valor de estado
                });

                setShow(tp?.grupal || false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [tpId]);

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
                        Modificar TP
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

                                <TextField
                                    label="Nombre de TP"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name="nombre"
                                    value={tpData.nombre}
                                    onChange={handleChange}
                                />
                                <FormLabel>Descripción</FormLabel>
                                {/* Proximamente cambiar estado Entregado por Cerrado */}
                                <ReactQuill
                                    ref={quillRef}
                                    value={tpData.consigna}
                                    onChange={tpData.estado === 'Entregado' ? () => { } : handleConsignaChange} // No permite cambios si el estado es 'Cerrado'
                                    style={{
                                        marginBottom: '20px',
                                        backgroundColor: tpData.estado === 'Entregado' ? '#f0f0f0' : 'white', // Fondo grisáceo si está cerrado
                                        pointerEvents: tpData.estado === 'Entregado' ? 'none' : 'auto' // Evita interacción en cerrado
                                    }}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                            [{ size: [] }],
                                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
                                    readOnly={tpData.estado === 'Entregado'} // Solo lectura si el estado es 'Cerrado'
                                />

                                {/* Campos de fecha controlados por el estado */}
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
                                            disabled={tpData.estado !== 'Futuro'} // Solo editable si el estado es 'Futuro'
                                        />
                                    </Grid>
                                    {/* Proximamente cambiar estado Entregado por Cerrado */}
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
                                            disabled={tpData.estado === 'Entregado'} // Deshabilitado si el estado es 'Cerrado'
                                        />

                                    </Grid>
                                    {/* Proximamente cambiar estado Entregado por Cerrado */}
                                    <Grid item xs={12}>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="estado-tp-label">Estado del TP</InputLabel>
                                            <Select
                                                labelId="estado-tp-label"
                                                name="estado"
                                                value={tpData.estado}
                                                onChange={handleChange}
                                                label="Estado del TP"
                                            >
                                                <MenuItem value="Futuro">Futuro</MenuItem>
                                                <MenuItem value="En proceso">En proceso</MenuItem>
                                                <MenuItem value="En evaluación">En evaluación</MenuItem>
                                                <MenuItem value="Entregado">Entregado</MenuItem>
                                            </Select>
                                        </FormControl>
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
                    >
                        Volver
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}
                        onClick={actualizarTp}
                    >
                        Guardar Cambios
                    </Button>
                </Box>
            </Card>
        </Box>
    );
};


export default TpModificar;