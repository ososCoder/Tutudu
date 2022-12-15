'use strict';

import { move } from './animations.js';

//INPUTS#####################################################################

//input task
const inputTask = document.querySelector('input[type="text"]');

//deadline. Values
const inputDate = document.querySelector('input[type="datetime-local"]');

const now = new Date();
const date =
  now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
const hour =
  now.getHours().toLocaleString().padStart(2, 0) +
  ':' +
  now.getMinutes().toLocaleString().padStart(2, 0);
inputDate.value = `${date}T${hour}`;

//priority
const priority = document.querySelector('select');

//form
const form = document.querySelector('form.form');

//clean checked button
const cleanChecked = document.getElementsByClassName('cleanChecked');

//clean All button
const cleanAll = document.getElementsByClassName('cleanAll');

//ul-tasks
const ulTasks = document.getElementsByClassName('ul-tasks');

//LOCAL STORAGE#####################################################################
//Obtener tareas almacendas en local storage si existen
const localStorageTasks = JSON.parse(localStorage.getItem('tasks'));

//STATE#####################################################################
//Creo el objeto STATE para almacenar las tasks en el LS
//Si localStorageTasks no tiene tareas tomo un array vacío. Si tiene tareas me quedo con ellas.
const State = {
  tasks: localStorageTasks || [],
};

//ENVIAR NUEVA TAREA#####################################################################
//Función que maneja el submit del formulario.
//Renderiza la página tras enviar nueva tarea
form.addEventListener('submit', (e) => {
  e.preventDefault();

  //Creación nueva tarea en el State
  State.tasks.push({
    text: inputTask.value,
    done: false,
    deadline: inputDate.value,
    priority: priority.value,
  });

  //Guardado en el LS
  localStorage.setItem('tasks', JSON.stringify(State.tasks));

  //vaciado del input
  inputTask.value = '';

  //renderizado de ul-tasks
  render();

  //llamada funcion animacion gsap
  move();
});

//RENDER UL#####################################################################
function render() {
  //vaciado de ul-tasks
  ulTasks[0].textContent = '';

  //creación del frag
  const frag = document.createDocumentFragment();

  //recorrer array de tareas State.tasks
  for (let i = 0; i < State.tasks.length; i++) {
    //destructuring de cada array
    const { text, done, deadline, priority } = State.tasks[i];

    //trabajar el deadline para darle formato
    const year = deadline.slice(0, 4);
    const month = deadline.slice(5, 7);
    const day = deadline.slice(8, 10);

    const hours = deadline.slice(11, 13);
    const minutes = deadline.slice(14, 16);

    const date = day + '/' + month + '/' + year;
    const hour = hours + ':' + minutes;

    //creación de un li por tarea
    const liTask = document.createElement('li');

    //creación de un atributo para almacenar posición de la tarea
    liTask.setAttribute('data-index', i);

    //asigno contenido al li
    liTask.innerHTML = `
        <p class="taskText">${text}</p>
        <h3 class="taskPriority">Prioridad: ${priority}</h3>
        <h3 class="taskDeadline">${date} ${hour}</h3>
        <input type="checkbox" />
    `;

    //si la tarea está marcada como completada "done : true"
    if (done) {
      //agrego clase "done" al li
      liTask.classList.add('done');

      //agregar también el atributo "checked" al checkbox
      const checkbox = liTask.lastElementChild;
      checkbox.setAttribute('checked', true);
    }

    //prioridad de la tarea
    if (priority === 'Alta') {
      //agregar clase al liTask
      liTask.classList.add('high');
    } else if (priority === 'Media') {
      liTask.classList.add('medium');
    } else {
      liTask.classList.add('low');
    }

    //append al frag del liTask con la info
    //se hace como prepend para posicionarlo primero de la lista
    frag.prepend(liTask);
  }

  //agrego el frag al ulTasks
  ulTasks[0].append(frag);
}

//llamada a la función de render cada vez que se recarga la página
render();

//MARCAR TAREA COMO REALIZADA/NO REALIZADA#####################################################################
//añadir evento al ul que amrque la tarea como realizada o no realizada
ulTasks[0].addEventListener('click', (e) => {
  //selecciono el elemento objetivo
  const { target } = e;

  //comprobar si el elemento clickado es un input de tipo checkbox
  if (target.matches('input[Type="checkbox"]')) {
    //selecciono el li de la tarea más cercana
    const liTask = target.closest('li');

    //obtener el index de la tarea para saber a cual hago referencia
    const index = liTask.getAttribute('data-index');

    //selecciono la tarea correspondiente al index en el State.tasks array
    const currentTask = State.tasks[index];

    //si la tarea no existe se lanza un error
    if (!currentTask) throw new Error('La tarea no existe');

    //invertir la propiedad "done" para pasarla de false (por defecto la tarea no está
    //acabada) por true.
    currentTask.done = !currentTask.done;

    //actualizar el local storage
    localStorage.setItem('tasks', JSON.stringify(State.tasks));

    //render del ul
    render();
  }
});

//ELIMINAR TODAS LAS TAREAS#####################################################################
cleanAll[0].addEventListener('click', (e) => {
  e.preventDefault();

  //confirmación de eliminación
  if (confirm('¿Eliminar TODAS las tareas?')) {
    //limpiar State tasks
    State.tasks = [];

    //Actualizar localStorage
    localStorage.setItem('tasks', JSON.stringify(State.tasks));

    //render de la lista
    render();
  }
});

//ELIMINAR TAREAS COMPLETADAS#####################################################################
cleanChecked[0].addEventListener('click', (e) => {
  e.preventDefault();

  //confirmación de la eliminación de los checked true
  if (confirm('¿Eliminar las tareas completadas?')) {
    //filtro tareas NO COMPLETADAS. Así desaparecen las completadas del State.tasks
    State.tasks = State.tasks.filter((task) => !task.done);

    //actualizo local storage
    localStorage.setItem('tasks', JSON.stringify(State.tasks));

    //renderizar la página
    render();
  }
});
