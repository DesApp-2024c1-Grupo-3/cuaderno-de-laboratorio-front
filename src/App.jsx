import { Container, makeStyles } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import { Header } from './components/General/Header';
import { Footer } from './components/General/Footer';
import Comision from './components/Comision';
import Tps from './components/Tps';
import CrearTps from './components/CrearTps';
import AdministrarGrupos from './components/Profesores/AdmGrupos';
import TpDetalle from './components/TpDetalle';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '0px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  fixedHeader: {
    fontSize: '30px',
    color: 'DarkRed',
    backgroundColor: 'Khaki',
    textAlign: 'center',
  },
  content: {
    flex: '1', // El contenido tomará el espacio restante
  },
}));

export default function App() {
  const classes = useStyles();
  return (
    <>
      <Container maxWidth="xxl" maxHeigth="xxl" className={classes.root}>
        <Header></Header>

        <div className={classes.content}>
          <Router>
            <Switch>
              {
                <Route path="/comision/:estadoCurso">
                  <Comision />
                </Route>

                /*<Route path="/recoil/usuarios/:id">
                <RecoilDatosUsuario />
              </Route>
              <Route path="/usuarios/:id">
                <DatosUsuario />
              </Route>*/
              }
              {
                <Route path="/tps/:idCurso/:profesorId">
                  <Tps />
                </Route>
              }
              {
                <Route path="/crearTps/:idCurso/:profesorId">
                  <CrearTps />
                </Route>
              }
              {
                <Route path="/Administrar_Grupos/:idCurso">
                  <AdministrarGrupos />
                </Route>
              }
              {
                <Route
                  path="/tp/:idCurso/:profesorId/:tpId"
                  component={TpDetalle}
                />
              }

              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Router>
        </div>

        <Footer></Footer>
      </Container>
    </>
  );
}
