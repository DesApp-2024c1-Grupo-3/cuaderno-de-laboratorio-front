import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Container, Grid, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, TextField, Checkbox
  } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ModalCrearGrupos } from './ModalCrearGrupoBeta';
import { ModalClonarGrupos } from './ModalClonarGrupoBeta';
import { useParams, useHistory } from 'react-router-dom';
import { getGrupoByCursoId, postEliminarGrupo } from '../../services/Grupo';
import { getAlumnosByCursoId } from '../../services/Alumnos'; 
import { SubHeader } from '../General/SubHeader';

const AdministrarGrupos = () => {
  const { idCurso } = useParams();
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [show, setShow] = useState(false);
  const [showClonar, setShowClonar] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumnos, setSelectedAlumnos] = useState([]);

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

  const handleViewOpen = (group) => {
    setSelectedGroup(group);
    setOpenView(true);
  };

  const handleViewClose = () => {
    setOpenView(false);
    setSelectedGroup(null);
  };

  const handleEditOpen = async (group) => {
    setSelectedGroup(group);
   
    await fetchAlumnos(idCurso);
    setSelectedAlumnos(group.alumnos.map(alumno => alumno.id)); // Inicializa selectedAlumnos con los IDs de los alumnos del grupo seleccionado
    setOpenEdit(true);
   
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedGroup(null);
  };

  const handleSaveChanges = async () => {
    try {
      await actualizarListaAlumnos(selectedGroup._id, selectedAlumnos);
      handleEditClose();
      actualizarListaGrupos();
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const deleteGrup = async (id) => {
    try {
      await postEliminarGrupo(id);
      const gruposActualizados = await getGrupoByCursoId(idCurso);
      setGrupos(gruposActualizados);
    } catch (error) {
      console.error('Error al eliminar el grupo:', error);
    }
  };

  const actualizarListaGrupos = async () => {
    try {
      const gruposActualizados = await getGrupoByCursoId(idCurso);
      setGrupos(gruposActualizados);
    } catch (error) {
      console.error('Error al actualizar la lista de grupos:', error);
    }
  };

  const fetchAlumnos = async (cursoId) => {
    try {
      const alumnos = await getAlumnosByCursoId(cursoId);
      const alumnosEnGrupos = grupos.flatMap(grupo => grupo.alumnos.map(alumno => alumno.id));
      const alumnosDisponibles = alumnos.filter(alumno => !alumnosEnGrupos.includes(alumno.id));
      setAlumnos(alumnosDisponibles);
    } catch (error) {
      console.error('Error al obtener la lista de alumnos:', error);
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
  
  const handleAlumnoSelection = (alumnoId) => {
    if (selectedAlumnos.includes(alumnoId)) {
      setSelectedAlumnos(selectedAlumnos.filter((id) => id !== alumnoId));
    } else {
      setSelectedAlumnos([...selectedAlumnos, alumnoId]);
      console.log(setSelectedAlumnos)
    }
  };

  const gruposRendering = () => (
    <Box display="flex" flexDirection="column">
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <SubHeader titulo="Administrar Grupos" />
          <Container
            maxWidth="xl"
            sx={{ 
              mt: 1, 
              mb: 1, 
              border: 'solid', 
              borderWidth: '10px 20px 20px 10px', 
              borderColor: 'rgba(0, 0, 0, 0.08)',
              borderRadius: '1%' 
            }}
          >
            <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
              <Table sx={{ minWidth: 650, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '25%', fontSize: '15px' }}>Nombre del Grupo</TableCell>
                    <TableCell style={{ width: '25%', fontSize: '15px' }}>Ver</TableCell>
                    <TableCell style={{ width: '25%', fontSize: '15px' }}>Modificar</TableCell>
                    <TableCell style={{ width: '25%', fontSize: '15px' }}>Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grupos.map((grupo) => (
                    <TableRow key={grupo._id} sx={{ backgroundColor: grupos.indexOf(grupo) % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)' }}>
                      <TableCell>{grupo.nombre}</TableCell>
                      <TableCell>
                        <IconButton edge="start" aria-label="view" onClick={() => handleViewOpen(grupo)}>
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton edge="start" aria-label="edit" onClick={() => handleEditOpen(grupo)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteGrup(grupo._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container 
              spacing={2} 
              justifyContent="space-between"
              marginTop='20px'
            >
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={() => history.goBack()}
                >
                  Volver
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#c5e1a5', color: '#000000', '&:hover': { backgroundColor: '#b0d38a' } }}
                  onClick={openModal}
                >
                  Crear Grupo
                </Button>
              </Grid>
            </Grid>
            <ModalCrearGrupos
              show={show}
              closeModal={hideModal}
              idCurso={idCurso}
              actualizarListaGrupos={actualizarListaGrupos}
              alumnosDisponibles={alumnos} // Pasamos los alumnos disponibles al modal de creación
            />
            <ModalClonarGrupos
              show={showClonar}
              closeModal={hideModalClonar}
            />
          </Container>
        </CardContent>
      </Card>

      {/* Modal Ver */}
      <Dialog open={openView} onClose={handleViewClose}>
        <DialogTitle>Integrantes del Grupo</DialogTitle>
        <DialogContent>
        {selectedGroup && (
            <List>
              <ListItem>
                <ListItemText primary="Nombre" secondary={selectedGroup.nombre} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Alumnos"
                  secondary={selectedGroup.alumnos.map((alumno) => `${alumno.nombre} ${alumno.apellido}`).join(', ')}
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Modificar */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Modificar Grupo</DialogTitle>
        <DialogContent>
        {selectedGroup && (
            <List>
              <ListItem>
                <ListItemText primary="Nombre" secondary={selectedGroup.nombre} />
              </ListItem>
              <ListItem>
                <TextField
                  fullWidth
                  label="Nombre del Grupo"
                  value={selectedGroup.nombre}
                  onChange={(e) => setSelectedGroup({ ...selectedGroup, nombre: e.target.value })}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Alumnos" />
                <List>
                  {alumnos.map((alumno) => (
                    <ListItem key={alumno._id}  onClick={() => handleAlumnoSelection(alumno._id)}>
                      <Checkbox
                        edge="start"
                        checked={selectedAlumnos.includes(alumno._id)}
                        tabIndex={-1}
                        disableRipple
                      />
                      <ListItemText primary={`${alumno.nombre} ${alumno.apellido}`} />
                    </ListItem>
                  ))}
                </List>
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">Cancelar</Button>
          <Button onClick={handleSaveChanges} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const loadingRendering = () => (
    <div>Cargando grupos...</div>
  );

  const errorRendering = () => (
    <div>Error al cargar los grupos.</div>
  );

  return hasError
    ? errorRendering()
    : !grupos
    ? loadingRendering()
    : gruposRendering();
};

export default AdministrarGrupos;
