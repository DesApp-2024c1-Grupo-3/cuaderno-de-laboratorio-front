import React from 'react';
import { Button, Card, CardContent, Container } from '@mui/material';
import { conteinerButton } from '../style/buttonStyle';
import { NavLink } from 'react-router-dom';

const Home = () => {
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
              {' '}
              cuatrimestre actual Profesor
            </Button>
            <Button
              component={NavLink}
              to={`/alumno/curso`}
              variant="contained"
            >
              {' '}
              cuatrimestre actual Alumno
            </Button>
          </Container>
        </CardContent>
      </Card>
    </>
  );
}

export default Home;
