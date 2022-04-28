const taskList = document.querySelector(".tasklist");

taskList.addEventListener("dragstart", (event) => {
    event.target.classList.add("selected");
    event.target.style.opacity = "0";
    event.dataTransfer.setData("text/html", event.target.innerHTML);
    event.dataTransfer.setData("text/plain", JSON.stringify(window.getComputedStyle(event.target)));

})

taskList.addEventListener("dragend", (event) => {
    event.target.classList.remove("selected");
    event.target.style.opacity = "1";

})

const getNextElement = (cursor, element) => {
    const currentElement = element.getBoundingClientRect();
    const currentElementCenter = currentElement.y + currentElement.height / 2;

    return (cursor < currentElementCenter) ?
        element :
        element.nextElementSibling;
};

taskList.addEventListener("dragover", (event) => {
    event.preventDefault();
    const activeElement = document.querySelector(".selected");
    const currentElement = event.target;
    const isMovable = activeElement !== currentElement && currentElement.classList.contains("backlog_task");

    if (!isMovable) {
        return;
    }

    const nextElement = getNextElement(event.clientY, currentElement);

    if (
        nextElement &&
        activeElement === nextElement.previousElementSibling ||
        activeElement === nextElement
    ) {
        return;
    }

    taskList.insertBefore(activeElement, nextElement);
})


const userTasks = document.querySelectorAll(".task_place")

userTasks.forEach((task) => task.addEventListener("dragleave", (event) => {
    event.target.style.backgroundColor = "";
}))

userTasks.forEach((task) => task.addEventListener("dragenter", (event) => {
    event.preventDefault();
    task.style.backgroundColor = "gray";
}))

userTasks.forEach((task) => task.addEventListener("drop", (event) => {
    event.preventDefault();
    task.style.backgroundColor = "";
    task.innerHTML = event.dataTransfer.getData("text/html");
    let style = JSON.parse(event.dataTransfer.getData("text/plain"));
    task.style.backgroundColor = style["backgroundColor"]
}))


userTasks.forEach((task) => task.addEventListener("dragover", (event) => {
    event.preventDefault();

}))


