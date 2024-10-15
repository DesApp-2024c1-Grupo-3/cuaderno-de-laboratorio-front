import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8085/',
  realm: 'cuaderno-de-lab',
  clientId: 'cuaderno-de-lab',
});

// token generado para 365 dias en cuaderno de lab:
// eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI1YjIwM2RkZC1mMjFlLTRlMzktODM1Ni0zNjY0ZDhmZmEwNTgifQ.eyJleHAiOjE3NjA1NTI3MDMsImlhdCI6MTcyOTAxNjcwMywianRpIjoiZmI4NzYyOGQtMDJlNy00MWFlLTg4ZTgtYWIzMzljMDgyMzYwIiwiaXNzIjoiaHR0cDovLzAuMC4wLjA6ODA4NS9yZWFsbXMvY3VhZGVybm8tZGUtbGFiIiwiYXVkIjoiaHR0cDovLzAuMC4wLjA6ODA4NS9yZWFsbXMvY3VhZGVybm8tZGUtbGFiIiwidHlwIjoiSW5pdGlhbEFjY2Vzc1Rva2VuIn0.lpWeKHwBJ3n_zZA2HAFYg556gP7lL1YyBBejTeox9ttnA5dFYEjPqZORAMy0L9USkHqH_HvwY_5o3nO-1QSQ2w

export default keycloak;
