import { Container } from '@mui/material'; // Importa Container desde @mui/material;
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import { Header } from './components/General/Header';
import { Footer } from './components/General/Footer';
import Comision from './components/Comision';
import TpsBeta from './components/TpsBeta';
import Tps from './components/Tps';
import CrearTps from './components/CrearTps';
import CrearTpsBeta from './components/CrearTpsBeta';
import AdministrarGrupos from './components/Profesores/AdmGrupos';
import TpDetalle from './components/TpDetalle';
import TpDetalleBeta from './components/TpDetalleBeta';
import CursosAlum from './components/Alumnos/CusosAlum';
import DetalleTp from './components/DetalleTP';


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
            {/*<Route path="/comision/anterior" component={Comision} />*/}
            {/*<Route path="/tp/:idCurso/:profesorId/:tpId" component={TpDetalle} />*/}
            {/*<Route path="/tps/:idCurso/:profesorId" component={Tps} />*/}
            {/*<Route path="/crearTps/:idCurso/:profesorId" component={CrearTps} />*/}
            <Route path="/comision/actual" component={Comision} />
            <Route path="/tps/:idCurso/:profesorId" component={TpsBeta} />
            <Route path="/detalleDeTP/:idCurso/:profesorId" component={DetalleTp} />
            <Route path="/crearTps/:idCurso/:profesorId" component={CrearTpsBeta} />
            <Route path="/Administrar_Grupos/:idCurso" component={AdministrarGrupos} />
            {/*<Route path="/tp/:idCurso/:profesorId/:tpId" component={TpDetalleBeta} />*/}
            <Route path="/tp/:idCurso/:profesorId/:tpId" component={DetalleTp} />
            <Route path="/alumnos/:idAlumno" component={CursosAlum} />
            <Route path="/" component={Home} />
          </Switch>
        </div>

        <Footer />
      </Container>
    </Router>
  );
};

export default App;