import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Container } from '@mui/material';
import { Alert } from '@mui/material';
import { getDataFromBackend } from '../constants/curso';
import { getCurso as getTodosLosUsuarios_fake } from '../services/curso-fake';
import { conteinerButton } from '../style/buttonStyle';
import { getCursoPorIdProfesor } from '../services/curso';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { SubHeader } from './General/SubHeader';

const profesorId = '6649226549ae2f87255cc248';

const loadingRendering = () => {
  return (
    <div>
      <p>Cargando...</p>
    </div>
  );
};

// Definir la función getCuatrimestreYAnio
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

export default function Comision() {
  const { estadoCurso } = useParams();
  const [comision, setComision] = useState(null);
  const [hasError, setHasError] = useState(false);

  // Obtener el cuatrimestre actual
  const cuatrimestreActual = getCuatrimestreYAnio();

  const tituloHeader =
    estadoCurso === 'actual'
      ? `Listado De Cursos | ${cuatrimestreActual}`
      : 'Listado De Cursos | cuatrimestre actual';

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

  const comisionRendering = () => {
    return (
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
            </Container>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
              component={NavLink}
              to="/"
            >
              Volver
            </Button>
          </CardContent>
        </Card>
      </>
    );
  };

  const errorRendering = () => {
    return (
      <Alert severity="warning">
        No pudimos cargar el usuario. ¿Levantaste la API?{' '}
        <span role="img" aria-label="thinking">
          🤔
        </span>
      </Alert>
    );
  };

  return hasError
    ? errorRendering()
    : comision == null
      ? loadingRendering()
      : comisionRendering();
}
