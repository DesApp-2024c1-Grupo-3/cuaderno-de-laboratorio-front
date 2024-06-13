import React, { useEffect, useState } from 'react';
import { Modal, Box, Container, Typography, Divider, TextField, FormControl, Button, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import { getTodosLosAlumnos } from '../../services/Alumnos';
import { postCrearGrupo, getGrupoByCursoId } from '../../services/Grupo';

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
        actualizarListaGrupos();
        onClose();
      } else {
        console.error('Error al crear grupo');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      window.alert('Error en la solicitud');
    }
  };
  const fetchAlumnos = async () => {
    try {
      const alumnos = await getTodosLosAlumnos(idCurso);
      setListAlumnos(alumnos);
    } catch (err) {
      console.log('Ocurrió este error:', err);
      setHasError(true);
    }
  };
  const fetchGrupos = async () => {
    try {
      const grupos = await getGrupoPorCurso(idCurso); 
      const alumnosAsignados = grupos.reduce((acc, grupo) => {
        return acc.concat(grupo.alumnos);
      }, []);
      const alumnosDisponibles = listAlumnos.filter(
        (alumno) => !alumnosAsignados.some((a) => a.id === alumno.id)
      );
      setListAlumnos(alumnosDisponibles);
    } catch (err) {
      console.log('Ocurrió este error:', err);
      setHasError(true);
    }
  };

  useEffect(() => {
    if (show) {
      fetchAlumnos();
      fetchGrupos();
    }
  }, [show]);

  return (
    <Modal open={show} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Container>
          <Typography variant="h6">Crear Nuevo Grupo</Typography>
          <Divider sx={{ my: 2 }} />
        </Container>
        <Container>
          <TextField
            fullWidth
            label="Nombre del Grupo"
            variant="outlined"
            value={nombreGrupo}
            onChange={guardarNombre}
            sx={{ mb: 2 }}
          />
        </Container>
        <Container>
          <FormControl fullWidth>
            <Autocomplete
              multiple
              options={listAlumnos}
              getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
              onChange={handleChangeAlumnos}
              renderInput={(params) => (
                <TextField {...params} label="Lista de Alumnos" variant="outlined" />
              )}
              sx={{ mb: 2 }}
            />
          </FormControl>
        </Container>
        <Container>
          <Button onClick={onClose} sx={{ mr: 2 }}>Cerrar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={crearGrupo}
            disabled={!validarDatos()}
          >
            Crear
          </Button>
        </Container>
      </Box>
    </Modal>
  );
};

ModalCrearGrupos.propTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  idCurso: PropTypes.string.isRequired,
  actualizarListaGrupos: PropTypes.func.isRequired,
};
