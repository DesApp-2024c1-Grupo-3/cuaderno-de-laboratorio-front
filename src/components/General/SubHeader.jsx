import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

export function SubHeader({ titulo }) {
  return (
    <>
      <Typography 
        variant="h4"    
        align="left" 
      >
        {titulo}
      </Typography>
  
    </>
  );
}

SubHeader.propTypes = {
  titulo: PropTypes.string.isRequired, // Asegura que 'titulo' sea una cadena (string) y es requerido.
};
