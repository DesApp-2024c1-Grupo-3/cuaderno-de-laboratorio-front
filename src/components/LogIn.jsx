import React, { useState } from 'react';
import { Button, Card, CardContent, Container, TextField, Typography, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { getTodosLosProfesores, getProfesorPorId } from '../services/Profesor';
import { getTodosLosAlumnos, getAlumnoPorId, getAlumnoById, GetIdAlumnoByDNI } from '../services/Alumnos';
import { getTodosLasCursos } from '../services/curso';

const LogIn = () => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // logica para buscar dni entre profesor y alumno
  const handleLogin = async () => {
    //try {
      setError(null); // Reset error

      const profesores = await getTodosLosProfesores();
      console.log("lo que trae profesores: " + profesores);

      // const cursos = await getTodosLasCursos();
      // console.log("lo que trae todo los cursos" + cursos);

      const alumnos = await getTodosLosAlumnos();
      console.log("lo que trae por dni: " + alumnos);

      //const profesor = profesores.find(prof => prof.dni === parseInt(dni));
      //if (profesor) {
      //  navigate(`/comision/actual`);
      //  return;
     // }

      //const alumnos = await getTodosLosAlumnos();
    //   const alumno = alumnos.find(alum => alum.dni === parseInt(dni));
    //   if (alumno) {
    //     navigate(`/alumno/curso`);
    //     return;
    //   }

    //   setError('Usuario no encontrado');
    // } catch (error) {
    //   console.error('Error al buscar el usuario', error);
    //   setError('Ocurrió un error al intentar ingresar. Por favor, intenta nuevamente.');
    // }
  };

  return (
    <Card>
      <CardContent>
        <Container maxWidth="xs">
          <Typography variant="h4" component="h1" gutterBottom textAlign="center" fontWeight="bold">
            Ingreso
          </Typography>
          <TextField
            label="DNI"
            value={dni}
            onChange={handleDniChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Box mt={2}>
            <Button
              onClick={handleLogin}
              variant="contained"
              fullWidth
              sx={{ mb: 2 }}
            >
              Ingresar
            </Button>
            <Button
              component={NavLink}
              to={'/#'}
              variant="text"
              fullWidth
            >
              Olvidé la contraseña
            </Button>
          </Box>
        </Container>
      </CardContent>
    </Card>
  );
}

export default LogIn;
