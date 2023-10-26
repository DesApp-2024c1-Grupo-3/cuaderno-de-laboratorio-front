import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import { Header } from './components/General/Header';
import Comision from './components/Comision';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '50px',
  },
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
      <Container maxWidth="xl" className={classes.root}>
        <Header></Header>

        <Router>
          <Switch>
            {
              <Route path="/comision">
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
