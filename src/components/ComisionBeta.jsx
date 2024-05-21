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

const profesorId = '66185bbf137a18b481db71d2';
const loadingRendering = () => {
  return (
    <div>
      <p>Cargando...</p>
    </div>
  );
};
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
        // Agregar el ID del profesor según la información que tengas en tu base de datos local.
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
            <Container >
              <SubHeader titulo={tituloHeader} />

              <Container  sx={conteinerButton}>
                {comision.map((it) => (
                  //Falta Nombre de la Materia
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
            <Button variant="contained" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }} component={NavLink} to="/">
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