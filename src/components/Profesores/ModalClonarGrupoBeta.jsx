import React, { useEffect, useState } from 'react';
import { Button, Box, Container, Divider, TextField, Autocomplete, Modal, Typography } from '@mui/material';
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

export const ModalClonarGrupos = ({ show, closeModal }) => {
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
      } else {
        console.error('Error al crear grupo');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      window.alert('Error en la solicitud');
    }
  };

  useEffect(() => {
    async function fetchAlumnos() {
      const getFunction = getDataFromBackend
        ? getTodosLosAlumnos
        : getTodosLosAlumnos_Fake;
      try {
        const alumnos = await getFunction();
        setListAlumnos(alumnos);
      } catch (err) {
        console.log('Ocurrió este error:', err);
        setHasError(true);
      }
    }
    fetchAlumnos();
  }, []);

  return (
    <Modal open={show} onClose={onClose}>
      <Box sx={style}>
        <Container>
          <Typography>Materia | Cuatrimestre | Comisión</Typography>
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
            getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
            value={alumnosGrupo}
            filterSelectedOptions
            onChange={guardarAlumnos}
            renderInput={(params) => (
              <TextField {...params} label="Alumnos" placeholder="Seleccionar" />
            )}
          />
        </Container>

        <Container style={{ padding: '15px' }}>
          <Button onClick={onClose}>Cerrar</Button>
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
  );
};

ModalClonarGrupos.propTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};
