import { Button, Card, CardContent, Container, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useEffect } from "react";
import { useState } from "react";
import { getDataFromBackend } from "../constants/comisiones";
import { getComisiones as getComision_fake } from '../services/comision-fake';
import { getTodosLasComisiones} from '../services/comision'
import {conteinerButton} from "../style/buttonStyle"


const useStyles = makeStyles(() => ({
    card: {},
    conteinerButton

}));
  
  
export default function Comision() {
  const classes = useStyles();

  const [comision, setComision] = useState(null);
  const [hasError, setHasError] = useState(false);


  useEffect(() => {
    console.log('useEfect')
    async function fetchCommision() {
        console.log('useEfect1')

      try {
        const getFunction = getDataFromBackend
          ? getTodosLasComisiones
          : getComision_fake;
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
            <Container maxWidth='xl' className={classes.conteinerButton}>
            {comision.map((it) => (
                <div key={it.id}>
            <Button variant="contained">
                {`${it.materia}, ${it.comision}`}
                </Button>
                </div>

             ))} 
            
            </Container>
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