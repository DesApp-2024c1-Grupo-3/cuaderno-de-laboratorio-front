import { Button, Card, CardContent, Container, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect } from "react";
import { useState } from "react";
import { getDataFromBackend } from "../constants/tps";
import { conteinerButton } from "../style/buttonStyle";
import { botonesSeleccion } from "../style/buttonStyle";
import { botonVolver } from "../style/buttonStyle";
import { getTps as getTps_fake } from '../services/tps-fake';
import { getTodosLosTps } from '../services/tps'
import { NavLink } from 'react-router-dom';
import { conteinerButtonSeleccionTp } from "../style/buttonStyle";

const useStyles = makeStyles(() => ({
    card: {
        height: '100vh',
    },
    conteinerButton,
    botonesSeleccion,
    conteinerButtonSeleccionTp,
    botonVolver,
    filaBotones: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    curso: { display: 'inline-grid' },
    botonAgregarTp: {

        margin: 'auto',
        marginTop: '20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '16px',
        '&:hover': {
            backgroundColor: '#45a049',
        },

    },
}));

export default function Tps() {
    const classes = useStyles();

    const [tps, setTps] = useState(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        async function fetchTps() {
            try {
                const getFunction = getDataFromBackend ? getTodosLosTps : getTps_fake;
                const getTps = await getFunction();
                setTps(getTps);
            } catch (err) {
                setHasError(true);
            }
        }
        fetchTps();
    }, []);

    const options = [
        'Eliminar',
        'Editar',

    ];

    const ITEM_HEIGHT = 48;


    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const tpsRendering = () => (
        <>
            <Card className={classes.card}>
                <CardContent>
                    <Container maxWidth='xxl' className={classes.curso}>
                        <Container maxWidth='xxl' className={classes.conteinerButtonSeleccionTp}>
                            {tps.map((it) => (
                                <div key={it.id}>
                                    <div className={classes.filaBotones}>
                                        <Button variant="contained" maxWidth='xxl' className={classes.botonesSeleccion}>
                                            <div>
                                                <p> {`${it.materia} `} </p>
                                            </div>
                                            <div>
                                                <p> {`| Alumnos ${it.alumnos}`} </p>
                                            </div>
                                            <div>
                                                <p> {`| ${it.grupos} Grupos`} </p>
                                            </div>
                                        </Button>
                                        <div>
                                            <IconButton
                                                aria-label="more"
                                                id="long-button"
                                                aria-controls={open ? 'long-menu' : undefined}
                                                aria-expanded={open ? 'true' : undefined}
                                                aria-haspopup="true"
                                                onClick={handleClick}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                id="long-menu"
                                                MenuListProps={{
                                                    'aria-labelledby': 'long-button',
                                                }}
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                PaperProps={{
                                                    style: {
                                                        maxHeight: ITEM_HEIGHT * 4.5,
                                                        width: '20ch',
                                                    },
                                                }}
                                            >
                                                {options.map((option) => (
                                                    <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Container>
                        <Button variant="contained" className={classes.botonAgregarTp} onClick={() => console.log('Agregar TP')}>
                            Agregar TP +
                        </Button>
                    </Container>
                </CardContent>
            </Card>
            <Button color="primary" component={NavLink} to="/comision" key="botonVolver" className={classes.botonVolver}>
                Volver
            </Button>
        </>
    );

    const loadingRendering = () => <Alert severity="info">Cargando usuarie ...</Alert>;

    const errorRendering = () => (
        <Alert severity="warning">
            No pudimos cargar el usuario. ¿Levantaste la API?{' '}
            <span role="img" aria-label="thinking">
                🤔
            </span>
        </Alert>
    );

    return hasError ? errorRendering() : tps == null ? loadingRendering() : tpsRendering();
}
