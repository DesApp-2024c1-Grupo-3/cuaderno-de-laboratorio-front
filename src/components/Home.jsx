import React from 'react';
import { Button, Card, CardContent, Container } from '@mui/material';
import { conteinerButton } from '../style/buttonStyle';
import { NavLink } from 'react-router-dom';

const getCuatrimestreYAnio = () => {
  const fecha = new Date();
  const mes = fecha.getMonth() + 1; // Los meses en JavaScript son de 0 a 11
  const anio = fecha.getFullYear();
  let cuatrimestre = '';

  if (mes >= 3 && mes <= 7) {
    cuatrimestre = `Primer Cuatrimestre ${anio}`;
  } else if (mes >= 8 && mes <= 12) {
    cuatrimestre = `Segundo Cuatrimestre ${anio}`;
  } else {
    cuatrimestre = `Fuera de período de cuatrimestre ${anio}`;
  }

  return cuatrimestre;
}

const Home = () => {
  const cuatrimestreActual = getCuatrimestreYAnio();

  return (
    <>
      <Card>
        <CardContent>
          <Container maxWidth="xl" sx={conteinerButton}>
            <Button
              component={NavLink}
              to={`/comision/actual`}
              variant="contained"
            >
              {`Cuatrimestre Actual Profesor (${cuatrimestreActual})`}
            </Button>
            <Button
              component={NavLink}
              to={`/alumno/curso`}
              variant="contained"
            >
              {`Cuatrimestre Actual Alumno (${cuatrimestreActual})`}
            </Button>
          </Container>
        </CardContent>
      </Card>
    </>
  );
}

export default Home;
