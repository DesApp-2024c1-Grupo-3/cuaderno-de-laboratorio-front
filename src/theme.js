import { createTheme } from '@mui/material/styles';

// Acá podrían reemplazarse los colores y tipografías del tema, y eso se va a reflejar en toda la aplicación.
const theme = createTheme({
  palette: {
    primary: {
      // Como ejemplo, cambiamos el primary por "verde UNaHur".
      main: '#009673',
    },
  },
});

export default theme;
