import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { NavLink } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getTpsByCursoId, deleteTp } from '../services/tps';
import { SubHeader } from './General/SubHeader';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const useStyles = makeStyles(() => ({
  contenedor: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '70vh',
  },
  card: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  conteinerButtonSeleccionTp: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
  },
  botonesSeleccion: {
    margin: '5px',
    display: 'flex',
    justifyContent: 'center',
  },
  botonAgregarTp: {
    margin: 'auto',
    marginTop: '20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: '#45a049',
    },
  },
}));

export default function Tps() {
  const { idCurso, profesorId } = useParams();
  const classes = useStyles();
  const [tps, setTps] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTp, setSelectedTp] = useState(null);

  const handleClick = (event, tp) => {
    setAnchorEl(event.currentTarget);
    setSelectedTp(tp);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteTp = async () => {
    try {
      const response = await deleteTp(selectedTp._id);

      if (response.status === 200) {
        // Elimina el TP de la lista local
        setTps((prevTps) => prevTps.filter((tp) => tp.id !== selectedTp._id));
        handleClose();

        // Vuelve a obtener la lista actualizada de TPs
        const updatedTps = await getTpsByCursoId(idCurso);
        setTps(updatedTps);
      } else {
        console.error('Error al eliminar TP');
        // Manejo de errores según sea necesario
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      // Manejo de errores según sea necesario
    }
  };

  useEffect(() => {
    async function fetchTps() {
      try {
        const getTps = await getTpsByCursoId(idCurso);
        setTps(getTps);
      } catch (err) {
        setHasError(true);
      }
    }
    fetchTps();
  }, [idCurso]);

  const tpsRendering = () => (
    <div className={classes.contenedor}>
      <Card className={classes.card}>
        <CardContent>
          <SubHeader titulo={`Trabajos Prácticos`} />
          <Divider />
          <Container
            maxWidth="xxl"
            className={classes.conteinerButtonSeleccionTp}
          >
            {tps.map((tp) => (
              <div key={tp.id} className={classes.botonesSeleccion}>
                {/* Usamos NavLink para redireccionar al detalle del TP */}
                <NavLink
                  to={`/tp/${idCurso}/${profesorId}/${tp._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="contained"
                    style={{ width: '900px', padding: '10px' }}
                  >
                    {` ${tp.nombre}`} | Grupal : {` ${tp.grupal ? 'Si' : 'No'}`}
                  </Button>
                </NavLink>
                <IconButton
                  aria-label="more"
                  onClick={(event) => handleClick(event, tp)}
                >
                  <MoreVertIcon />
                </IconButton>
              </div>
            ))}
          </Container>
          <Button
            component={NavLink}
            to={`/crearTps/${idCurso}/${profesorId}`}
            variant="contained"
            className={classes.botonAgregarTp}
          >
            Agregar TP +
          </Button>
        </CardContent>
      </Card>
      <Button color="primary" component={NavLink} to="/comision">
        Volver
      </Button>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleDeleteTp}>Eliminar</MenuItem>
        <MenuItem>Editar</MenuItem>

        {/* Agrega aquí más opciones de menú según sea necesario */}
      </Menu>
    </div>
  );

  const loadingRendering = () => (
    <Alert severity="info">Cargando usuarie ...</Alert>
  );

  const errorRendering = () => (
    <Alert severity="warning">
      No pudimos cargar el usuario. ¿Levantaste la API?{' '}
      <span role="img" aria-label="thinking">
        🤔
      </span>
    </Alert>
  );

  return hasError
    ? errorRendering()
    : tps == null
    ? loadingRendering()
    : tpsRendering();
}
