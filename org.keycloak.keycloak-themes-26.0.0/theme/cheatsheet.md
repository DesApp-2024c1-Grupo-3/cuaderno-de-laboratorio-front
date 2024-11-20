# listar los containers

docker ps

# reiniciar un container en particular

# container id

docker restart e7c2e6e82234

# para ejecutar una orden al container

# interactivo terminal

# container id

# shell interactivo

docker exec -it e7c2e6e82234 bash

# para ejecutar el bash en modo root

docker exec -u root -it 026584f2827c /bin/bash

# copiar

# origen (host)

# container id

# :destino (cointainer)

docker cp C:\Users\Aguss\Desktop\DesApp1C2024\cuaderno-de-laboratorio-front\org.keycloak.keycloak-themes-26.0.0\theme\Tema_UNAHUR 026584f2827c:/opt/keycloak/themes/Tema_UNAHUR
docker cp C:\Users\Aguss\Desktop\DesApp1C2024\cuaderno-de-laboratorio-front\org.keycloak.keycloak-themes-26.0.0\theme\tema_UNAHUR2 17bcbcc5cae0:/opt/keycloak/themes/Tema_UNAHUR2

# para ejecutar una orden al container

# container id cosas a hacer

# remove

# recursivo (todas las cosas para abajo despues del directorio) forzoso (hace todo sin preguntar archivo por archivo)

# que directorio

docker exec e7c2e6e82234 rm -rf /opt/keycloak/themes/mi-tema

docker cp C:\Users\Aguss\Desktop\DesApp1C2024\cuaderno-de-laboratorio-front\org.keycloak.keycloak-themes-26.0.0\theme\Tema_UNAHUR 026584f2827c:/opt/keycloak/themes/Tema_UNAHUR
docker exec -u root -it 026584f2827c /bin/bash
rm -rf opt/keycloak/themes/Tema_UNAHUR/

docker exec -u root 026584f2827c rm -rf opt/keycloak/themes/Tema_UNAHUR/
