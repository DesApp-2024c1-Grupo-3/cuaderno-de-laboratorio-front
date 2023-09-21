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
  card: {
    marginTop: '20px',
  },
}));

function EjemploApi() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <ListadoUsuarios />
      </CardContent>
    </Card>
  );
}

function ClonarProyecto() {
  return (
    <>
      <ProTip />
      <Grid container justify="center">
        <Button
          variant="contained"
          color="primary"
          href="https://github.com/unahur-desapp/react-recoil-app-seed/generate"
        >
          ¡Quiero crear mi proyecto!
        </Button>
      </Grid>
    </>
  );
}

export default function Home() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Repositorio semilla React - Material UI
      </Typography>
      <EjemploApi />
      <ClonarProyecto />
    </>
  );
}
