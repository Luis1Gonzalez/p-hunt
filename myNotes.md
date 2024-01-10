# Clon de Product Hunt

Este proyecto se realizó con NextJs V-13.5.

### Style Components


1. Para los estilos se usara Style components y para ellos se instalaron las siguientes dependencias:

`npm i @emotion/core @emotion/styled babel-plugin-emotion @emotion/babel-preset-css-prop`

2. Se debe crear a nivel general un archivo llamado .babelrc el cual debe contener el siguiente codigo:
 
 `{
    "presets": [
        "next/babel",
        "@emotion/babel-preset-css-prop"
    ],
    "plugins": [
        [
            "@emotion"
        ]
    ]
}`

### Para normalizar los estilos de este proyecto se uso normalize.

Sigue siendo la mejor forma hasta el dia de hoy.

Web: `https://cdnjs.com/libraries/normalize`

copiar la opcion: .normalize.min.css

pegarlo en en head, en el unico que lo hemos puesto en el layout, este nos servirá para toda la aplicación.

### Fuentes:

Agregaremos fuentes de Google Fonts

Las funtes se agregan en el mismo head y hay que tener cuidado con el cierre de la etiqueta link por el momento.

### Agregar hoja de estilos:

Para agregar una hoja de estilos al igual que imagenes hay que crear y agregarlas las carpetas:

public/static/css

y

public/static/img

respectivamente.

los estilos se importaran en el mismo head que el normalize, este head es unico.

### Firebase

Para la utenticasion usamos la utilidad de google firebase.

Para instalarla ingresamos en consola el siguiente codigo: `npm i firebase` y `npm i firebase-admin`.


### Generar un id en node

instalamos la dependencia uuid

`npm i uuid`

luego importamos `import { v4 } from "uuid";`

### Formatear Fecha

Para formatear fecha podemos instalar la libreria date-fns

Ingresando en consola: `npm i date-fns`