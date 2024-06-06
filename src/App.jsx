import { Container} from  '@mui/material'; // Importa Container desde @mui/material;
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import { Header } from './components/General/Header';
import { Footer } from './components/General/Footer';
import Comision from './components/Comision';
import TpsBeta from './components/TpsBeta';
import CrearTpsBeta from './components/CrearTpsBeta';
import AdministrarGrupos from './components/Profesores/AdmGrupoBeta';
import MostrarTpsAlumno from './components/MostrarTpsAlumno'
import CursoAlumno from './components/CursoAlumno';
import TpDetalleBeta from './components/TpDetalleBeta';
import TpEntrega from './components/TpEntrega'

const App = () => {
  return (
    <Router>
      <Container  sx={{ // Utiliza sx prop para estilos en línea
        marginTop: '0px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Header />

        <div sx={{ flex: '1' }}> {/* Utiliza sx prop para estilos en línea */}
          <Switch>
                   
            <Route path="/comision/actual" component={Comision} />
            <Route path="/tps/:idCurso/:profesorId" component={TpsBeta} />
            <Route path="/crearTps/:idCurso/:profesorId" component={CrearTpsBeta} />
            <Route path="/Administrar_Grupos/:idCurso" component={AdministrarGrupos} />
            <Route path="/tp/:idCurso/:profesorId/:tpId" component={TpDetalleBeta} />
            <Route path="/alumno/curso" component={CursoAlumno} /> {/* Nueva ruta para CursoAlumno */}
            <Route path="/tpsAlumno/:idCurso/" component={MostrarTpsAlumno} /> {/* Nueva ruta para MostrarTpsAlumno */}
            <Route path="/entregaGrupo/:idEntrega" component={TpEntrega} />
            <Route path="/entregaAlumno/:idEntrega" component={TpEntrega}  />
            <Route path="/" component={Home} />
          </Switch>
        </div>

        <Footer />
      </Container>
    </Router>
  );
};

export default App;