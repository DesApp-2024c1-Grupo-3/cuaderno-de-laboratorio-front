import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { getTpsByCursoId, deleteTp } from '../services/tps';
import { SubHeader } from './General/SubHeader';

export default function Tps() {
  const { idCurso, profesorId } = useParams();
  const [tps, setTps] = useState(null);
  const [hasError, setHasError] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      try {
        const tpsData = await getTpsByCursoId(idCurso);
        setTps(tpsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasError(true);
      }
    }

    fetchData();
  }, [idCurso]);

  const handleVolver = () => {
    history.goBack();
  };

  const handleAdministrarGrupo = () => {
    // Lógica para administrar grupo
  };

  const handleNuevoTp = () => {
    // Lógica para crear un nuevo TP
  };

  const tpsRendering = () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
    
      {/* Tabla para mostrar los TPs */}
      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <SubHeader titulo={`Trabajos Prácticos`} />
          <Divider />
          <Container
            maxWidth="xxl"
            style={{ marginTop: '20px' }}
          >
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Nombre del TP</th>
                  <th style={{ width: '20%' }}>Comisión</th>
                  <th style={{ width: '15%' }}>Estado</th> 
                  <th style={{ width: '30%' }}>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {tps.map((tp, index) => (
                  <tr key={tp._id} style={{ opacity: index % 2 === 0 ? 0.9 : 0.7 }}>
                    <td>{tp.nombre}</td>
                    <td>{tp.comision}</td>
                    <td>{tp.estado}</td>
                    <td>{tp.finalizacion}</td>
                    <td><Button variant="contained" onClick={() => history.push(`/detalleTP/${tp._id}`)}>Detalle</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Container>
        </CardContent>
          {/* Botones Volver, Administrar Grupo y Nuevo TP */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button variant="contained" onClick={handleVolver}>Volver</Button>
        <Button variant="contained" onClick={handleAdministrarGrupo}>Administrar Grupo</Button>
        <Button variant="contained" onClick={handleNuevoTp}>Nuevo TP</Button>
      </div>
      </Card>
    </div>
  );

  const loadingRendering = () => (
    <div>Cargando TPs...</div>
  );

  const errorRendering = () => (
    <div>Error al cargar los TPs.</div>
  );

  return hasError
    ? errorRendering()
    : !tps
    ? loadingRendering()
    : tpsRendering();
}
