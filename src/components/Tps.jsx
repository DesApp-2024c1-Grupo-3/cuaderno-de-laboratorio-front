import {
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDataFromBackend } from '../constants/tps';
import { conteinerButton } from '../style/buttonStyle';
import { botonesSeleccion } from '../style/buttonStyle';
import { botonVolver } from "../style/buttonStyle";
import { botonAgregar } from '../style/buttonStyle';
import { getTps as getTps_fake } from '../services/tps-fake';
import { getTodosLosTps, getTpsByCursoId } from '../services/tps';
import { NavLink } from 'react-router-dom';
import { conteinerButtonSeleccionTp } from '../style/buttonStyle';
import { SubHeader } from './General/SubHeader';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';


import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { margin } from '@mui/system';

const useStyles = makeStyles(() => ({
    contenedor: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '70vh', // Hace que el contenedor ocupe al menos el 100% de la altura de la pantalla
    },
    card: {
        flex: 1, // Hace que la Card ocupe el espacio restante
        display: 'flex',
        flexDirection: 'column',
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
    divider: {
        marginTop: '20px',
        marginBottom: '20px',
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
    const { idCurso, profesorId } = useParams();

    const classes = useStyles();

    const [tps, setTps] = useState(null);
    const [hasError, setHasError] = useState(false);
    const tituloTps = 'Tps | Comision ';
    console.log({ idCurso });

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

    useEffect(() => {
        console.log('useEfect');
        async function fetchTps() {
            console.log('useEfect1');

            try {
                /*const getFunction = getDataFromBackend
                  ? getTodosLosTps // DE COMISION IdCurso
                  : getTps_fake;*/
                const getTps = await getTpsByCursoId(idCurso);
                setTps(getTps);
            } catch (err) {
                setHasError(true);
            }
        }
        fetchTps();
    }, []);

    const tpsRendering = () => {
        console.log('tpsRendering');

        return [
            <>
                <div className={classes.contenedor}>
                    <Card className={classes.card}>
                        <CardContent>
                            <SubHeader titulo={tituloTps} />

                            <Divider className={classes.divider} />

                            <Container maxWidth="xxl" className={classes.curso}>

                                <Container maxWidth="xxl" className={classes.conteinerButtonSeleccionTp}>
                                    {tps.map((it) => (
                                        <div key={it.id}>

                                            <div className={classes.filaBotones}>

                                                <Button key={it._id} variant="contained" maxWidth="xxl" className={classes.botonesSeleccion}>

                                                    <div>
                                                        <p> {`${it.nombre} `} </p>
                                                    </div>

                                                    <div>
                                                        <p> {`| Grupal ${it.grupal ? 'Si' : 'No'}`} </p>
                                                    </div>

                                                </Button>

                                                <div style={{ alignItems: 'center', display: 'flex' }}>
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

                                <Button component={NavLink} to={`/crearTps/${idCurso}/${profesorId}`} variant="contained" className={classes.botonAgregarTp}>
                                    Agregar TP +
                                </Button>

                            </Container>

                        </CardContent>
                    </Card>
                    <Button
                        color="primary"
                        component={NavLink}
                        to="/comision"
                        key="botonVolver"
                    >
                        Volver
                    </Button>
                </div>
            </>,
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
