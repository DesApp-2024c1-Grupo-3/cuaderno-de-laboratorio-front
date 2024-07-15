import React, { useState } from 'react';
import { Button, Card, CardContent, Container, TextField, Typography, Box } from '@mui/material';
import { NavLink} from 'react-router-dom';
import { getTodosLosProfesoresJson } from '../services/Profesor';
import { getTodosLosAlumnosJson } from '../services/Alumnos';
import { Nav } from 'react-bootstrap';

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
    try {
      setError(null); // Reset error

      const profesores = await getTodosLosProfesoresJson();
      const alumnos = await getTodosLosAlumnosJson();

      const profesor = profesores.find(prof => prof.dni === parseInt(dni));
        if (profesor) {
          console.log("entro en profe");
          //navegate(`/comision/actual/${profesor._id}`); // NO SE POR QUE NO ANDA ESTE
          window.location.href = `/comision/actual/${profesor._id}`;
        return;
        }

      const alumno = alumnos.find(alumn => alumn.dni === parseInt(dni));
        if(alumno) {
          console.log("entro en alumno");
          //navegate(`/alumno/curso/${alumno._id}`); // NO SE POR QUE NO ANDA ESTE
          window.location.href = `/alumno/curso/${alumno._id}`;
          return;
        }

       window.alert('Usuario no encontrado');
     } catch (error) {
       console.error('Error al buscar el usuario', error);
       window.alert("Ocurrió un error al intentar ingresar. Por favor, intenta nuevamente.");
      }
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
