import { Button, Card, CardContent, Container, Typography, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useEffect } from "react";
import { useState } from "react";
import { getDataFromBackend } from "../constants/curso";
import { getCurso as  getTodosLosUsuarios_fake } from '../services/curso-fake';
import {conteinerButton} from "../style/buttonStyle"
import {getCursoPorIdProfesor} from '../services/curso'
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { SubHeader } from "./General/SubHeader";


const useStyles = makeStyles(() => ({
    card: {},
    conteinerButton,
    curso:{  display:'inline-grid'},


}));



export default function Comision() {
  const {estadoCurso}  = useParams();
  const classes = useStyles();


  const [comision, setComision] = useState(null);
  const [hasError, setHasError] = useState(false);
  const tituloHeader = ( estadoCurso === 'actual' ?
     'Listado De Cursos |cuatrimestre actual ' :
     'Listado De Cursos | cuatrimestre anterior')

  


  useEffect(() => {
    async function fetchCommision() {
        const getFunction = getDataFromBackend
        ? getCursoPorIdProfesor("6539f56c21db6cc57698b95e")
        : getTodosLosUsuarios_fake;
      try {
        // Agregar el ID del profesor segun la informacion que tengas en tu base de datos local.
        const commision = await getFunction();
        setComision(commision);
      } catch (err) {
        console.log("Ocurrio este error.", err);
        setHasError(true);
      }
    }
    fetchCommision();
  }, []);0

  const comisionRendering = () => {
    console.log('comisionrend')
    return [
        <>
        <Card className={classes.card}>
          <CardContent>
          <Container className={classes.curso} maxWidth="xl">
                  <SubHeader titulo= {tituloHeader}/>
           
                  <Container maxWidth="xl" className={classes.conteinerButton}>
                    {comision.map((it) => (
                      //Falta Nombtr  de la  Materia 
                    <Button  component={NavLink}
                    to={`/tps/${it.idCurso}`}  variant="contained"  key={it._id}>
                        id Materia: {` ${it.idMateria}`} |{` ${it.Comision}`}
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
