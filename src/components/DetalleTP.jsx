import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Divider,
    TextField,
    Typography,
    Card,
    CardContent,
} from '@mui/material';
import { getTpPorId, getCursoPorId } from '../services/tps';

const TpDetalle = () => {
    const { idCurso, profesorId, tpId } = useParams();
    const [tp, setTp] = useState({
        nombre: '',
        fechaInicio: '',
        fechaFin: '',
        consigna: '',
        grupos: [],
    });
    const [curso, setCurso] = useState({
        alumnos: [],
    });
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        async function fetchTp() {
            try {
                if (tpId) {
                    const tpData = await getTpPorId(idCurso, tpId);
                    const cursoData = await getCursoPorId(idCurso);
                    setTp({
                        ...tpData,
                        consigna: removePTags(tpData.consigna),
                    });
                    setCurso(cursoData);
                    setLoading(false);
                } else {
                    console.error('tpId es undefined');
                    setHasError(true);
                    setLoading(false);
                }
            } catch (err) {
                setHasError(true);
                setLoading(false);
            }
        }
        fetchTp();
    }, [idCurso, tpId]);

    const removePTags = (htmlString) => {
        if (htmlString) {
            return htmlString.replace(/<\/?p>/g, '');
        } else {
            return 'No hay consigna';
        }
    };

    const formatFecha = (fechaHora) => {
        const fecha = fechaHora.split('T')[0];
        return fecha;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTp((prevTp) => ({
            ...prevTp,
            [name]: value,
        }));
    };

    const tpFormRendering = () => (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Detalles del Trabajo Práctico
                    </Typography>
                    <Divider />
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            name="nombre"
                            value={tp.nombre}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Fecha de Inicio"
                            name="fechaInicio"
                            type="date"
                            value={formatFecha(tp.fechaInicio)}
                            onChange={handleInputChange}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Fecha de Fin"
                            name="fechaFin"
                            type="date"
                            value={formatFecha(tp.fechaFin)}
                            onChange={handleInputChange}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Consigna"
                            name="consigna"
                            value={tp.consigna}
                            onChange={handleInputChange}
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        <Typography variant="h6" gutterBottom>
                            Cantidad de Alumnos: {curso.alumnos.length}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Cantidad de Grupos: {tp.grupos.length}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" color="primary" onClick={() => history.goBack()}>
                                Volver
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );

    const loadingRendering = () => <Typography>Cargando detalles del Tp...</Typography>;

    const errorRendering = () => <Typography>Error al cargar los detalles del Tp</Typography>;

    return hasError ? errorRendering() : loading ? loadingRendering() : tpFormRendering();
};

export default TpDetalle;
