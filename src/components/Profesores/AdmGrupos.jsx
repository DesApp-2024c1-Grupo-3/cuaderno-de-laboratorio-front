import React, { useEffect, useState, useStyles } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Typography,
  styled,
  makeStyles
} from '@mui/material'; // Importa los componentes de Material-UI v5
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Alert } from '@mui/material';
import { ModalCrearGrupos } from './ModalCrearGrupos';
import { ModalClonarGrupos } from './ModalClonarGrupo';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { getGrupoByCursoId, postEliminarGrupo } from '../../services/Grupo';
import { SubHeader } from '../General/SubHeader';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const AdministrarGrupos = () => {
  const { idCurso } = useParams();

  const [grupos, setGrupos] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [show, setShow] = useState(false);
  const [showClonar, setShowClonar] = useState(false);

  const hideModalClonar = () => {
    setShowClonar(false);
  };
  const openModalClonar = () => {
    setShowClonar(true);
  };

  const hideModal = () => {
    setShow(false);
  };
  const openModal = () => {
    setShow(true);
  };
  const tituloHeader = 'Administrar Grupos';

  const deleteGrup = async (id) => {
    try {
      // Eliminar el grupo
      await postEliminarGrupo(id);

      // Volver a cargar la lista actualizada
      const gruposActualizados = await getGrupoByCursoId(idCurso);
      setGrupos(gruposActualizados);
    } catch (error) {
      console.error('Error al eliminar el grupo:', error);
      // Manejo de errores según sea necesario
    }
  };

  const actualizarListaGrupos = async () => {
    try {
      const gruposActualizados = await getGrupoByCursoId(idCurso);
      setGrupos(gruposActualizados);
    } catch (error) {
      console.error('Error al actualizar la lista de grupos:', error);
      // Manejo de errores según sea necesario
    }
  };

  useEffect(() => {
    async function fetchGrupos() {
      try {
        const grupos = await getGrupoByCursoId(idCurso);
        setGrupos(grupos);
      } catch (err) {
        console.log('Ocurrió este error:', err);
        setHasError(true);
      }
    }
    fetchGrupos();
  }, [idCurso, show]);

  const gruposRendering = () => {
    return (
      <>
        <Card>
          <CardContent>
            <Container maxWidth="xl">
              <SubHeader titulo={tituloHeader} />
              <ListSubheader>Nombre del Tp</ListSubheader>
              <Divider></Divider>
              <Container maxWidth="xl">
                <Button
                  onClick={openModalClonar}
                >
                  Clonar Grupo
                </Button>
                <Button onClick={openModal}>
                  Crear Grupo
                </Button>
              </Container>
              <Container>
                <ModalCrearGrupos
                  show={show}
                  closeModal={hideModal}
                  idCurso={idCurso}
                  actualizarListaGrupos={actualizarListaGrupos}
                ></ModalCrearGrupos>
                <ModalClonarGrupos
                  show={showClonar}
                  closeModal={hideModalClonar}
                ></ModalClonarGrupos>
              </Container>
              <Container>
                <Box>
                  <Grid style={{ width: '50%', border: '1px' }}>
                    <Demo>
                      <Typography
                        sx={{ mt: 4, mb: 2 }}
                        variant="h6"
                        component="div"
                      >
                        grupos
                      </Typography>
                      <List>
                        {grupos.map((it) => (
                          <ListItem key={it._id}>
                            <ListItemAvatar>
                              <FolderIcon />
                            </ListItemAvatar>

                            <ListItemText
                              primary={`${it.nombre} [${it.alumnos
                                .map((alu) => `${alu.nombre} ${alu.apellido} ,`)
                                .join(' ')}]`}
                            />
                            <IconButton edge="edit" aria-label="edit">
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => deleteGrup(it._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </Demo>
                  </Grid>
                </Box>
              </Container>
            </Container>

            <Button
              component={NavLink}
              to="/"
              key="botonVolver"
            >
              Volver
            </Button>
          </CardContent>
        </Card>
      </>
    );
  };

  const loadingRendering = () => {
    return <Alert severity="info">Cargando </Alert>;
  };

  const errorRendering = () => {
    return (
      <Alert severity="warning">
        No pudimos cargar los grupos.{' '}
        <span role="img" aria-label="thinking">
          🤔
        </span>
      </Alert>
    );
  };

  return hasError
    ? errorRendering()
    : grupos == null
    ? loadingRendering()
    : gruposRendering();
};

export default AdministrarGrupos;
