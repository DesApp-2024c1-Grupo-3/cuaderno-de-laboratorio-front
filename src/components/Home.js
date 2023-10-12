import {
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ListadoUsuarios from './ListadoUsuarios';
import ProTip from './ProTip';

const useStyles = makeStyles(() => ({
  card: {},
  conteinerButton: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));


export default function Home() {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <container maxWidth='xl' className={classes.conteinerButton}>
            <Button variant="contained"> cuatrimestre actual</Button>
            <Button variant="contained"> cuatrimestres anteriores</Button>
          </container>
        </CardContent>
      </Card>
    </>
  );
}
