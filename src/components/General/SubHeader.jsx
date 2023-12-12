import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Typography } from '@material-ui/core';

export function SubHeader({ titulo }) {
  return (
    <>
      <Typography variant="h4">{titulo}</Typography>
      <Divider/>
    </>
  );
}

SubHeader.propTypes = {
  titulo: PropTypes.string.isRequired, // Asegura que 'titulo' sea una cadena (string) y es requerido.
};
