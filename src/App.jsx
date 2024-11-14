import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'; // Asegúrate de importar Router
import { Footer } from './components/General/Footer';
import LogIn from './components/LogIn';

//---------------------------Componentes Profesor---------------------------------------
import ComisionBeta from './components/ComisionBeta';
import TpsBeta from './components/TpsBeta';
import CrearTpsBeta from './components/CrearTpsBeta';
import AdministrarGrupos from './components/Profesores/AdmGrupoBeta';
import TpDetalleBeta from './components/TpdetalleMarcos';
import TpModificar from './components/TpModificar';
import CalificarGrupo from './components/CalificarGrupo';
import CalificarAlumno from './components/CalificarAlumno';
//---------------------------Componentes Alumno---------------------------------------
import MostrarTpsAlumno from './components/MostrarTpsAlumno';
import CursoAlumno from './components/CursoAlumno';
import TpEntregaGrupal from './components/TpEntregaGrupalBeta';
import TpEntregaAlumno from './components/TpEntregaAlumno';

// Componente que protege las rutas
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { keycloak } = useKeycloak();

  return (
    <Route
      {...rest}
      render={(props) =>
        keycloak?.authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const App = () => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Loading...</div>; // Espera a que Keycloak se inicialice
  }

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f5f5f5' }}>
        {keycloak?.authenticated && (
          <button
            onClick={() => keycloak.logout()}
            style={{ padding: '10px', backgroundColor: '#f44336', color: '#ffffff', border: 'none', borderRadius: '5px' }}
          >
            Cerrar Sesión
          </button>
        )}
      </header>

      <Router> {/* Envolviendo las rutas en Router */}
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

          {/* Rutas protegidas para el profesor */}
          <ProtectedRoute path="/comision/actual/:profesorId" component={ComisionBeta} />
          <ProtectedRoute path="/tps/:idCurso/:profesorId" component={TpsBeta} />
          <ProtectedRoute path="/crearTps/:idCurso/:profesorId" component={CrearTpsBeta} />
          <ProtectedRoute path="/Administrar_Grupos/:idCurso/:profesorId" component={AdministrarGrupos} />
          <ProtectedRoute path="/tp/:idCurso/:profesorId/:tpId" component={TpDetalleBeta} />
          <ProtectedRoute path="/calificarGrupo/:idEntregaGrupal/:profesorId/:tpId" component={CalificarGrupo} />
          <ProtectedRoute path="/calificarAlumno/:idEntregaAlumno/:profesorId/:tpId" component={CalificarAlumno} />
          <ProtectedRoute path="/modificarTP/:idCurso/:profesorId/:tpId" component={TpModificar} />

          {/* Rutas protegidas para el alumno */}
          <ProtectedRoute path="/alumno/curso/:alumnoId" component={CursoAlumno} />
          <ProtectedRoute path="/tpsAlumno/:idCurso/:alumnoId" component={MostrarTpsAlumno} />
          <ProtectedRoute path="/entregaGrupo/:alumnoId/:tpId/:idCurso" component={TpEntregaGrupal} />
          <ProtectedRoute path="/entregaAlumno/:alumnoId/:tpId/:idCurso" component={TpEntregaAlumno} />

          <Route path="/login" component={LogIn} />

          <Route path="*">
            <div>Página no encontrada</div>
          </Route>
        </Switch>
        <Footer/>
      </Router>
    </div>
  );
};

export default App;
