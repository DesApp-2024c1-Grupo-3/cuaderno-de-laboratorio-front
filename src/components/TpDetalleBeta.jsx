import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { getTpPorId, getCursoPorId } from '../services/tps';

const TpDetalle = () => {
  const { idCurso, profesorId, tpId } = useParams();
  const [tp, setTp] = useState(null);
  const [curso, setCurso] = useState(null);
  const [hasError, setHasError] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function fetchTp() {
      try {
        if (tpId) {
          const tpData = await getTpPorId(idCurso, tpId);
          setTp(tpData);
          const cursoData = await getCursoPorId(idCurso);
          setCurso(cursoData);
        } else {
          console.error('tpId es undefined');
          setHasError(true);
        }
      } catch (err) {
        setHasError(true);
      }
    }
    fetchTp();
  }, [idCurso, tpId]);

  const handleVolver = () => {
    history.goBack();
  };

  const formatFecha = (fechaHora) => {
    const fecha = fechaHora.split('T')[0]; // Divide la fecha y la hora y toma solo la parte de la fecha
    return fecha;
  };

  const tpRendering = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.05)' } }}>
        <CardContent>
          <Divider />
          <Container maxWidth="xl">
            {tp && curso && (
              <div>
                <h2>{tp.nombre}</h2>
                <h3>fechaInicio: {formatFecha(tp.fechaInicio)}</h3> {/* Muestra solo la fecha */}
                <h3>fechaFin: {formatFecha(tp.fechaFin)}</h3> {/* Muestra solo la fecha */}
                {curso.alumnos && (
                  <h3>Cantidad alumnos: {curso.alumnos.length}</h3>
                )}
                {tp.grupos && (
                  <h3>Cantidad grupos: {tp.grupos.length}</h3>
                )}
                {tp.consigna && (
                  <div>
                    <h3>Consigna:</h3>
                    <div dangerouslySetInnerHTML={{ __html: tp.consigna }} />
                  </div>                    
                )}
                </div>
            )}
          </Container>
        </CardContent>
      </Card>
      <Button variant="contained" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: '#b0d38a' } }} onClick={handleVolver}>
        Volver
      </Button>
    </div>
  );

  const loadingRendering = () => <div>Cargando detalles del Tp...</div>;

  const errorRendering = () => <div>Error al cargar los detalles del Tp</div>;

  return hasError ? errorRendering() : !tp ? loadingRendering() : tpRendering();
};

export default TpDetalle;
