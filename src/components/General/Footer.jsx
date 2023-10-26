import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
        marginBottom: '0px',
    },
    fixedFooter: {
        display: 'flex',
        height: '50px',
        fontSize: '18px',
        bottom: '0',
        left: '0',
        width: '100%',
        color: 'white',
        backgroundColor: '#424242',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: '',
        // fontFamily: 'inika',
        overflow: 'hidden',
    },
    centeredElement: {
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: '0%',
        paddingRight: '15%',
    }
}));

export const Footer = () => {
    const classes = useStyles();
    return (
        <footer>
            <div className={classes.fixedFooter}>
                <p style={{ marginLeft: '10px' }}>
                    Origone 151 | Chuquisaca | Malvinas Argentinas
                </p>

                <div className={classes.centeredElement}>
                    <p>
                        UNaHur
                    </p>
                </div>

                <p style={{ marginRight: '10px' }}>
                    Contacto
                </p>
            </div>
        </footer>
    )
}
