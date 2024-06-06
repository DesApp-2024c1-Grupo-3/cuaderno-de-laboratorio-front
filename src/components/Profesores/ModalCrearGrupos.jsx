import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from 'react-bootstrap/Modal';
import {
  Button,
  Container,
  Divider,
  TextField,
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import { getTodosLosAlumnos } from '../../services/Alumnos';
import { getTodosLosAlumnos as getTodosLosAlumnos_Fake } from '../../services/alumnos-fake';
import { postCrearGrupo } from '../../services/Grupo';
import { getDataFromBackend } from '../../constants/Alumnos';

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

export const ModalCrearGrupos = ({ show, closeModal, idCurso, actualizarListaGrupos, alumnosDisponibles }) => {
  const [listAlumnos, setListAlumnos] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [alumnosGrupo, setAlumnosGrupo] = useState([]);

  const onClose = () => {
    closeModal();
  };

  const guardarAlumnos = (event, value) => {
    setAlumnosGrupo(value);
  };

  const guardarNombre = (event) => {
    setNombreGrupo(event.target.value);
  };

  const handleChange = () => {
    crearGrupo();
    onClose();
  };

  const validarDatos = () => {
    return nombreGrupo !== '' && alumnosGrupo.length > 0;
  };

  const crearGrupo = async () => {
    if (!validarDatos()) {
      return;
    }
    try {
      const response = await postCrearGrupo({
        nombre: nombreGrupo,
        alumnos: alumnosGrupo,
      });
      if (response.status === 201) {
        window.alert('Grupo creado correctamente');
        actualizarListaGrupos(); // Actualiza la lista de grupos después de crear uno nuevo
      } else {
        console.error('Error al crear grupo');
        window.alert('Error al crear grupo');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      window.alert('Error en la solicitud');
    }
  };

  useEffect(() => {
    if (alumnosDisponibles.length) {
      setListAlumnos(alumnosDisponibles);
    } else {
      async function fetchAlumnos() {
        const getFunction = getDataFromBackend
          ? getTodosLosAlumnos
          : getTodosLosAlumnos_Fake;
        try {
          const alumnos = await getFunction();
          setListAlumnos(alumnos);
        } catch (err) {
          console.log('Ocurrió este error.', err);
          setHasError(true);
        }
      }
      fetchAlumnos();
    }
  }, [alumnosDisponibles]);

  return (
    <>
      <Modal show={show} onHide={onClose}>
        <Box sx={style}>
          <Container>
            <Typography>materia|cuatrimestre|comision</Typography>
            <Divider />
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
            <Autocomplete
              multiple
              id="tags-outlined"
              options={listAlumnos}
              getOptionLabel={(option) => option.nombre + ' ' + option.apellido}
              value={alumnosGrupo}
              filterSelectedOptions
              onChange={guardarAlumnos}
              renderInput={(params) => (
                <TextField {...params} label="Alumnos" placeholder="Seleccionar" />
              )}
            />
          </Container>

          <Container style={{ maxheight: '10px', padding: '15px' }}>
            <Button onClick={onClose}>Close</Button>
            <Button
              style={{ backgroundColor: 'green' }}
              onClick={handleChange}
              disabled={!validarDatos()}
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
  closeModal: PropTypes.func.isRequired,
  idCurso: PropTypes.string.isRequired,
  actualizarListaGrupos: PropTypes.func.isRequired,
  alumnosDisponibles: PropTypes.array.isRequired,
};