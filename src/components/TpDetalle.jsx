import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { getTpPorId, getCursoPorId } from '../services/tps';

const styles = {
  contenedor: {
    // Tus estilos aquí...
  },
  card: {
    // Tus estilos aquí...
  },
  // Agrega más estilos según sea necesario...
};

export default function TpDetalle() {
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

  const tpRendering = () => (
    <div style={styles.contenedor}>
      <Card style={styles.card}>
        <CardContent>
          <Divider />
          <Container maxWidth="xxl">
            {tp && curso && (
              <div>
                <h2>{tp.nombre}</h2>
                <h3>fechaInicio: {tp.fechaInicio}</h3>
                <h3>fechaFin: {tp.fechaFin}</h3>
                {curso.alumnos && (
                  <h3>Cantidad alumnos: {curso.alumnos.length}</h3>
                )}
                {tp.grupos && (
                  <h3>Cantidad grupos: {tp.grupos.length}</h3>
                )}
                {tp.consigna && (<h4>Consigna: {tp.consigna}</h4>)}
              </div>
            )}
          </Container>
        </CardContent>
      </Card>
      <Button color="primary" onClick={() => history.goBack()}>
        Volver
      </Button>
    </div>
  );

  const loadingRendering = () => <div>Cargando detalles del Tp...</div>;

  const errorRendering = () => <div>Error al cargar los detalles del Tp</div>;

      return hasError ? errorRendering() : !tp ? loadingRendering() : tpRendering();
}
