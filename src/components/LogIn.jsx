import React, { useState } from 'react';
import { Button, Card, CardContent, Container, TextField, Typography, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Header} from './General/Header';

const LogIn = () => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <Card>
      <Header />
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
              component={NavLink}
              to={`/comision/actual`}
              variant="contained"
              fullWidth
              sx={{ mb: 2 }}
            >
              Ingresar (Prof C act)
            </Button>
            <Button
              component={NavLink}
              to={`/alumno/curso`}
              variant="text"
              fullWidth
            >
              Olvidé la contraseña (Al C act)
            </Button>
          </Box>
        </Container>
      </CardContent>
    </Card>
  );
}

export default LogIn;
