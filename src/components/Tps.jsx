import React, { useState, useEffect } from 'react';
import { Alert } from '@mui/lab';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getTpsByCursoId, deleteTp } from '../services/tps';
import { SubHeader } from './General/SubHeader';

export default function Tps() {
  const { idCurso, profesorId } = useParams();
  const [tps, setTps] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTp, setSelectedTp] = useState(null);
  const history = useHistory();

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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '70vh' }}>
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <SubHeader titulo={`Trabajos Prácticos`} />
          <Divider />
          <Container
            maxWidth="xxl"
            style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}
          >
            {tps.map((tp) => (
              <div key={tp.id} style={{ display: 'flex', justifyContent: 'center', margin: '5px' }}>
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
            style={{
              margin: 'auto',
              marginTop: '20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '16px',
            }}
          >
            Agregar TP +
          </Button>
        </CardContent>
      </Card>
      <Button color="primary" component={NavLink} to="/comision" style={{ margin: '20px auto' }}>
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
