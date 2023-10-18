import { Link, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Alert } from '@material-ui/lab';
import { getUsuarioPorId } from '../services/usuarios';
import { getUsuarioPorId as getUsuarioPorId_fake } from '../services/usuarios-fake';
import { getDataFromBackend } from '../constants/constants';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function DatosUsuario() {
  const { id } = useParams();
  const classes = useStyles();

  const [usuario, setUsuario] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchUsuario() {
      try {
        const getFunction = getDataFromBackend
          ? getUsuarioPorId
          : getUsuarioPorId_fake;
        const usuario = await getFunction(id);
        setUsuario(usuario);
      } catch (err) {
        setHasError(true);
      }
    }
    fetchUsuario();
  }, [id]);

  const usuarioRendering = () => {
    return [
      <Card className={classes.root} key="datosUsuario">
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Avatar"
            height="300"
            image={usuario.avatarUrl}
            title="Avatar"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {`${usuario.nombre} ${usuario.apellido}`}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Nació el {usuario.fechaNacimiento}. Si aún viviera tendría{' '}
              {usuario.edad} años.
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>,
      <Button color="primary" component={Link} to="/" key="botonVolver">
        Volver
      </Button>,
    ];
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

  const loadingRendering = () => {
    return <Alert severity="info">Cargando usuarie ...</Alert>;
  };

  return hasError
    ? errorRendering()
    : usuario == null
      ? loadingRendering()
      : usuarioRendering();
}
