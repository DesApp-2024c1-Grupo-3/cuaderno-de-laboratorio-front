import { Button, Card, CardContent, Container, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useEffect } from "react";
import { useState } from "react";
import { getDataFromBackend } from "../constants/tps";
import { conteinerButton } from "../style/buttonStyle"
import { botonesSeleccion } from "../style/buttonStyle";
import { botonVolver } from "../style/buttonStyle";
import { getTps as getTps_fake } from '../services/tps-fake';
import { getTodosLosTps } from '../services/tps'
import { NavLink } from 'react-router-dom';
import { conteinerButtonSeleccionTp } from "../style/buttonStyle"


const useStyles = makeStyles(() => ({
    card: {
        height: '100vh',
    },
    conteinerButton,
    botonesSeleccion,
    conteinerButtonSeleccionTp,
    botonVolver,
    curso: { display: 'inline-grid', },
    botonAgregarTp: {
        width: '60%',
        margin: 'auto',
        marginTop: '450px',
    }

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

                            <Container maxWidth='xxl' className={classes.conteinerButtonSeleccionTp}>
                                {tps.map((it) => (
                                    <div key={it.id}>
                                        <Button variant="contained" maxWidth='xxl' className={classes.botonesSeleccion} >
                                            <div >
                                                <p> {`${it.materia} `} </p>
                                            </div>
                                            <div>

                                                <p> {`| Alumnos ${it.alumnos}`} </p>
                                            </div>
                                            <div>

                                                <p> {`| ${it.grupos} Grupos`} </p>
                                            </div>

                                        </Button>
                                    </div>

                                ))}

                            </Container>
                            <Button variant="contained" className={classes.botonAgregarTp} maxWidth='xxl'>
                                Agregar TP +
                            </Button>
                        </Container>




                    </CardContent >
                </Card >
                <Button color="primary" component={NavLink} to="/comision" key="botonVolver" className={classes.botonVolver}>
                    Volver
                </Button>
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