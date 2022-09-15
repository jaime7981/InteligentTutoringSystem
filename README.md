# InteligentTutoringSystem

## Important Folders
- ITS (Inteligent Tutoring System): Base project app, it have the settings file, main url paths and other stuff
- DCL (Diagrama Cuerpo Libre): DCL app, it have the urls for these pages, its models, the views loader, etc
- static: Loads static files, like images, js, css or html
- templates: Base app templates, like headers, side bar

## Functionality
- The route of the URL is defined in the url.py file
- The url route links up to the view.py file
- The view.py file loads the html and data

## General Tasks
- [x] Basic Pages (home, student, teacher, app, etc)
- [x] More Advanced pages (user progres, admin students, manage )
- [x] Working app, grid style drawing, snap line to node, contect with other node
- [x] Make models and database
- [x] Create login users
- [x] Load it in a docker container
- [x] launch it into production
- [ ] add more tasks...

## Entrega 2
- [x] Creacion de DCL
- [x] Guardar tarea (modelo de datos)
- [x] Disponible online para interactuar

## Entrega 3
- [x] Elementos✅
- El DCL se puede crear incluyendo todos los elementos
- [x] Fuerzas y momentos✅
- Los ángulos y las magnitudes de las fuerzas son fundamentales, deben estar presentes. Y no son "textos", son valores específicos asociados al componente.
- [x] Dimensiones✅
- Las dimensiones deben estar siempre presentes, se debe poder ver el tamaño de una barra, saber en que punto se pone un apoyo o una fuerza, etc. Todo eso debe estar presente.
- [x] Uniones (identificacion nodos)✅
- Las uniones de elementos deben llevar una identificación (recomiendo una letra), de lo contrario no tendrán como referirse a ellas para las ecuaciones de equilibrio.
- [x] Tarea Base✅
- Permitir crear nuevas tareas, definiendo un enunciado (escrito), permitiendo incorporar una
imagen como parte del enunciado
- [x] Etapas✅
- Definir las etapas para la tarea y pedir la información correspondiente.
- [ ] Generar eq equilibrio❌
- No se debe pedir las ecuaciones de equilibrio, estas deben ser generadas autom ́aticamente
por su aplicaci ́on, mostr ́andolas al usuario en todo momento mientras crea la tarea, En este
sentido, el creador si debe definir en que puntos (nodos) se debe calcular el momento.
- [ ] Indice dificultado❌
- Generar y mostrar en todo momento.
- [x] Guardar y Cargar Modelo de Datos✅

## Deployment
- Launch docker container -> `docker-compose up --build`
- Return to shell -> `COMMAND &>/dev/null &`
- Launch docker container shell -> `docker exec -it [container-id] bash`
- watch user running jobs -> `jobs`