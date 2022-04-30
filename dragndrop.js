
//
// taskList.addEventListener("dragover", (event) => {
//     event.preventDefault();
//     const activeElement = document.querySelector(".selected");
//     const currentElement = event.target;
//     const isMovable = activeElement !== currentElement && currentElement.classList.contains("backlog_task");
//
//     if (!isMovable) {
//         return;
//     }
//
//     const nextElement = getNextElement(event.clientY, currentElement);
//
//     if (
//         nextElement &&
//         activeElement === nextElement.previousElementSibling ||
//         activeElement === nextElement
//     ) {
//         return;
//     }
//
//     taskList.insertBefore(activeElement, nextElement);
// })


// const backlogTasks = document.querySelectorAll(".backlog__task_column");
// const backlogList = document.querySelector(".backlog__tasks");
//
// backlogTasks.forEach((task) => task.draggable = "true")
//
//
// backlogTasks.forEach((task) => task.addEventListener("dragstart", (event) => {
//     setTimeout(() => {
//         console.log(event.target)
//         event.target.classList.add("selected");
//         event.target.style.display = "none";
//         event.dataTransfer.setData("text/html", event.target.innerHTML);
//         event.dataTransfer.setData("text/plain", JSON.stringify(window.getComputedStyle(event.target)))
//     }, 100)
// }))
//
// backlogTasks.forEach((task) => task.addEventListener("dragend", (event) => {
//     event.target.style.display = "block";
//     event.target.style.opacity = "1";
//     event.target.classList.remove("selected");
// }))
//
// backlogTasks.forEach((task) => task.addEventListener("dragleave", (event) => {
//     event.target.classList.remove("over");
// }))
//
// backlogTasks.forEach((task) => task.addEventListener("dragover", (event) => {
//     event.preventDefault()
//     event.target.classList.add("over");
// }))
//
// backlogList.addEventListener("drop", (event) => {
//     event.preventDefault()
//     let element = event.target;
//     console.log(element)
//     let index = Array.prototype.indexOf.call(backlogList.children, element);
//     backlogList.insertAfter(element, backlogList.children[index])
// })

// const userTasks = document.querySelectorAll(".task_place")
// console.log(userTasks)


// userTasks.forEach((task) => task.addEventListener("dragleave", (event) => {
//     event.target.style.backgroundColor = "";
// }))
//
// userTasks.forEach((task) => task.addEventListener("dragenter", (event) => {
//     event.preventDefault();
//     task.style.backgroundColor = "gray";
// }))
//
// userTasks.forEach((task) => task.addEventListener("drop", (event) => {
//     event.preventDefault();
//     task.style.backgroundColor = "";
//     task.innerHTML = event.dataTransfer.getData("text/html");
//     let style = JSON.parse(event.dataTransfer.getData("text/plain"));
//     task.style.backgroundColor = style["backgroundColor"]
// }))
//
//
// userTasks.forEach((task) => task.addEventListener("dragover", (event) => {
//     event.preventDefault();
//
// }))

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

