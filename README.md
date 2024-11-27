# Cuaderno de Laboratorio - Guía de Inicio Rápido - Frontend

## **Requisitos previos**

1. **Node.js** (versión < 18)  
   Descárgalo desde [Node.js Official Website](https://nodejs.org/).

2. **Docker y Docker Compose**  
   Instálalos desde [Docker Official Website](https://www.docker.com/).

---

## **Pasos para el despliegue**

### 1. Clonar el repositorio del Frontend

Navegar al directorio donde va a estar el frontend y ejecutar el comando:

```bash
git clone https://github.com/DesApp-2024c1-Grupo-3/cuaderno-de-laboratorio-front.git
```

### 2. Cambiar a rama dev

En el directorio raíz donde está el frontend ejecutar el comando:

```bash
git checkout dev
```

### 3. Instalar dependencias

En el directorio raíz donde está el frontend ejecutar el comando:

```bash
npm install
```

### 4. Configurar archivo de variables de ambiente

En el directorio raíz donde está el frontend ejecutar el comando:

```bash
cp .env.example .env
```

### 5. Iniciar Docker-Compose

Con el motor de docker corriendo, en el directorio raíz donde está el frontend ejecutar el comando:

```bash
docker-compose up -d
```

### 6. Configuración de Keycloak (primera vez que se inicia el proyecto)

#### Acceder a Keycloak a través de [http://localhost:8085](http://localhost:8085)

Ingresar al sistema con las siguientes credenciales:

Usuario: _adminkc_

Contraseña: _K3ycl04k321!_

#### Ingresar al reino en Keycloak

Una vez dentro de Keycloak, ingresar al reino (Realm).

![Enter_Keycloak_Realm](assets/enterKeycloakRealm.gif)

#### Importar usuarios a Keycloak

Navegar a la configuración del reino

Ir a **Acciones -> Partial Import** y seleccionar el archivo [Imports_Keycloak/cuaderno-de-lab-users-0.json](https://raw.githubusercontent.com/DesApp-2024c1-Grupo-3/cuaderno-de-laboratorio-front/refs/heads/dev/Imports_Keycloak/cuaderno-de-lab-users-0.json)

<!-- Ver si el link anterior sirve para futuras actualizaciones del repo -->

Seleccionar el **checkbox** de los usuarios

Importar

![Import_Users](assets/importusers.gif)

### 7. Iniciar el frontend

En el directorio raíz donde está el frontend ejecutar el comando:

```bash
npm start
```

---

## **Usuarios**

Contamos con un total de 2 profesores y 30 alumnos.

Los alumnos tienen ID autoincrementales a partir del 10000000.

Todos los usuarios tienen la misma contraseña.

| Tipo de usuario | Usuario  | Contraseña |
| --------------- | -------- | ---------- |
| Profesor        | 12345678 | 1234       |
| Profesor        | 87654321 | 1234       |
| Alumno          | 10000000 | 1234       |
| Alumno          | 10000001 | 1234       |
| Alumno          | 10000002 | 1234       |
| Alumno          | 10000003 | 1234       |
| ...             | ...      | ...        |
| Alumno          | 10000028 | 1234       |
| Alumno          | 10000029 | 1234       |

### Crear usuario nuevo en keycloak

#### Ingresar al reino en Keycloak

Una vez dentro de Keycloak, ingresar al reino (Realm).

![Enter_Keycloak_Realm](assets/enterKeycloakRealm.gif)

#### Crear un nuevo usuario

- En el menú lateral, selecciona la opción **Users**.

- Haz clic en el botón **Add User**.

- Completa los campos básicos, como:

  - **Username**: Nombre único obligatorio.
  - **Email**: Opcional, pero útil para autenticación o notificaciones.
  - **First name**: Nombre, opcional para más contexto.
  - **Last name**: Apellido, opcional para más contexto.

- Haz clic en **Create** para crear el usuario.

![Create_User](assets/createUser.png)

#### Configurar credenciales

- Ve a la pestaña **Credentials**.

- Haz clic en el botón **Set password**.

![Set_Password](assets/setPassword.png)

- Configure una contraseña para el usuario:

  - Ingrese la contraseña.
  - Marca la opción **Temporary** si quieres que el usuario deba cambiarla al iniciar sesión.
  - Haga clic en **Save**.

![Configure_Password](assets/configurePassword.png)

#### Asignar roles o grupos (opcional)

- Desde la pestaña **Role mapping** o **Groups** , puedes asignar permisos o agrupar al usuario.

![Assing_Role](assets/assingRole.png)

#### Generación de roles

- Ir a la pestaña **Realm roles**.

- Haz clic en el botón **Create role**.

![Create_Role](assets/createRole.png)

- Configure los campos del rol:
  - **Role name**: Nombre único obligatorio.
  - **Description**: Opcional, descripcion del rol.

![Configure_Role](assets/configureRole.png)

#### Establecer política de passwords

- Ir a la pestaña **Authentification**.

- Ir a la pestaña **Policies**.

- Ir a la pestaña **Password policy**.

- Haz clic en el desplegable **Add policy**.

- Definir y configurar las politicas a aplicar.

![Authentification_Add_Policy](assets/authentificationAddPolicy.png)

**_Ejemplo_**

Se ha establecido una longitud para las claves de 12 caracteres, al menos 1 mayúscula, 1 minúscula, un dígito numérico y un carácter especial.

![Authentification_Example_Policy](assets/authentificationExamplePolicy.png)

#### Login de usuario

El usuario tiene permitido loguearse con su dni o su mail asociado.

![Sign_In_Example](assets/signInExample.png)

Cuando el usuario ingresa, debido a que marcamos como “Temporal” su password, debe cambiarlo y le aparece la siguiente pestaña:

![Update_Password_Example](assets/updatePasswordExample.png)

Al poner un password que no cumple con la política establecida, se le indica mediante un mensaje informativo cual es el motivo por el cual debe mejorar los datos ingresados (ver la próxima sección de configuración de política de passwords)

![Error_Update_Password_Example](assets/errorUpdatePasswordExample.png)
