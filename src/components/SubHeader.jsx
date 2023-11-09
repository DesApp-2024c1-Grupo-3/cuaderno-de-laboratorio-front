import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from "@material-ui/core";

export function SubHeader({ titulo }) {
  return (
    <>
      <Typography variant="h4">{titulo}</Typography>
    </>
  );
}

SubHeader.propTypes = {
  titulo: PropTypes.string.isRequired, // Asegura que 'titulo' sea una cadena (string) y es requerido.
};