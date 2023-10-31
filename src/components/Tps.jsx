import { Button, Card, CardContent, Container, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useEffect } from "react";
import { useState } from "react";
import { getDataFromBackend } from "../constants/comisiones";
import { getComisiones as getComision_fake } from '../services/comision-fake';
import { getTodosLasComisiones } from '../services/comision'
import { conteinerButton } from "../style/buttonStyle"
import { getTps as getTps_fake } from '../services/tps-fake';
import { getTodosLosTps } from '../services/tps'
import { NavLink } from 'react-router-dom';


const useStyles = makeStyles(() => ({
    card: {},
    conteinerButton,
    curso: { display: 'inline-grid', }

}));


export default function Tps() {
    const classes = useStyles();

    const [tps, setTps] = useState(null);
    const [hasError, setHasError] = useState(false);


    useEffect(() => {
        console.log('useEfect')
        async function fetchTps() {
            console.log('useEfect1')

            try {
                const getFunction = getDataFromBackend
                    ? getTodosLosTps
                    : getTps_fake;
                const getTps = await getFunction();
                setTps(getTps);
            } catch (err) {
                setHasError(true);
            }
        }
        fetchTps();
    }, []);

    const tpsRendering = () => {
        console.log('tpsRendering')

        return [
            <>
                <Card className={classes.card}>
                    <CardContent  >
                        <Container maxWidth='xxl' className={classes.curso}>

                            <Container maxWidth='xxl' className={classes.conteinerButton}>
                                {tps.map((it) => (
                                    <div key={it.id}>
                                        <Button variant="contained">
                                            {`${it.materia} | Alumnos ${it.alumnos} | ${it.grupos}`}
                                        </Button>
                                    </div>

                                ))}

                            </Container>

                        </Container>

                        <Button variant="contained">
                            Agregar TP +
                        </Button>

                        <Button color="primary" component={NavLink} to="/comision" key="botonVolver">
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
        : tps == null
            ? loadingRendering()
            : tpsRendering();
}