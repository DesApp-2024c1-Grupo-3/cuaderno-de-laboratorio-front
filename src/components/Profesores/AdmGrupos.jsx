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
  Modal,
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
import { getDataFromBackend } from '../../constants/curso';
import { getCurso as getTodosLosUsuarios_fake } from '../../services/curso-fake';
import {
  conteinerButtonRow,
  buttonGrupo,
  buttonVolver,
} from '../../style/buttonStyle';
import { getCursoPorIdProfesor } from '../../services/curso';
import { SubHeader } from '../General/SubHeader';
import EditIcon from '@mui/icons-material/Edit';
import { ModalCrearGrupos } from './ModalCrearGrupos';
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  card: {},
  conteinerButtonRow,
  buttonGrupo,
  buttonVolver,
  curso: { display: 'inline-grid' },
  modal: { backgroundColor: 'white' },
}));

export default function AdministrarGrupos() {
  const { estadoCurso } = useParams();
  const classes = useStyles();

  const [comision, setComision] = useState(null);
  const [hasError, setHasError] = useState(false);
  const tituloHeader =
    estadoCurso === 'actual'
      ? 'Listado De Cursos |cuatrimestre actual '
      : 'Listado De Cursos | cuatrimestre anterior';

  const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  const [showEdit, setShowEdit] = useState(true);
  const [show, setShow] = useState(false);

  const hideModal = () => {
    setShowEdit(false);
    setShow(false);
  };
  const openModal = () => {
    setShow(true);
  };

  useEffect(() => {
    async function fetchCommision() {
      const getFunction = getDataFromBackend
        ? getCursoPorIdProfesor('6539f56c21db6cc57698b95e')
        : getTodosLosUsuarios_fake;
      try {
        // Agregar el ID del profesor segun la informacion que tengas en tu base de datos local.
        const commision = await getFunction();
        setComision(commision);
      } catch (err) {
        console.log('Ocurrio este error.', err);
        setHasError(true);
      }
    }
    fetchCommision();
  }, []);

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

  const comisionRendering = () => {
    return [
      <>
        <Card className={classes.card}>
          <CardContent>
            <Container className={classes.curso} maxWidth="xl">
              <SubHeader titulo={tituloHeader} />
              <ListSubheader>Nombre del Tp</ListSubheader>
              <Divider></Divider>
              <Container maxWidth="xl" className={classes.conteinerButtonRow}>
                <Button onClick={openModal} className={classes.buttonGrupo}>
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
              </Container>

              <Box>
                <Grid item xs={12} md={6}>
                  <Demo>
                    <Typography
                      sx={{ mt: 4, mb: 2 }}
                      variant="h6"
                      component="div"
                    ></Typography>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <FolderIcon />
                        </ListItemAvatar>

                        <ListItemText
                          primary="Nombre De Grupo"
                          secondary="nombres de integrantes"
                        />
                        <IconButton edge="edit" aria-label="edit">
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    </List>
                  </Demo>
                </Grid>
              </Box>
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
        No pudimos cargar el usuario. ¿Levantaste la API?{' '}
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
    : comision == null
    ? loadingRendering()
    : comisionRendering();
}
