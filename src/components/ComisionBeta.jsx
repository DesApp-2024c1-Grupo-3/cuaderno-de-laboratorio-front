import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Container, Alert } from '@mui/material';
import { getDataFromBackend } from '../constants/curso';
import { getCurso as getTodosLosUsuarios_fake } from '../services/curso-fake';
import { getCursoPorIdProfesor } from '../services/curso';
import { useParams, NavLink } from 'react-router-dom';
import { SubHeader } from './General/SubHeader';
import { conteinerButton } from '../style/buttonStyle';

const profesorId = '66562adbae5dabcbce08acec';

const loadingRendering = () => (
  <div>
    <p>Cargando...</p>
  </div>
);

export default function Comision() {
  const { estadoCurso } = useParams();
  const [comision, setComision] = useState(null);
  const [hasError, setHasError] = useState(false);

  const tituloHeader =
    estadoCurso === 'actual'
      ? 'Listado De Cursos | cuatrimestre actual '
      : 'Listado De Cursos | cuatrimestre anterior';

  useEffect(() => {
    async function fetchCommision() {
      const getFunction = getDataFromBackend 
        ? getCursoPorIdProfesor 
        : getTodosLosUsuarios_fake;

      try {
        const commision = await getFunction(profesorId);
        setComision(commision);
      } catch (err) {
        console.log('Ocurrió este error.', err);
        setHasError(true);
      }
    }

    fetchCommision();
  }, []);

  const comisionRendering = () => (
    <>
      <Card>
        <CardContent>
          <Container>
            <SubHeader titulo={tituloHeader} />
            <Container sx={conteinerButton}>
              {comision.map((it) => (
                <Button
                  component={NavLink}
                  to={`/tps/${it._id}/${profesorId}`}
                  variant="contained"
                  key={it._id}
                >
                  {`${it.materia.nombre}`} | {`${it.comision}`}
                </Button>
              ))}
            </Container>
            <Button color="primary" component={NavLink} to="/">
              Volver
            </Button>
          </Container>
        </CardContent>
      </Card>
    </>
  );

  const errorRendering = () => (
    <Alert severity="warning">
      No pudimos cargar el usuario. ¿Levantaste la API?{' '}
      <span role="img" aria-label="thinking">
        🤔
      </span>
    </Alert>
  );

  return hasError ? errorRendering() : comision == null ? loadingRendering() : comisionRendering();
}
