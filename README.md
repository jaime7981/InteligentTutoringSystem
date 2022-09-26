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
- [x] Generar eq equilibrio✅
- No se debe pedir las ecuaciones de equilibrio, estas deben ser generadas autom ́aticamente
por su aplicaci ́on, mostr ́andolas al usuario en todo momento mientras crea la tarea, En este
sentido, el creador si debe definir en que puntos (nodos) se debe calcular el momento.
- [x] Indice dificultado✅
- Generar y mostrar en todo momento.
- [x] Guardar y Cargar Modelo de Datos✅

## Entrega 4 (FINAL)
- [x] funcionalidad de creación de tareas. (0.4)
- [ ] funcionalidad de visualización de estado de usuarios del ITS. (0.4)
- Por bajar carga de integrantes entiendo que no se debiese hacer.
- [ ] funcionalidad del ITS - outer loop. (0.6)
- En funcion del progreso del estudiante va determinando cual es la siguiente.
tarea que debe resolver para avanzar en su aprendizaje.
- [ ] funcionalidad del ITS - inner loop. (1.4)
- Va apoyando al estudiante en el desarrollo de una tarea, entregandole retroalimentacion 
sobre su respuesta y hints que le permitan aprender y continuar con la solucion.
- [ ] calidad de la construcción de los hints. (0.6)
- Por bajar carga de integrantes entiendo que no se debiese hacer.
- [ ] usabilidad del diseño de los DCL por parte del estudiante. (0.8)
- [ ] BONUS: fuerzas distribuidas linealmente. (0.3)

# INFO ITS
- Modulo de dominio → representa el conocimiento que se quiere ense ̃nar, el dominio del problema.
Es asi como se incluyen los principales conceptos y sus relaciones. Se debe representar
en una forma que permita aplicarlo a las tareas que el estudiante debe resolver.
- Modulo del modelo del estudiante → representa cuanto sabe el estudiante respecto del objetivo de aprendizaje, 
por ende esta muy vinculado al dominio. Es en funcion del avance del
estudiante sobre el dominio que se definen las siguientes tareas que debera realizar.
- Modulo de Tutoria → define tanto el outer loop, como el inner loop. En otras palabras, busca
definir un algoritmo que permita al estudiante alcanzar el conocimiento total sobre el dominio.
- Modulo de Interfaz de Usuario → define como interactuara el ITS con el estudiante, traspasando
la informacion desde y hacia el modelo de tutoria.


## Deployment
- Launch docker container -> `docker-compose up --build`
- Return to shell -> `COMMAND &>/dev/null &`
- Launch docker container shell -> `docker exec -it [container-id] bash`
- watch user running jobs -> `jobs`