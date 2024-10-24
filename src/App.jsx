import { Container } from '@mui/material'; // Importa Container desde @mui/material;
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LogIn from './components/LogIn';
import { Footer } from './components/General/Footer';

//---------------------------Componentes Profesor---------------------------------------
import ComisionBeta from './components/ComisionBeta';
import TpsBeta from './components/TpsBeta';
import CrearTpsBeta from './components/CrearTpsBeta';
import AdministrarGrupos from './components/Profesores/AdmGrupoBeta';
import TpDetalleBeta from './components/TpDetalleBeta';
import TpModificar from './components/TpModificar';


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
        {/* Utiliza sx prop para estilos en línea <Header />*/}
        <div sx={{ flex: '1' }}> {/* Utiliza sx prop para estilos en línea */}
          <Switch>

            <Route path="/comision/actual/:profesorId" component={ComisionBeta} />
            <Route path="/tps/:idCurso/:profesorId" component={TpsBeta} />
            <Route path="/crearTps/:idCurso/:profesorId" component={CrearTpsBeta} />
            <Route path="/Administrar_Grupos/:idCurso/:profesorId" component={AdministrarGrupos} />
            <Route path="/tp/:idCurso/:profesorId/:tpId" component={TpDetalleBeta} />
            <Route path="/calificarGrupo/:idEntregaGrupal/:profesorId/:tpId" component={CalificarGrupo} />
            <Route path="/calificarAlumno/:idEntregaAlumno/:profesorId/:tpId" component={CalificarAlumno} />
            <Route path="/modificarTP/:idCurso/:profesorId/:tpId" component={TpModificar} />


            <Route path="/alumno/curso/:alumnoId" component={CursoAlumno} />
            <Route path="/tpsAlumno/:idCurso/:alumnoId" component={MostrarTpsAlumno} />
            <Route path="/entregaGrupo/:alumnoId/:tpId" component={TpEntregaGrupal} />
            <Route path="/entregaAlumno/:alumnoId/:tpId" component={TpEntregaAlumno} />

            <Route path="/" component={LogIn} />

          </Switch>
        </div>

        <Footer />
      </Container>
    </Router>
  );
};

export default App;