import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from 'react-bootstrap/Modal';
import { Button, Container, Divider, TextField,} from '@mui/material';
import { Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import { getTodosLosAlumnos } from '../../services/Alumnos';
import { postCrearGrupo } from '../../services/Grupo';

export const ModalCrearGrupos = ({ show, closeModal, idCurso, actualizarListaGrupos }) => {
  const [listAlumnos, setListAlumnos] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [grupoData, setGrupoData] = useState({
    nombre: '',
    alumnos: [],
  });

  const resetModal = () => {
    setNombreGrupo('');
    setGrupoData({
      nombre: '',
      alumnos: [],
    });
  };

  const onClose = () => {
    resetModal();
    closeModal();
  };

  const guardarNombre = (event) => {
    const nombreG = event.target.value;
    setNombreGrupo(nombreG);
    setGrupoData({ ...grupoData, nombre: nombreG });
  };

  const handleChangeAlumnos = (event, value) => {
    setGrupoData({ ...grupoData, alumnos: value });
  };

  const validarDatos = () => {
    return grupoData.nombre !== '' && grupoData.alumnos.length > 0;
  };

  const crearGrupo = async () => {
    try {
      const response = await postCrearGrupo(grupoData, idCurso);
      if (response.status === 201) {
        window.alert('Grupo creado correctamente');
        closeModal();
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
        <Box
          sx={{
            position: 'fixed',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
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
            <FormControl sx={{ m: 1 }}>
              <Autocomplete
                multiple
                id="combo-box-demo"
                options={listAlumnos}
                getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
                onChange={handleChangeAlumnos}
                renderInput={(params) => (
                  <TextField {...params} label="Lista de Alumnos" variant="outlined" />
                )}
              />
            </FormControl>
          </Container>
          <Container style={{ maxheight: '10px', padding: '15px' }}>
            <Button 
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              style={{ backgroundColor: 'green' }}
              onClick={crearGrupo}
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
};
