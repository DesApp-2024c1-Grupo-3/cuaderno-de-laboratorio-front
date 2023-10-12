import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Height, HeightOutlined } from '@material-ui/icons';
import ListadoUsuarios from './ListadoUsuarios';
import ProTip from './ProTip';

const useStyles = makeStyles(() => ({
  card: {},
  conteinerButton: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    height: '300px',
  }
}));


export default function Home() {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Container maxWidth='xl' className={classes.conteinerButton}>
            <Button variant="contained"> cuatrimestre actual</Button>
            <Button variant="contained"> cuatrimestres anteriores</Button>
          </Container>
        </CardContent>
      </Card>
    </>
  );
}
