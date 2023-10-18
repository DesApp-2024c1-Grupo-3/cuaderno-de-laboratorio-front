import {
  Button,
  Card,
  CardContent,
  Container,
  makeStyles,
} from '@material-ui/core';
import { conteinerButton } from '../style/buttonStyle';

const useStyles = makeStyles(() => ({
  card: {},
  conteinerButton


}));


export default function Home() {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Container maxWidth='xl' className={classes.conteinerButton}>
            <Button variant="contained"> cuatrimestre actual</Button>
            <Button variant="contained"> cuatrimestres anteriores</Button>
          </Container>
        </CardContent>
      </Card>
    </>
  );
}
