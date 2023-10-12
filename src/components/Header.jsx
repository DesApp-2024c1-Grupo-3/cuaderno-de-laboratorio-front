import {  makeStyles } from "@material-ui/core";
import Unahur from "../Img/UNAHUR.png"

const useStyles = makeStyles(() => ({
    root: {
        marginTop: '0px',
    },
    fixedHeader: {
        display:'flex',
        height: '30%',
        fontSize: '30px',
        color: 'white',
        backgroundColor: '#c5e1a5',
        textAlign: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
}));
export const Header = () => {
    const classes = useStyles();
    return (


        <header>

            <div className={classes.fixedHeader}>
                <p>
                    <img alt="algo" src={Unahur}></img>
                </p>

                <p >
                    Cuaderno de Laboratorio
                </p>
            </div>

        </header>
    )
}