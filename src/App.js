import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import { Header } from './components/Header';
import Comision from './components/Comision';

const useStyles = makeStyles(() => ({
  fixedHeader: {
    marginBottom: '40px',
    fontSize: '30px',
    color: 'DarkRed',
    backgroundColor: 'Khaki',
    textAlign: 'center',
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <>
      <Container maxWidth="xl">
        <Header></Header>

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
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </Container>
    </>
  );
}
