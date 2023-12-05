import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from 'react-bootstrap/Modal';
import {
  Button,
  Container,
  Divider,
  FormControl,
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
import {
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from '@mui/material';
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
  const [personName, setPersonName] = React.useState([]);

  const onClose = () => {
    closeModal();
  };
  const [nombreGrupo, setNombreGrupo] = useState('');

  const [grupoData, setGrupoData] = useState({
    nombre: '',
    alumnos: [],
  });

  const guardarNombre = (event) => {
    const nombreG = event.target.value;
    setNombreGrupo(nombreG);
    setGrupoData({ ...grupoData, nombre: nombreG });
  };
  const handleChange = (event) => {
    if (validarDatos()) {
      crearGrupo();
    } else {
      window.alert('Completa todos los campos obligatorios: Nombre, alumnos');
    }

    onClose();
  };

  const handleChangeAlumnos = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );

    setGrupoData({ ...grupoData, alumnos: personName });
    console.log('PName', personName);
  };

  const validarDatos = () => {
    if (grupoData.nombre == '' || grupoData.alumnos <= 0) {
      return false;
    }
    return true;
  };

  const crearGrupo = async () => {
    try {
      const response = await postCrearGrupo(grupoData);
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
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="demo-multiple-name-label">
                Lista de Alumnos
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={personName}
                onChange={handleChangeAlumnos}
                input={<OutlinedInput label="Name" />}
                style={{ width: '300px' }}
              >
                {listAlumnos.map((name) => (
                  <MenuItem key={name._id} value={name._id}>
                    {name.nombre} {name.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
