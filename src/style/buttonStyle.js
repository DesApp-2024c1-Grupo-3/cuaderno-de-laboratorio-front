export const conteinerButton = {
  display: 'flex',
  flexWrap: 'nowrap',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'space-evenly',
  height: '300px',
};

export const conteinerButtonSeleccionTp = {
  display: 'flex',
  flexWrap: 'nowrap',
  flexDirection: 'column',
  with: '90%',
  // alignItems: 'stretch',
  // justifyContent: 'space-evenly',
  //height: '300px',
};

export const botonesSeleccion = {
  display: 'flex',
  flexDirection: 'row',
  color: 'black',
  backgroundColor: 'lightgray',
  height: '40px',
  radius: '0px',

  width: '95%',
  fontFamily: 'Inter',
  fontSize: '24px',
  fontWeight: 400,
  alignItems: 'space-evenly',

  borderRadius: '8px',
  border: '1px solid #ddd',
  margin: '5px',
};

export const leyendasBoton = {
  alignItems: 'space-evenly',
};

export const botonVolver = {
  display: 'flex',
  //background 609700
  backgroundColor: '#609700',
  borderRadius: '20px',
  color: 'white',
  border: '2px solid black',
  padding: '10px 34px 11px 35px',
  width: '147px',
  height: '57px',
  fontFamily: 'Inter',
  fontSize: '20px',
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: 'normal',
  alignItems: 'space-between',
  margin: '10px 50px 70px 40px',
  // posicionar boton abajo a la izquierda
  position: 'absolute',
  bottom: '0px',
  left: '0',
};

export const botonAgregarTp = {
  display: 'flex',
  margin: 'auto',
  marginTop: '20px',
  backgroundColor: '#4CAF50',
  borderRadius: '8px',
  color: 'white',
  border: 'none', // Puedes personalizar la propiedad border según tus necesidades
  padding: '10px 20px',
  fontSize: '16px',
  fontFamily: 'Inter', // Puedes personalizar la fuente según tus necesidades
  fontWeight: 600,
  lineHeight: 'normal',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer', // Agregado para indicar que es un elemento interactivo
  transition: 'background-color 0.3s ease', // Agregado para un efecto suave en hover
  '&:hover': {
    backgroundColor: '#45a049',
  },
};
