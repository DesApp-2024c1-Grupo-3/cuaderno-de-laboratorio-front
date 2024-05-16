import { createTheme } from '@mui/material/styles';

// Acá podrían reemplazarse los colores y tipografías del tema, y eso se va a reflejar en toda la aplicación.
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#c5e1a5',
          '&:hover': {
            backgroundColor: '#b0d38a',
          },
        },
      },
    },
  },
});

export default theme;
