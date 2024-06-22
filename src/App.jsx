import { Container } from '@mui/material'; // Importa Container desde @mui/material;
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import { Header } from './components/General/Header';
import { Footer } from './components/General/Footer';
//import Comision from './components/Comision';
//---------------------------Componentes Profesor---------------------------------------
import ComisionBeta from './components/ComisionBeta';
import TpsBeta from './components/TpsBeta';
import CrearTpsBeta from './components/CrearTpsBeta';
import AdministrarGrupos from './components/Profesores/AdmGrupoBeta';
import TpDetalleBeta from './components/TpDetalleBeta';

import CalificarGrupo from './components/CalificarGrupo';
import CalificarAlumno from './components/CalificarAlumno';
//---------------------------Componentes Alumno---------------------------------------
import MostrarTpsAlumno from './components/MostrarTpsAlumno'
import CursoAlumno from './components/CursoAlumno';
import TpEntregaGrupal from './components/TpEntregaGrupal';
import TpEntregaAlumno from './components/TpEntregaAlumno';


const App = () => {
  return (
    <Router>
      <Container sx={{ // Utiliza sx prop para estilos en línea
        marginTop: '0px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Header />
        <div sx={{ flex: '1' }}> {/* Utiliza sx prop para estilos en línea */}
          <Switch>

            <Route path="/comision/actual" component={ComisionBeta} />
            <Route path="/tps/:idCurso/:profesorId" component={TpsBeta} />
            <Route path="/crearTps/:idCurso/:profesorId" component={CrearTpsBeta} />
            <Route path="/Administrar_Grupos/:idCurso" component={AdministrarGrupos} />
            <Route path="/tp/:idCurso/:profesorId/:tpId" component={TpDetalleBeta} />
            <Route path="/alumno/curso" component={CursoAlumno} />
            <Route path="/tpsAlumno/:idCurso/:alumnoId" component={MostrarTpsAlumno} />
            <Route path="/entregaGrupo/:idEntregaGrupal/:tpId" component={TpEntregaGrupal} />
            <Route path="/entregaAlumno/:idEntregaAlumno/:tpId" component={TpEntregaAlumno} />
            <Route path="/calificarGrupo/:idEntregaGrupal/:tpId" component={CalificarGrupo} />
            <Route path="/calificarAlumno/:idEntregaAlumno/:tpId" component={CalificarAlumno} />
            <Route path="/" component={Home} />
          </Switch>
        </div>

        <Footer />
      </Container>
    </Router>
  );
};

export default App;