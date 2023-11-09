import {
  Button,
  Card,
  CardContent,
  Container,
  makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDataFromBackend } from '../constants/tps';
import { conteinerButton } from '../style/buttonStyle';
import { botonesSeleccion } from '../style/buttonStyle';
import { botonAgregar } from '../style/buttonStyle';
import { getTps as getTps_fake } from '../services/tps-fake';
import { getTodosLosTps } from '../services/tps';
import { NavLink } from 'react-router-dom';
import { conteinerButtonSeleccionTp } from '../style/buttonStyle';
import { SubHeader } from './General/SubHeader';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const useStyles = makeStyles(() => ({
  card: {},
  conteinerButton,
  botonesSeleccion,
  conteinerButtonSeleccionTp,
  botonAgregar,
  curso: { display: 'inline-grid' },
}));

export default function Tps() {
  const { idCurso } = useParams();

  const classes = useStyles();

  const [tps, setTps] = useState(null);
  const [hasError, setHasError] = useState(false);
  const tituloTps = 'Tps | Comision ' + idCurso;
  console.log({ idCurso });

  useEffect(() => {
    console.log('useEfect');
    async function fetchTps() {
      console.log('useEfect1');

      try {
        const getFunction = getDataFromBackend
          ? getTodosLosTps // DE COMISION IdCurso
          : getTps_fake;
        const getTps = await getFunction();
        setTps(getTps);
      } catch (err) {
        setHasError(true);
      }
    }
    fetchTps();
  }, []);

  const tpsRendering = () => {
    console.log('tpsRendering');

    return [
      <>
        <Card className={classes.card}>
          <CardContent>
            <Container maxWidth="xxl" className={classes.curso}>
              <SubHeader titulo={tituloTps} />
              <Container maxWidth="xxl" className={classes.conteinerButton}>
                {tps.map((it) => (
                  <Button key={it.id} variant="contained" maxWidth="xxl">
                    {`${it.materia} `}
                    {`| Alumnos ${it.alumnos}`} {`| ${it.grupos} Grupos`}
                  </Button>
                ))}
              </Container>
            </Container>
            <Container className={classes.botonAgregar}>
              <Button component={NavLink} to="/crearTps" variant="contained">
                Agregar TP +
              </Button>
            </Container>

            <Button
              color="primary"
              component={NavLink}
              to="/comision"
              key="botonVolver"
            >
              Volver
            </Button>
          </CardContent>
        </Card>
      </>,
    ];
  };

  const loadingRendering = () => {
    return <Alert severity="info">Cargando usuarie ...</Alert>;
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
    : tps == null
    ? loadingRendering()
    : tpsRendering();
}
