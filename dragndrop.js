const backlogTasks = document.querySelector(`.backlog__tasks`);
const taskElements = backlogTasks.querySelectorAll(`.backlog__task_column`);

taskElements.forEach((task) => task.draggable = true);

taskElements.forEach((task) => task.addEventListener("dragstart", (event) => {
  event.dataTransfer.setData("text/plain", task.getAttribute("data-task"));
  event.target.style.opacity = 0;
}))

taskElements.forEach((task) => task.addEventListener("dragend", (event) => {
  event.target.style.opacity = 1;
  if(event.dataTransfer.dropEffect !== 'none'){
        event.target.remove();
}}))

backlogTasks.addEventListener(`dragstart`, (event) => {
  event.target.classList.add(`selected`);
});

backlogTasks.addEventListener(`dragend`, (event) => {
  event.target.classList.remove(`selected`);
});

backlogTasks.addEventListener(`drop`, (event) => {
  event.preventDefault();
  console.log(event.dataTransfer.getData("text/plain"))
});

backlogTasks.addEventListener(`dragover`, (event) => {
  event.preventDefault();
  const activeElement = backlogTasks.querySelector(`.selected`);
  const currentElement = event.target;
  const nextElement = (currentElement === activeElement.nextElementSibling) ?
      currentElement.nextElementSibling :
      currentElement;
  backlogTasks.insertBefore(activeElement, nextElement);
});

