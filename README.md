# Repositorio semilla: aplicación React :seedling:

> Este repositorio es un fork de [otro que está en la organización surprograma](https://github.com/surprograma/react-recoil-app-seed).  
> El original es uno de los repositorios que se usan en la serie de videos **Tu primera aplicación full stack: NodeJS + React**, [disponible en YouTube](https://www.youtube.com/playlist?list=PL7q-McYJyHlgVGQIRYVKl381twyJ4XM_h).  
> Mirar estos videos es una muy buena forma de entender un poco más sobre las tecnologías que van a usarse. :smiley:
>
> A continuación, transcribimos los comentarios del repo de surprograma, con algunas modificaciones y agregados que (creo) pueden venir bien en el contexto de la materia.

¡Bienvenida/o! En este repositorio encontrarás una plantilla (de las infinitas posibles) para crear una aplicación web con React. Las principales tecnologías que utilizamos son:

- [React](https://reactjs.org/): framework para construir interfaces de usuario.
- [React Router](https://reactrouter.com/): paquete para manejar las distintas páginas que va a incluir la aplicación.
- [Material UI](https://material-ui.com/): sistema de componentes visuales para React.
- [Jest](https://jestjs.io/): framework para escribir tests.

Esta plantilla también incorpora al paquete [Recoil](https://recoiljs.org/), que sirve para manejar estado en React.  
Vamos a hablar sobre cuándo usar (o no) Recoil, y cómo hacerlo. Se puede arrancar "sin Recoil", al menos hasta estar más fluidos con React.

Para crear un proyecto siguiendo esta plantilla, lo único que tenés que hacer es clickear en el botón que dice `Use this template`. ¡Y no te olvides de cambiarle el nombre en el `package.json`!

:information_source: Este proyecto fue creado con [Create React App](https://create-react-app.dev/), y por lo tanto toda la documentación del sitio oficial también puede consultarse para saber más.

## :point_up: Prerrequisitos - para instalar antes de empezar

Vas a necesitar un IDE o al menos un editor de texto que coloree la sintaxis. Recomendamos utilizar [Visual Studio Code](https://code.visualstudio.com/) - que se lleva muy bien con proyectos JavaScript - enriquecido con los siguientes plugins:

- [ESlint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer)
- [Jest Test Explorer](https://marketplace.visualstudio.com/items?itemName=kavod-io.vscode-jest-test-adapter)

Para ejecutar el código es necesario tener NodeJS en su versión 14 (`lts/fermium`). Para instalarlo recomendamos utilizar el manejador de versiones [`nvm`](https://github.com/nvm-sh/nvm), aunque también podés hacerlo manualmente siguiendo las instrucciones adecuadas para tu sistema operativo.

El ejemplo viene preparado para ser ejecutado junto a una API, que puede crearse desde [este repositorio](https://github.com/unahur-desapp/nodejs-api-seed).

## :ballot_box_with_check: Configuración inicial del proyecto

Asumiendo que ya configuraste todos los prerrequisitos, estos son los comandos que deberías ejecutar la primera vez que trabajes en el proyecto:

```shell
# Copia las variables de entorno necesarias para interactuar con la API.
cp .env.example .env

# Instala las dependencias Node del proyecto.
npm install
```

## Usando el repo para armar mi app

### Estilo de programación

Se recomienda **muy fuertemente** usar componentes funcionales, así están definidas las páginas de ejemplo.  
Hay que aprender cómo usar Hooks, para eso (empezar por) mirar la [doc de React al respecto](https://reactjs.org/docs/hooks-intro.html).

### Estilos CSS

Creo que el tiempo que le dediquen a estudiar Material UI está muy bien invertido. Chusmeen y prueben.  
Para aplicar estilos propios, fíjense el uso de `makeStyles` en las páginas de ejemplo. Usen `style` poco y nada.

> **Nota**  
> En el listado se incluye el link a los datos de un usuario en dos formas distintas, para que se vea cómo queda con el `Link` de `react-router` "pelado", y (mucho más lindo) usando componentes de Material UI.

### Relación con el (o los) backend

Como se ve en el ejemplo, no hace falta meter backend al principio, y se puede incorporar más adelante de una forma que no cambia mucho el código.  
Para esto, conviene focalizar el acceso al backend en hooks `useEffect` específicos.

En el ejemplo también se muestra que pueden definirse servicios de acceso al backend, que devuelvan datos fijos. Y después se van cambiando por los reales.

**Atención**  
Es importante que no haya llamados al backend, o referencias a las URL, fuera de la carpeta `services`.

> **Nota**  
> Para que funcione con backend, hay que cambiar la constante `getDataFromBackend` en `src\constants\constants.js`. El backend es exactamente el del template para backend. Este frontend se banca que no haya backend, aparece una indicación en la pantalla.

> **Otra nota**  
> En el ejemplo se puede elegir con o sin backend sólo para facilitar la experimentación; esto no hace falta hacerlo en los proyectos de ustedes.

### Cómo agregar mis páginas

Creo que al menos al principio, conviene dejar los componentes que están para tenerlos de referencia.  
Por suerte, React Router hace fácil agregar nuevas páginas. Para eso, alcanza con

- Crear un nuevo componente, dentro de `components`. Vale crear subcarpetas de `components` para organizarnos.
- Agregar una `Route` en `/src/App.js`, cuyo contenido sea el componente recién creado.
- Fin.

En el mismo `/src/App.js` se muestra cómo hacer para dejar una parte de la página fija, que no dependa de las rutas. Esto puede servir para armar un menú. Obvio que esta es una de las _mil_ opciones para armar un menú.

### Variables de entorno

Create React App incorpora [dotenv](https://github.com/motdotla/dotenv).
Por eso se indica de copiar el `.env.example` como `.env`.
El paquete `dotenv` lee ese archivo y lo incorpora igual que si hubieran definido las variables de entorno por línea de comandos.  
Miren el ejemplo de cómo se accede al backend en `services/utils.js`; se usa `process.env` directamente.

Los detalles de cómo funciona el uso de variables de entorno se pueden leer en [la doc de Create React App al respecto](https://create-react-app.dev/docs/adding-custom-environment-variables/).

**OJO**  
_solamente_ mira variables de entorno que empiecen con `REACT_APP`.

**Nota**  
Vale absolutamente encapsular el acceso a las variables de entorno en un `config.js`, como está hecho en el template de backend.  
La diferencia es que en este proyecto no se necesita incorporar `dotenv`, porque ya lo hace Create React App.

## :file_folder: Estructura de directorios

Breve descripción de qué se puede encontrar en cada uno de los directorios del proyecto:

```shell
├── public                  # Index, favicon y otros archivos comunes
└── src
    ├── components          # Componentes de React - versión "sin Recoil"
    ├── components-recoil   # Componentes de React - versión "con Recoil"
    ├── state               # Selectores y átomos de Recoil
    └── services            # funciones de acceso a un backend
```

## :woman_technologist: :man_technologist: Comandos útiles para el día a día

A continuación, algunos comandos necesarios para el desarrollo diario en este proyecto.

### Código

```shell
# Levanta el proyecto y recarga automáticamente si hay cambios.
npm start

# Ejecuta los tests y se queda esperando por cambios.
npm test
```

## :rocket: Despliegue

Para publicar en Heroku, seguir esta guía: https://blog.heroku.com/deploying-react-with-zero-configuration.
