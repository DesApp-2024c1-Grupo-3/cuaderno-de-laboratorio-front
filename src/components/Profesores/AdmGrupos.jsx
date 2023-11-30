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
  makeStyles,
  styled,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert } from '@material-ui/lab';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDataFromBackend } from '../../constants/Grupos';
import { getTodosLosGrupos as getTodosLosGrupos_fake } from '../../services/Grupos_Fake';
import {
  conteinerButtonRow,
  buttonGrupo,
  buttonVolver,
  conteinerListaDeGrupos,
} from '../../style/buttonStyle';
import { getTodosLosGrupos } from '../../services/Grupo';
import { SubHeader } from '../General/SubHeader';
import EditIcon from '@mui/icons-material/Edit';
import { ModalCrearGrupos } from './ModalCrearGrupos';
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { NavLink } from 'react-router-dom';
import { ModalClonarGrupos } from './ModalClonarGrupo';

const useStyles = makeStyles(() => ({
  card: {},
  conteinerButtonRow,
  buttonGrupo,
  buttonVolver,
  curso: { display: 'inline-grid' },
  modal: { backgroundColor: 'white' },
  conteinerListaDeGrupos,
}));

export default function AdministrarGrupos() {
  const classes = useStyles();

  const [grupos, setGrupos] = useState([]);
  const [hasError, setHasError] = useState(false);
  const tituloHeader = 'Administrar Grupos';

  const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

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

  useEffect(() => {
    async function fetchGrupos() {
      const getFunction = getTodosLosGrupos;
      // const getFunction = getDataFromBackend
      //   ? getTodosLosGrupos
      //   : getTodosLosGrupos_fake;
      try {
        const grupos = await getFunction();
        setGrupos(grupos);
      } catch (err) {
        console.log('Ocurrio este error.', err);
        setHasError(true);
      }
    }
    fetchGrupos();
  }, []);

  const gruposRendering = () => {
    return [
      <>
        <Card className={classes.card}>
          <CardContent>
            <Container className={classes.curso} maxWidth="xl">
              <SubHeader titulo={tituloHeader} />
              <ListSubheader>Nombre del Tp</ListSubheader>
              <Divider></Divider>
              <Container maxWidth="xl" className={classes.conteinerButtonRow}>
                <Button
                  onClick={openModalClonar}
                  className={classes.buttonGrupo}
                >
                  Clonar Grupo
                </Button>
                <Button onClick={openModal} className={classes.buttonGrupo}>
                  Crear Grupo
                </Button>
              </Container>
              <Container className={classes.modal}>
                <ModalCrearGrupos
                  show={show}
                  closeModal={hideModal}
                ></ModalCrearGrupos>
                <ModalClonarGrupos
                  show={showClonar}
                  closeModal={hideModalClonar}
                ></ModalClonarGrupos>
              </Container>
              <Container>
                <Box className={classes.conteinerListaDeGrupos}>
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
                              primary={`${it.nombre} `}
                              secondary={` ${it.alumnos}`}
                            />
                            <IconButton edge="edit" aria-label="edit">
                              <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete">
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
              className={classes.buttonVolver}
              component={NavLink}
              to="/"
              key="botonVolver"
            >
              Volver
            </Button>
          </CardContent>
        </Card>
      </>,
    ];
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

  AdministrarGrupos.propTypes = {
    titulo: PropTypes.string.isRequired, // Asegura que 'titulo' sea una cadena (string) y es requerido.
  };

  return hasError
    ? errorRendering()
    : grupos == null
    ? loadingRendering()
    : gruposRendering();
}
