import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Container, TextField, Typography, Box } from '@mui/material';
import { NavLink, useHistory } from 'react-router-dom';
import { getTodosLosProfesoresJson } from '../services/Profesor';
import { getTodosLosAlumnosJson } from '../services/Alumnos';
import { Header } from './General/Header';
import { useKeycloak } from '@react-keycloak/web';

const LogIn = () => {

  const history = useHistory();
  const { keycloak } = useKeycloak();
  
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Lógica para buscar DNI entre profesor y alumno
  const handleLogin = async () => {
    try {
      setError(null); // Reset error

      // Llamadas a las funciones para obtener la lista de profesores y alumnos
      const profesores = await getTodosLosProfesoresJson();
    
      const alumnos = await getTodosLosAlumnosJson();
    

      const profesor = profesores.find(prof => prof.dni === parseInt(dni));
      if (profesor) {
    
        window.location.href = `/comision/actual/${profesor._id}`;
        return;
      }

      const alumno = alumnos.find(alumn => alumn.dni === parseInt(dni));
      if (alumno) {
        console.log("Usuario alumno encontrado");
        window.location.href = `/alumno/curso/${alumno._id}`;
        return;
      }

      window.alert('Usuario no encontrado');
    } catch (error) {
      console.error('Error al buscar el usuario', error);
      window.alert("Ocurrió un error al intentar ingresar. Por favor, intenta nuevamente.");
    }
  };

  // Efecto para manejar la autenticación con Keycloak
  useEffect(() => {
    const handleKeycloakLogin = async () => {
      if (keycloak.authenticated) {
        // Obtener el DNI del token de Keycloak 
        const userDni = keycloak.tokenParsed?.preferred_username;

        // Llamadas para obtener profesores y alumnos
        const profesores = await getTodosLosProfesoresJson();
        const alumnos = await getTodosLosAlumnosJson();

        const profesor = profesores.find(prof => prof.dni === parseInt(userDni));
        if (profesor) {
          history.push(`/comision/actual/${profesor._id}`);
          return;
        }

        const alumno = alumnos.find(alumn => alumn.dni === parseInt(userDni));
        if (alumno) {
          history.push(`/alumno/curso/${alumno._id}`);
          return;
        }

        window.alert('Usuario no encontrado');
      } else {
        keycloak.login(); // Redirige a la página de inicio de sesión de Keycloak
      }
    };

    handleKeycloakLogin();
  }, [keycloak, history]);

  return (
    <Card>
      <Header />
      <CardContent>
        <Container maxWidth="xs">
          <Typography variant="h4" component="h1" gutterBottom textAlign="center" fontWeight="bold">
            Iniciar Sesión
          </Typography>
          <TextField
            label="DNI"
            value={dni}
            onChange={handleDniChange}
            variant="outlined"
            fullWidth
            margin="normal"
            autoComplete='off'
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            variant="outlined"
            fullWidth
            margin="normal"
            autoComplete='off'
          />
          <Box mt={2}>
            <Button
              onClick={handleLogin}
              variant="contained"
              fullWidth
              sx={{ mb: 3.5, backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}
            >
              Ingresar
            </Button>
            <Button
              component={NavLink}
              to={'/#'}
              fullWidth
              variant="contained" 
              sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
            >
              Olvidé la contraseña
            </Button>
          </Box>
        </Container>
      </CardContent>
    </Card>
  );
};

export default LogIn;