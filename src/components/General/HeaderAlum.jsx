import styled from '@emotion/styled';
import Unahur from '../../Img/UNAHUR.png';
import { getAlumnoById } from '../../services/Alumnos';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Define los estilos utilizando @emotion/styled
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

//const alumnoId = '6685d8cbf85876c727495522';



export const Header = () => {

    const { alumnoId } = useParams();
    const [alumno, setAlumno] = useState([]);
  
    useEffect(() => {
      async function fetchAlumno() {
        
  
        try {
          // Agregar el ID del profesor según la información que tengas en tu base de datos local.
          const data = await getAlumnoById(alumnoId);
          setAlumno(data);
          console.log(alumno.nombre);
  
        } catch (err) {
          console.log('Ocurrió este error.', err);
          setHasError(true);
        }
      }
  
      fetchAlumno();
    }, [alumnoId]);
  return (
    <FixedHeader>
        <div>
        <Logo alt="algo" src={Unahur} />
        </div>
        <Title>
          CUADERNO DE LABORATORIO
        <br/>
        <Typography sx={{fontSize: '1.2vw'}} >Alumno:</Typography>
        <Typography sx={{fontSize: '1.2vw',fontWeight: 'bold'}} >{alumno.apellido} {alumno.nombre}</Typography>
        </Title>
        
    </FixedHeader>
  );
};