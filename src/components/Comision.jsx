import { Button, Card, CardContent, Container, Typography, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useEffect } from "react";
import { useState } from "react";
import { getDataFromBackend } from "../constants/curso";
import { getCurso as getCurso_fake } from '../services/curso-fake';
import {conteinerButton} from "../style/buttonStyle"
import {getTodosLasCursos} from '../services/curso'
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import {SubH, SubHeader }from "./SubHeader";


const useStyles = makeStyles(() => ({
    card: {},
    conteinerButton,
    curso:{  display:'inline-grid'},
  

}));
  
  
export default function Comision() {
  const {estadoCurso}  = useParams();
  const classes = useStyles();
  console.log('estado:', {estadoCurso})

  const [comision, setComision] = useState(null);
  const [hasError, setHasError] = useState(false);


  useEffect(() => {
    console.log('useEfect')
    async function fetchCommision() {
        console.log('useEfect1')

      try {
        const getFunction = getDataFromBackend
          ? getTodosLasCursos
          : getCurso_fake;
        const commision = await getFunction();
        setComision(commision);
      } catch (err) {
        setHasError(true);
      }
    }
    fetchCommision();
  }, []);

  const comisionRendering = () => {
    console.log('comisionrend')

    return [
        <>
        <Card className={classes.card}>
          <CardContent>
          <Container className={classes.curso} maxWidth="xl">
          <Container>
                  {estadoCurso === 'actual' ? <Typography variant="h4" >Listado De Cursos |cuatrimestre actual </Typography>:<Typography variant="h4" >Listado De Cursos | cuatrimestre anterior </Typography> }
                </Container>
                              <Container maxWidth="xl" className={classes.conteinerButton}>
                    
                    {comision.map((it) => (
                    <Button   variant="contained"  key={it.id}>
                        Falta Name Materia id:{`${it.idMateria} | ${it.Comision}`}
                        </Button>

                    ))} 
                
                </Container>
            </Container>

            <Button color="primary" component={NavLink} to="/" key="botonVolver">
        Volver
      </Button>

          </CardContent>
        </Card>
      </>
    
    ];
  };

  const loadingRendering = () => {
    return <Alert severity="info">Cargando usuarie ...</Alert>;
  };
  
  const errorRendering = () => {
    return (
      <Alert severity="warning">
        No pudimos cargar el usuario. ¿Levantaste la API?{' '}
        <span role="img" aria-label="thinking">
          🤔
        </span>
      </Alert>
    );
  };

    return hasError
    ? errorRendering()
    : comision == null
      ? loadingRendering()
      : comisionRendering();
  }