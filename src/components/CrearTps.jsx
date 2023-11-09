import { NavLink } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Container,
  makeStyles,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@material-ui/core';
import { conteinerButton } from '../style/buttonStyle';
import { SubHeader } from './General/SubHeader';

const useStyles = makeStyles(() => ({
  card: {},
  conteinerButton,
}));

export default function CrearTps() {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <SubHeader titulo={'Crear Tps'} />
          <Container maxWidth="l" className={classes.conteinerButton}>
            <Container>
              <TextField
                id="outlined-basic"
                label="Nombre de Tp"
                variant="outlined"
              />
            </Container>

            <Container>
              <TextField
                id="date"
                label="Birthday"
                type="date"
                defaultValue="2017-05-24"
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Container>

            {/* <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
            ></Box> */}
            <Container>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Grupal
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel value="si" control={<Radio />} label="Si" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>

              <Button disabled>Integrantes:</Button>

              <Button disabled>Minimo:</Button>
            </Container>
          </Container>

          <Button
            color="primary"
            component={NavLink}
            to="/src/components/Tps.jsx"
            key="botonVolver"
          >
            Volver
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
