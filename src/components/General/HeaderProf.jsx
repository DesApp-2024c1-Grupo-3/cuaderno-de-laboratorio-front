import styled from '@emotion/styled';
import Unahur from '../../Img/UNAHUR.png';
import { getProfesorPorId } from '../../services/Profesor';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FixedHeader = styled.div`
  
  display: flex;  
  font-size: 3vw; /* Usar un tamaño de fuente relativo */
  color: rgba(0, 0, 0, 0.7);
  background-color: #c5e1a5;
  text-align: center;
  justify-content: flex-start; /* Para alinear el logo al borde izquierdo */
  align-items: center;
  padding: 5px; /* Espacio interno */
  font-weight: 900; /* Hace que el texto sea más grueso */
  font-family: roboto /* Utiliza la fuente Roboto */
  
`;
const Logo = styled.img`
  width: 80%; /* Utilizar un ancho relativo */
 
`;
const Title = styled.p`
  margin: 0;
  flex-grow: 1;
  text-align: center;
`;

export const Header = () => {

    const [profesor, setProfesor] = useState([]);
    const { profesorId } = useParams();
  
    useEffect(() => {
      async function fetchProfesor() {
        
  
        try {
          const data = await getProfesorPorId(profesorId);
          setProfesor(data);
  
        } catch (err) {
          console.log('Ocurrió este error.', err);
          setHasError(true);
        }
      }
  
      fetchProfesor();
    }, [profesorId]);
  return (
    <FixedHeader>
        <div>
        <Logo alt="algo" src={Unahur} />
        </div>
        <Title>
          CUADERNO DE LABORATORIO
          <br/>
        <Typography sx={{fontSize: '1.2vw'}} >Profesor:</Typography>
        <Typography sx={{fontSize: '1.2vw',fontWeight: 'bold'}} >{profesor.apellido} {profesor.nombre}</Typography>
        </Title>
        
    </FixedHeader>
  );
};