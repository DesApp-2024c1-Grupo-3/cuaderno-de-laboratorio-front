import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useEffect } from 'react';
import { getGrupoByCursoId } from '../../services/Grupo';
import { Container } from '@mui/system';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from 'react-bootstrap/Modal';
import { Divider } from '@material-ui/core';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function ListaDeGrupos({
  idCurso,
  show,
  closeModal,
  setGruposParaTrabajo,
}) {
  const [checked, setChecked] = React.useState([]);

  const [gruposParaTp, setGruposParaTp] = useState([]);
  const [gruposDeCurso, setGruposDeCurso] = useState([]);

  const gruposParaTpChecked = intersection(checked, gruposParaTp);
  const gruposDeCursoChecked = intersection(checked, gruposDeCurso);

  const onClose = () => {
    console.log('close');
    closeModal;
  };

  useEffect(() => {
    async function fetchGrupos() {
      console.log('show.', show);
      setGruposDeCurso([]);

      const getFunction = !show ? [] : getGrupoByCursoId(idCurso);

      try {
        const grupos = await getFunction;

        setGruposDeCurso(grupos);
      } catch (err) {
        console.log('Ocurrio este error.', err);
      }
    }
    fetchGrupos();
  }, [idCurso, show]);

  const agregarGrupo = () => {
    setGruposParaTrabajo(gruposParaTp.map((g) => `${g._id}`));
    window.alert('Se agregaron los grupos para crear el trabajo practico correctamente.');
    onClose();
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllgruposDeCurso = () => {
    setGruposDeCurso(gruposDeCurso.concat(gruposParaTp));
    setGruposParaTp([]);
  };

  const handleCheckedgruposDeCurso = () => {
    setGruposDeCurso(gruposDeCurso.concat(gruposParaTpChecked));
    setGruposParaTp(not(gruposParaTp, gruposParaTpChecked));
    setChecked(not(checked, gruposParaTpChecked));
  };

  const handleCheckedgruposParaTp = () => {
    setGruposParaTp(gruposParaTp.concat(gruposDeCursoChecked));
    setGruposDeCurso(not(gruposDeCurso, gruposDeCursoChecked));
    setChecked(not(checked, gruposDeCursoChecked));
  };

  const handleAllgruposParaTp = () => {
    setGruposParaTp(gruposParaTp.concat(gruposDeCurso));
    setGruposDeCurso([]);
  };

  const customList = (items, title) => (
    <Paper
      sx={{
        width: 200,
        height: 230,
        overflow: 'auto',
        border: 'solid #e1e1e1 1px',
      }}
    >
      <List dense component="div" role="list">
        <ListItem>
          <ListItemText primary={title}></ListItemText>
        </ListItem>
        <Divider></Divider>
        {items.map((value) => {
          const labelId = `transfer-list-item-${value._id}-label`;

          return (
            <ListItem
              key={value._id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.nombre}`} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  const style = {
    position: 'fixed',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>{customList(gruposParaTp, 'Grupos para crear TP')}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllgruposDeCurso}
              disabled={gruposParaTp.length === 0}
              aria-label="move all gruposDeCurso"
            >
              ≫
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedgruposDeCurso}
              disabled={gruposParaTpChecked.length === 0}
              aria-label="move selected gruposDeCurso"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedgruposParaTp}
              disabled={gruposDeCursoChecked.length === 0}
              aria-label="move selected gruposParaTp"
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllgruposParaTp}
              disabled={gruposDeCurso.length === 0}
              aria-label="move all gruposParaTp"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList(gruposDeCurso, 'Grupos del Curso')}</Grid>
      </Grid>
      <Container
        style={{
          display: 'flex',
          flexDirection: ' row',
          justifyContent: 'space-evenly',
          paddingTop: '4%',
        }}
      >
        <Button onClick={agregarGrupo} variant="contained" color="success">
          Agregar Grupos a Tp
        </Button>
      </Container>
    </>
  );
}

ListaDeGrupos.propTypes = {
  idCurso: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.element.isRequired,
  setGruposParaTrabajo: PropTypes.element.isRequired, // Ajusta el tipo y la obligatoriedad según tu lógica de uso
};
