import {
  Button,
  Card,
  CardContent,
  Container,
  makeStyles,
} from '@material-ui/core';
import { conteinerButton } from '../style/buttonStyle';
import { NavLink } from 'react-router-dom/cjs/react-router-dom';

const useStyles = makeStyles(() => ({
  card: {},
  conteinerButton,
}));

export default function Home() {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Container maxWidth="xl" className={classes.conteinerButton}>
            <Button
              component={NavLink}
              to={`/comision/actual`}
              variant="contained"
            >
              {' '}
              cuatrimestre actual
            </Button>
            <Button
              component={NavLink}
              to={`/comision/anterior`}
              variant="contained"
            >
              {' '}
              cuatrimestres anteriores
            </Button>
          </Container>
        </CardContent>
      </Card>
    </>
  );
}
