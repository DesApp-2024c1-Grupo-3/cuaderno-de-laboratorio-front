import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
    Card, CardContent, Container, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Box
    , Grid
} from '@mui/material';
import { getAlumnoPorId } from '../../services/Alumnos';
import axios from 'axios';

const CursosAlum = () => {
    const { alumnoId } = useParams();
    const [cursos, setCursos] = useState(null);
    const [hasError, setHasError] = useState(false);
    const history = useHistory();

    useEffect(() => {
        async function fetchData() {
            try {
                const cursos = await getAlumnoPorId('6649226549ae2f87255cc230')
                setTps(cursos);
            } catch (error) {
                console.error('Error fetching data:', error);
                setHasError(true);
            }
        }

        fetchData();
    }, [alumnoId]);


    const handleVolver = () => {
        history.push(`/comision`);
    };

    /*async function pruebaObtenerCursos() {
        try {
            const alumnoId = '6649226549ae2f87255cc230'; // Reemplaza 123 con el ID del alumno que deseas obtener
            const cursos = await getAlumnoPorId(alumnoId);
            console.log('Cursos del alumno:', cursos);
        } catch (error) {
            console.error('Error al obtener cursos del alumno:', error.message);
        }
    }

    // Llama a la función de prueba
    pruebaObtenerCursos();*/



    const cursosRendering = () => (
        <Box display="flex" flexDirection="column">
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                        Cursos del Alumno
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: '50%', fontSize: '15px' }}>Materia</TableCell>
                                    <TableCell style={{ width: '50%', fontSize: '15px' }}>Comisión</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cursos.map((curso) => (
                                    <TableRow key={curso._id}>

                                        <TableCell>{curso.comision}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid container spacing={2} justifyContent="space-between" marginTop='20px'>
                        <Grid item>
                            <Button variant="contained" onClick={handleVolver}>Volver</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );

    const loadingRendering = () => (
        <div>Cargando cursos...</div>
    );

    const errorRendering = () => (
        <div>Error al cargar los cursos.</div>
    );

    return hasError
        ? errorRendering()
        : !cursos
            ? loadingRendering()
            : cursosRendering();
};

export default CursosAlum;
