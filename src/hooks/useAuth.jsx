import { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";

const client = new Keycloak({
  url: "http://localhost:8085/",
  realm: "cuaderno-de-lab",
  clientId: "cuaderno-de-lab",
});

const useAuth = () => {
  const isRun = useRef(false);
  const [token, setToken] = useState(null);
  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    client.init({
      onLoad: "login-required", 
      checkLoginIframe: false // Deshabilitar iframe para mejorar la compatibilidad
    })
    .then((authenticated) => {
      setLogin(authenticated);
      setToken(client.token);

      // Refrescar el token automáticamente antes de que expire
      if (authenticated) {
        client.onTokenExpired = () => {
          client.updateToken(30)
            .then((refreshed) => {
              if (refreshed) {
                setToken(client.token);
              }
            })
            .catch(() => {
              console.error("Failed to refresh the token, logging out.");
              client.logout();
            });
        };
      }
    })
    .catch((err) => {
      console.error("Keycloak init failed:", err);
      setLogin(false);
    });
  }, []);

  return [isLogin, token];
};

export default useAuth;
