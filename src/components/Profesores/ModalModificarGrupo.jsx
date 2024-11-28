import React, { useState, useEffect } from 'react';
import { Modal, Box, Container, Typography, Divider, TextField, FormControl, Button, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import { upDateGrupo, getGrupoByCursoId } from '../../services/Grupo';
import { getAlumnosByCursoId } from '../../services/Alumnos';

export const ModalModificarGrupo = ({ show, closeModal, idCurso, grupoParaModificar, actualizarListaGrupos }) => {
  const [listAlumnos, setListAlumnos] = useState([]);

  const [nombreGrupo, setNombreGrupo] = useState('');
  const [grupoData, setGrupoData] = useState({
    nombre: '',
    alumnos: [],
  });
  console.log(listAlumnos)

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
  
  
  const handleChangeAlumnos = (event, values) => {
    setGrupoData({
      ...grupoData,
      alumnos: values.map((alumno) => alumno._id),
    });
  };

  const updateGrupoSubmit = async () => {
    try {
      await upDateGrupo(grupoParaModificar._id, grupoData);
      await actualizarListaGrupos();
      onClose();
    } catch (error) {
      console.error('Error al actualizar el grupo:', error);
    }
  };

  const fetchAlumnos = async () => {
    try {
      const alumnos = await getAlumnosByCursoId(idCurso); // Trae todos los alumnos del curso
      const gruposActualizados = await getGrupoByCursoId(idCurso);
      const alumnosEnGrupos = gruposActualizados.flatMap(grupo => grupo.alumnos.map(alumno => alumno._id)); // Trae a todos los alumnos que tienen grupo
      const alumnosDisponibles = alumnos.filter(alumno =>
        !alumnosEnGrupos.includes(alumno._id) || grupoParaModificar.alumnos.some(grupoAlumno => grupoAlumno._id === alumno._id)
      ); // Trae solo los alumnos que no tienen grupo o que ya están en el grupo que se está modificando
      setListAlumnos(alumnosDisponibles);
    
    } catch (error) {
      console.error('Error al obtener la lista de alumnos:', error);
    }
  };
  

  useEffect(() => {
    if (show) {
      fetchAlumnos();
      setNombreGrupo(grupoParaModificar.nombre);
      setGrupoData({
        nombre: grupoParaModificar.nombre,
        alumnos: grupoParaModificar.alumnos.map(alumno => alumno._id),
      });
    }
  }, [show]);

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container
        maxWidth="xl"
        sx={{
          mt: 4,
          mb: 4,
          border: 'solid',
          borderWidth: '10px 20px 20px 10px',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          borderRadius: '1%',
          bgcolor: 'white',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Modificar Grupo
        </Typography>
        <Divider />
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <TextField
            name="nombre"
            margin="normal"
            type="text"
            value={nombreGrupo}
            onChange={guardarNombre}
            placeholder="Nombre del Grupo"
            required
            sx={{ marginBottom: '20px', width: '50%' }}
          />
          <FormControl fullWidth>
            <Autocomplete
              multiple
              options={ listAlumnos }
              getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
              value= {listAlumnos.filter(alumno => grupoData.alumnos.includes(alumno._id))}
              onChange={handleChangeAlumnos}
            
              renderInput={(params) => <TextField {...params} label="Alumnos" placeholder="Seleccione los alumnos" />}
            />
          </FormControl>
          <Button
            variant="contained"
            sx={{
              marginTop: '20px',
              backgroundColor: '#c5e1a5',
              color: '#000000',
              '&:hover': { backgroundColor: '#b0d38a' },
            }}
            onClick={updateGrupoSubmit}
          >
            Guardar cambios
          </Button>
        </Box>
      </Container>
    </Modal>
  );
};

ModalModificarGrupo.propTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  idCurso: PropTypes.string.isRequired,
  actualizarListaGrupos: PropTypes.func.isRequired,
  grupoParaModificar: PropTypes.object.isRequired,
};
