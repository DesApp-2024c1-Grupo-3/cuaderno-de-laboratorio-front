import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import LogIn from './components/LogIn';

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
import MostrarTpsAlumno from './components/MostrarTpsAlumno';
import CursoAlumno from './components/CursoAlumno';
import TpEntregaGrupal from './components/TpEntregaGrupal';
import TpEntregaAlumno from './components/TpEntregaAlumno';

// Componente para rutas protegidas
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { keycloak } = useKeycloak();

  return (
    <Route
      {...rest}
      render={props =>
        keycloak?.authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" /> // Redirigir a la página de inicio de sesión si no está autenticado
        )
      }
    />
  );
};

const App = () => {
  const { keycloak, initialized } = useKeycloak();

  // Mostrar un mensaje de carga mientras se inicializa Keycloak
  if (!initialized) {
    return <div>Loading...</div>;
  }

  // Si el usuario no está autenticado, muestra el componente de inicio de sesión
  if (!keycloak.authenticated) {
    return <LogIn />;
  }

  return (
    <Router>
      <div>
        <Switch>
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
          <ProtectedRoute path="/entregaGrupo/:alumnoId/:tpId" component={TpEntregaGrupal} />
          <ProtectedRoute path="/entregaAlumno/:alumnoId/:tpId" component={TpEntregaAlumno} />

          {/* Ruta por defecto para manejar no encontradas */}
          <Route path="*">
            <div>Página no encontrada</div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;