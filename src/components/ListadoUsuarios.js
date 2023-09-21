import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import {
  Avatar,
  Divider,
  Grid,
  IconButton,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { DateTime } from 'luxon';
import { Face } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { getTodosLosUsuarios } from '../services/usuarios';
import { getTodosLosUsuarios as getTodosLosUsuarios_fake } from '../services/usuarios-fake';
import { getDataFromBackend } from '../constants/constants';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  alert: {
    width: '100%',
  },
  title: {
    fontSize: 15,
  },
}));

function fechaFormatoHumano(fecha) {
  return DateTime.fromISO(fecha)
    .setLocale('es')
    .toLocaleString(DateTime.DATE_FULL);
}

export default function ListadoUsuarios() {
  const classes = useStyles();
  const [usuarios, setUsuarios] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchUsuarios() {
      const getFunction = getDataFromBackend
        ? getTodosLosUsuarios
        : getTodosLosUsuarios_fake;
      try {
        const usuarios = await getFunction();
        setUsuarios(usuarios);
      } catch (err) {
        setHasError(true);
      }
    }
    fetchUsuarios();
  }, []);

  const usuariosRendering = () => {
    return [
      <Alert severity="info" className={classes.alert} key="alert">
        {getDataFromBackend
          ? 'Los usuarios que están más abajo vienen de la API.'
          : 'Estos usuarios son fijos'}
      </Alert>,
      <List className={classes.root} key="usuarios">
        {usuarios.map((it, index) => (
          <div key={it.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={it.avatarUrl} />
              </ListItemAvatar>
              <ListItemText
                primary={`${it.apellido}, ${it.nombre}`}
                secondary={`Nació el ${fechaFormatoHumano(
                  it.fechaNacimiento
                )}.`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  component={Link}
                  to={`/usuarios/${it.id}`}
                >
                  <Face />
                </IconButton>
                <Link style={{ marginLeft: '10px' }} to={`/usuarios/${it.id}`}>
                  Ver detalle
                </Link>
              </ListItemSecondaryAction>
            </ListItem>
            {/* Hack para que no muestre el divider en el último elemento */}
            {index !== usuarios.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </div>
        ))}
      </List>,
    ];
  };

  const errorRendering = () => {
    return (
      <Alert severity="warning">
        No pudimos cargar los usuarios. ¿Levantaste la API?{' '}
        <span role="img" aria-label="thinking">
          🤔
        </span>
      </Alert>
    );
  };

  const loadingRendering = () => {
    return <Alert severity="info">Cargando usuaries ...</Alert>;
  };

  return (
    <Grid container>
      {hasError
        ? errorRendering()
        : usuarios == null
        ? loadingRendering()
        : usuariosRendering()}
    </Grid>
  );
}
