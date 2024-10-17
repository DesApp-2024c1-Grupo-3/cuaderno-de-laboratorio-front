import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8085',
  realm: 'cuaderno-de-lab',
  clientId: 'cuaderno-de-lab',
});

export default keycloak;
