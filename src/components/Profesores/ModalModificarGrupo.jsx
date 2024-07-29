import React, { useState, useEffect } from 'react';
import { Modal, Box, Container, Typography, Divider, TextField, FormControl, Button, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import { getGrupoByCursoId, updateGrupo } from '../../services/Grupo';
import { getAlumnosByCursoId } from '../../services/Alumnos';

export const ModalModificarGrupo = ({ show, closeModal, idCurso, actualizarListaGrupos }) => {
  const [listAlumnos, setListAlumnos] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [grupoData, setGrupoData] = useState({
    nombre: '',
    alumnos: [],
  });
  const [selectedGrupo, setSelectedGrupo] = useState([]);
  const [gruposDeCurso, setGruposDeCurso] = useState([]);

  const resetModal = () => {
    setNombreGrupo('');
    setGrupoData({
      nombre: '',
      alumnos: [],
    });
    setSelectedGrupo(null);
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

  const modificarGrupo = async () => {
    try {
      const response = await updateGrupo(selectedGrupo._id, grupoData, idCurso);
      if (response.status === 200) {
        window.alert('Grupo modificado correctamente');
        actualizarListaGrupos();
        onClose();
      } else {
        console.error('Error al modificar grupo');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      window.alert('Error en la solicitud');
    }
  };
  
  const fetchGrupos = async () => {
    try {
      const grupos = await getGrupoByCursoId(idCurso);
      console.log("Son alumnos en grupos:",grupos)
      setGruposDeCurso(grupos);

    } catch (err) {
      console.log('Ocurrió este error:', err);
      setHasError(true);
    }
  };
  const fetchAlumnos = async () => {
    try {
      const alumnos = await getAlumnosByCursoId(idCurso);
      console.log("Son alumnos en grupos:",alumnos)
      const alumnosEnGrupos = gruposDeCurso.flatMap(grupo => grupo.alumnos.map(alumno => alumno._id)); // trae a todos los alumnos que tienen grupo
      console.log("Son alumnos en grupos:",alumnosEnGrupos)
      const alumnosDisponibles = alumnos.filter(alumno => !alumnosEnGrupos.includes(alumno._id));// trae solo los alumnos que no tienen
      setListAlumnos(alumnosDisponibles);
    } catch (err) {
      console.log('Ocurrió este error:', err);
      setHasError(true);
    }
  };

  

  const handleGrupoChange = (event, value) => {
    setSelectedGrupo(value);
    if (value) {
      setNombreGrupo(value.nombre);
      setGrupoData({
        nombre: value.nombre,
        alumnos: value.alumnos,
      });
      fetchAlumnos(); // Llamar a fetchAlumnos después de seleccionar un grupo
    } else {
      resetModal();
    }
  };

  useEffect(() => {
    if (show) {
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
          <Typography variant="h6">Modificar Grupo</Typography>
          <Divider sx={{ my: 2 }} />
        </Container>
        <Container>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Autocomplete
              options={gruposDeCurso}
              getOptionLabel={(option) => option.nombre}
              onChange={handleGrupoChange}
              renderInput={(params) => (
                <TextField {...params} label="Seleccione un grupo" variant="outlined" />
              )}
            />
          </FormControl>
        </Container>
        {selectedGrupo && (
          <>
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
                  value={grupoData.alumnos}
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
                onClick={modificarGrupo}
                disabled={!validarDatos()}
              >
                Modificar
              </Button>
            </Container>
          </>
        )}
      </Box>
    </Modal>
  );
};

ModalModificarGrupo.propTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  idCurso: PropTypes.string.isRequired,
  actualizarListaGrupos: PropTypes.func.isRequired,
};
