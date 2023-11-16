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
import { useEffect } from 'react';
import { getDataFromBackend } from '../../constants/Alumnos';
import { Stack } from '@mui/material';
import { Height } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  contButtonVolver,
  buttonVolver,
  conteinerButtonRow,
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const ModalCrearGrupos = ({ show, closeModal }) => {
  const classes = useStyles();
  const [listAlumnos, setListAlumnos] = useState();
  const [hasError, setHasError] = useState(false);

  const onClose = () => {
    closeModal();
  };

  useEffect(() => {
    async function fetchAlumnos() {
      const getFunction = getDataFromBackend ? getTodosLosAlumnos : '';
      try {
        // Agregar el ID del profesor segun la informacion que tengas en tu base de datos local.
        const alumnos = await getFunction();
        setListAlumnos(alumnos);
      } catch (err) {
        console.log('Ocurrio este error.', err);
        setHasError(true);
      }
    }
    fetchAlumnos();
  }, []);
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
            />
          </Container>
          <Container style={{ padding: '15px' }}>
            <Stack spacing={3}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={listAlumnos}
                getOptionLabel={(option) => option.nombre}
                filterSelectedOptions
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
              onClick={onClose}
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
  // Ajusta el tipo y la obligatoriedad según tu lógica de uso
};
