import { makeStyles } from "@material-ui/core";
import Unahur from "../Img/UNAHUR.png"

const useStyles = makeStyles(() => ({
    root: {
        marginBottom: '0px',
    },
    fixedFooter: {
        display: 'flex',
        height: '50px',
        fontSize: '30px',
        bottom: '0',
        left: '0',
        width: '100%',
        color: 'gray',
        backgroundColor: '#c5e1a5',
        textAlign: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',

    }

}));
export const Footer = () => {
    const classes = useStyles();
    return (


        <footer>

            <div className={classes.fixedFooter}>
                <p>
                    Contacto
                </p>

                <p >
                    Footer
                </p>
            </div>

        </footer>
    )
}