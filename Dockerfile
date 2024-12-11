# Usa la imagen base de Keycloak especificada en el Compose
FROM quay.io/keycloak/keycloak:26.0.0

# Copia el tema personalizado a la carpeta de temas de Keycloak
COPY Imports_Keycloak/Tema_UNAHUR /opt/keycloak/themes/Tema_UNAHUR

# Copia el archivo de exportación del realm
COPY Imports_Keycloak/realm-export.json /opt/keycloak/data/import/realm-export.json
