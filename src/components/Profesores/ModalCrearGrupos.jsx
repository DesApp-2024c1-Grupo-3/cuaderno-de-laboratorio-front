import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from 'react-bootstrap/Modal';
import {
  Button,
  Container,
  Divider,
  TextField,
  makeStyles,
} from '@material-ui/core';
import { useState } from 'react';
import { SubHeader } from '../General/SubHeader';
import { Autocomplete } from '@material-ui/lab';
import {
  buttonVolver,
  contButtonVolver,
  conteinerButtonRow,
} from '../../style/buttonStyle';
import PropTypes from 'prop-types';
import { getTodosLosAlumnos } from '../../services/Alumnos';
import { getTodosLosAlumnos as getTodosLosAlumnos_Fake } from '../../services/alumnos-fake';

import { useEffect } from 'react';
import { getDataFromBackend } from '../../constants/Alumnos';
import { Stack } from '@mui/material';
import { Height } from '@material-ui/icons';
import { postCrearGrupo } from '../../services/Grupo';

const useStyles = makeStyles(() => ({
  contButtonVolver,
  buttonVolver,
  conteinerButtonRow,
}));

const style = {
  position: 'fixed',
  top: '35%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const ModalCrearGrupos = ({ show, closeModal, idCurso }) => {
  const classes = useStyles();
  const [listAlumnos, setListAlumnos] = useState([]);
  const [hasError, setHasError] = useState(false);

  const onClose = () => {
    closeModal();
  };
  const [nombreGrupo, setNombreGrupo] = useState('');

  const [grupoData, setGrupoData] = useState({
    nombre: '',
    alumnos: [],
  });

  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);

  const guardarAlumnos = (event, value) => {
    setAlumnosSeleccionados(value);
  };

  console.log(alumnosSeleccionados, 'alumnGrrup');
  const guardarNombre = (event) => {
    setNombreGrupo(event.target.value);
  };
  const handleChange = (event) => {
    setGrupoData({
      nombre: { nombreGrupo },
      alumnos: { alumnosSeleccionados },
    });
    crearGrupo();
    onClose();
  };

  const validarDatos = () => {
    if (!grupoData.nombre || grupoData.alumnos.length > 0) {
      window.alert('Completa todos los campos obligatorios: Nombre, alumnos');
      return false;
    }
    return true;
  };

  const crearGrupo = async () => {
    if (!validarDatos()) {
      return;
    }
    try {
      // Lógica para hacer la solicitud al backend
      const response = await postCrearGrupo(grupoData);
      console.log(response);
      if (response.status === 201) {
        // Redirige a la página después de crear el TP
        window.alert('Grupo creado correctamente');
      } else {
        console.error('Error al crear grupo');
        // Manejo de errores según sea necesario
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      // Manejo de errores según sea necesario
      window.alert('Error en la solicitud');
    }
  };

  useEffect(() => {
    async function fetchAlumnos() {
      try {
        const alumnos = await getTodosLosAlumnos(idCurso);
        setListAlumnos(alumnos);
      } catch (err) {
        console.log('Ocurrio este error.', err);
        setHasError(true);
      }
    }
    fetchAlumnos();
  }, [show]);
  return (
    <>
      <Modal show={show} onHide={onClose}>
        <Box sx={style}>
          <Container className={classes.contButtonVolver}>
            <Typography>materia|cuatrimestre|comision</Typography>
            <Divider></Divider>
          </Container>

          <Container style={{ padding: '15px' }}>
            <TextField
              id="standard-basic"
              label="Nombre del Grupo"
              variant="standard"
              value={nombreGrupo}
              onChange={guardarNombre}
            />
          </Container>
          <Container style={{ padding: '15px' }}>
            <Stack spacing={3}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={listAlumnos}
                getOptionLabel={(option) =>
                  option.nombre + ' ' + option.apellido
                }
                filterSelectedOptions
                onChange={guardarAlumnos}
                value={alumnosSeleccionados}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Alumnos"
                    placeholder="seleccionar"
                  />
                )}
              />
            </Stack>
          </Container>
          <Container
            style={{ maxHeight: '10px', padding: '15px' }}
            className={classes.conteinerButtonRow}
          >
            <Button className={classes.buttonVolver} onClick={onClose}>
              Close
            </Button>
            <Button
              className={classes.buttonVolver}
              style={{ backgroundColor: 'green' }}
              onClick={handleChange}
            >
              Crear
            </Button>
          </Container>
        </Box>
      </Modal>
    </>
  );
};

ModalCrearGrupos.propTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.bool.isRequired, // Ajusta el tipo y la obligatoriedad según tu lógica de uso
  idCurso: PropTypes.string.isRequired,
};
