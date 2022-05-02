import {calendar, months, weekDays} from "./data.js";

class DataGetter {
    static async getData() {
        try {
            let tasks = await fetch("https://varankin_dev.elma365.ru/" +
                "api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks")
            let users = await fetch("https://varankin_dev.elma365.ru/" +
                                        "api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users")
            return [await users.json(), await tasks.json()];
        } catch (error) {
            console.error(error)
        }
    };

    static clearData(data) {
        let [users, tasks] = [...data];
        for (let user of users) {
            delete user.secondName;
        }
        return [users, tasks]
    };


    static async returnData() {
        let data = await this.getData();
        return this.clearData(data);
    };
}


class Navigate {
    static previousButton = document.querySelector(".nav.left");
    static nextButton = document.querySelector(".nav.right");
    static weekRow = document.querySelector(".weekdays");
    static mainTable = document.querySelector(".main_table");
    static year = 2022;
    static monthNumber = 4;
    static monthName = document.querySelector(".navigate__month h2");
    static monthDay = 1;
    static tableComplete = false;
    static monthChanged = false;

    static addLogic() {
        this.previousButton.addEventListener("click", this.previous);
        this.nextButton.addEventListener("click", this.next);
    }

    static previous() {
        Navigate.buildWeek(this.classList[1]);
    };

    static next() {
        Navigate.buildWeek(this.classList[1]);
    };

    static buildWeek(direction) {
        if (direction === "add_task" ) {
            this.monthDay = this.weekRow.children[1].querySelector("p").innerText;
            if (this.monthName.innerText.includes("/")) {
                this.monthNumber--;
            }
        }
        if (this.tableComplete) {
            Navigate.weekRow.innerHTML = "";
            Navigate.mainTable.innerHTML = "";
        }
        let monthDate = new Date(this.year, this.monthNumber, 0);
        let daysInMonth = monthDate.getDate();

        if (direction === "left") {
            this.monthDay -= 14;
            if (this.monthDay <= 0) {
                this.monthNumber -=1;
                let newMonth = new Date(this.year, this.monthNumber, 0);
                daysInMonth = newMonth.getDate();
                this.monthDay += daysInMonth;
                this.monthChanged = true;
            }
        }

        if (this.monthNumber < 1 || this.monthNumber > 12) {
                    let container = document.querySelector(".container");
                    let yearEnd = document.createElement("h1");
                    container.remove();
                    let cheatBlock = document.querySelector(".cheat_block");
                    cheatBlock.style.backgroundColor = "white";
                    cheatBlock.style.textAlign = "center";
                    yearEnd.innerText = "Demo is over! :)";
                    yearEnd.style.marginTop = "50px";
                    cheatBlock.appendChild(yearEnd);
                    return;
                }
        this.monthName.innerText = calendar[this.monthNumber]["monthName"];
        let empty = document.createElement("div");
        empty.className = "weekdays__empty";
        this.weekRow.appendChild(empty);
        for (let day in weekDays) {
            let weekNode = document.createElement("div");
            let dayNumber = document.createElement("p");
            let weekDay = document.createElement("p");
            let dateMeta = `${this.year}-${String(this.monthNumber).padStart(2, "0")}-${String(this.monthDay).padStart(2, "0")}`;
            weekNode.className = "weekday";
            weekNode.setAttribute("data-date", dateMeta)
            dayNumber.innerText = this.monthDay;
            let dayName = new Date(weekNode.getAttribute("data-date")).getDate();
            weekDay.innerText = calendar[this.monthNumber][dayName]["weekDay"];
            weekNode.appendChild(dayNumber);
            weekNode.appendChild(weekDay);
            this.weekRow.appendChild(weekNode);
            this.monthDay++;

            if (this.monthDay > daysInMonth) {
                this.monthDay = 1;
                this.monthNumber++;
                this.monthName.innerText += `/${calendar[this.monthNumber]["monthName"]}`
                this.monthChanged = true;
            }
        }

        if (this.tableComplete === true) {
                Builder.buildTable();
                Builder.addLogic();
            }

            this.tableComplete = true;
    };
}


class Builder {
    static scheduler = document;
    static users;
    static tasks;
    static weekRow = document.querySelector(".weekdays");

    static fillCalendar() {
        for (let month in calendar) {
            for (let day in calendar[month]) {
                let date = new Date(2022, month - 1, day);
                calendar[month][day]["weekDay"] = weekDays[date.getDay()];
                for (let user of this.users) {
                    calendar[month][day][user.id] = [];
                }

            }
            calendar[month]["monthName"] = months[month];
        }
    }


    static buildTable() {
        let dayAmount = document.querySelector(".weekdays").childElementCount - 1;
        let mainTable = this.scheduler.querySelector(".main_table");
        for (let user of this.users) {
            let taskRow = this.scheduler.createElement("div");
            let userRow = this.scheduler.createElement("div");
            userRow.addEventListener("dragover", (event) => {
                event.preventDefault();
                event.target.style.backgroundColor = "#649c7c";
            })
            userRow.addEventListener("dragleave", (event) => {
                event.preventDefault();
                event.target.style.backgroundColor = "";
            })
            userRow.addEventListener("drop", (event) => {
                event.preventDefault();
                let taskData = JSON.parse(event.dataTransfer.getData("text/plain"));
                let taskId = event.dataTransfer.getData("id");
                let taskToDelete = document.getElementById(taskId);
                this.tasks[taskData.id - 1].executor = JSON.parse(event.target.getAttribute("data-user")).id;
                this.tasks[taskData.id - 1].planStartDate = taskData.planStartDate;
                event.target.style.backgroundColor = "";
                this.tasks.push(taskData);
                taskToDelete.remove();
                Navigate.buildWeek("add_task")
            })
            userRow.className = "employee";
            taskRow.className = "user_tasks";
            userRow.innerText = user.firstName + " " + user.surname;
            userRow.style.padding ="20px";
            userRow.setAttribute("data-user", JSON.stringify(user))
            taskRow.appendChild(userRow);

            for (let column = 0;column < dayAmount;column++) {
                let userTask = this.scheduler.createElement("div");
                userTask.className = "task_place";
                taskRow.appendChild(userTask);
            }
            this.assignTasks(userRow, taskRow);
            mainTable.appendChild(taskRow);
        }
    }

    static buildBacklog() {
        let backlog = this.scheduler.querySelector(".backlog__tasks");
        let task_id = 1;

        for (let task of this.tasks) {
            if (!task.executor) {
                let backTaskColumn = document.createElement("div");
                backTaskColumn.className = "backlog__task_column";
                backTaskColumn.innerHTML = `<strong>${task.subject}</strong>${task.description}`;
                backTaskColumn.id = task_id;
                backTaskColumn.setAttribute("data-task", JSON.stringify(task))
                backlog.appendChild(backTaskColumn);
                task_id++;
            }
        }
    }

    static addLogic() {
        let tasks = document.querySelectorAll(".task_place");

        tasks.forEach((task) => task.addEventListener("dragover", (event) => {
            event.preventDefault();
            event.target.style.backgroundColor = "rgba(192,255,252,0.30)";
        }));

        tasks.forEach((task) => task.addEventListener("dragleave", (event) => {
            event.preventDefault();
            event.target.style.backgroundColor = "";
        }));

        tasks.forEach((task) => task.addEventListener("drop", (event) => {
            event.preventDefault();
            let assignedTask = event.target;
            assignedTask.style.backgroundColor = "";
            let taskData = JSON.parse(event.dataTransfer.getData("text/plain"));
            let newTask = document.createElement("div");
            let executor = JSON.parse(assignedTask.parentNode.firstChild.getAttribute("data-user"));
            let dayIndex = Array.from(assignedTask.parentNode.children).indexOf(assignedTask);
            let monthDay = Array.from(document.querySelector(".weekdays").children)[dayIndex];
            let date = monthDay.getAttribute("data-date");
            let taskText = document.createElement("p");
            let popup = document.createElement("div");
            let taskId = event.dataTransfer.getData("id");
            let taskToDelete = document.getElementById(taskId);
            taskToDelete.remove();
            this.tasks[taskData.id - 1].executor = executor.id;
            this.tasks[taskData.id - 1].planStartDate = date;
            popup.className = "popup";
            popup.innerText = taskData.description
            newTask.setAttribute("data-task", JSON.stringify(taskData));
            newTask.classList.add("assigned");
            newTask.appendChild(taskText);
            newTask.appendChild(popup);
            newTask.querySelector("p").innerText = taskData.subject;
            assignedTask.appendChild(newTask);
        }));

    }

    static simplify () {
        this.tasks.forEach((task) => task.description = "Some description");
        let id = 1;
        for (let task of this.tasks) {
            task.id = id;
            id++;
            delete task.status;
            delete task.creationAuthor;
            delete task.order;
            delete task.planEndDate;
            delete task.endDate;
            delete task.creationDate;
        }
    }

    static async build() {
        [this.users, this.tasks] = await DataGetter.returnData();

        this.simplify();
        this.fillCalendar();
        Navigate.buildWeek();
        Navigate.addLogic();
        this.buildTable();
        this.buildBacklog();
        this.addSctipt();
        this.addLogic();

    }

    static addSctipt () {
        let loadScript = document.createElement("script");
        loadScript.className = "dragndrop"
        loadScript.src = "./scripts./dragndrop.js";
        document.getElementsByTagName("head")[0].appendChild(loadScript);
    }

    static assignTasks(user, row) {
        let userData = JSON.parse(user.getAttribute("data-user"));
        this.tasks.forEach((task) => {
            let dayNumber = 0;
            if (userData.id === task.executor) {
                let taskDay = new Date(task.planStartDate)
                for (let day of this.weekRow.children) {
                    if (task.planStartDate === day.getAttribute("data-date")) {
                        while ((day = day.previousSibling) != null)
                            dayNumber++;
                        let assignedBlock = row.children[dayNumber];
                        let assignedTask = document.createElement("div");
                        let popup = document.createElement("div");
                        assignedTask.innerText = task.subject;
                        assignedTask.classList.add("assigned");
                        popup.className = "popup";
                        popup.innerText = task.description
                        assignedTask.appendChild(popup);
                        assignedBlock.appendChild(assignedTask)
                    }
                }
                let month = taskDay.getMonth();
                let day = taskDay.getDate();
                for (let taskId of calendar[month + 1][day][userData.id]) {
                    if (taskId.id === task.id) {
                        return;
                    }
                }
                calendar[month + 1][day][userData.id].push(task);
            }
        })
    }
}

async function addForm() {
    let form = document.createElement("form");
    let name = document.createElement("input");
    let send = document.createElement("input");
    let description = document.createElement("textarea");
    let users = document.createElement("select");
    let usersDefaultOption = document.createElement("option");
    let startDate = document.createElement("input");

    form.className = "backlog__new_task_form";
    name.type = "text";
    name.placeholder = "Task subject:";
    name.name = "subject";
    send.className = "createTask";
    send.type = "submit";
    form.addEventListener("submit", addTask)
    send.value = "Create";
    description.name = "description";
    description.placeholder = "Describe your task here:";
    description.style.resize = "none";
    startDate.name = "planStartDate"
    startDate.type = "date";
    startDate.min = "2022-01-01";
    startDate.max = "2022-12-31";
    let today = new Date();
    //Sorry for that
    startDate.defaultValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    usersDefaultOption.innerText = "(optional) Assign task to: ";
    usersDefaultOption.selected = true;
    usersDefaultOption.disabled = true;
    users.appendChild(usersDefaultOption);

    for (let user of await Builder.users) {
        let userOption = document.createElement("option");
        userOption.innerText = `${user.firstName} ${user.surname}`;
        userOption.setAttribute("user-id", user.id);
        users.appendChild(userOption);
    }

    form.appendChild(name);
    form.appendChild(description);
    form.appendChild(users);
    form.appendChild(startDate);
    form.appendChild(send);

    let backlog = document.querySelector(".backlog__new_task");
    backlog.appendChild(form);
}

function addTask (event) {
    event.preventDefault();
    let newTask = document.querySelector(".backlog__new_task_form");
    let executor = newTask.querySelector("select").selectedIndex === 0 ?
          null : newTask.querySelector("select").selectedIndex;
    let formData = new FormData(event.target);
    let tasks = document.querySelector(".backlog__tasks");
    let newTaskIndex = tasks.children.length + 1;
    let lastTask = tasks.lastChild;
    let taskIndex = JSON.parse(lastTask.getAttribute("data-task")).id + 1;
    let newBacklogTask = document.createElement("div");
    let taskData = {
        "id": taskIndex,
        "subject": formData.get("subject"),
        "description": formData.get("description"),
        "executor": executor,
        "planStartDate": formData.get("planStartDate")
    };

    if (taskData.executor) {
        Builder.tasks.push(taskData);
        console.log(taskData)
        Navigate.buildWeek("add_task");
        event.target.remove();
    } else {
        newBacklogTask.className = "backlog__task_column";
        newBacklogTask.innerHTML = `<strong>${formData.get("subject")}</strong>${formData.get("description")}`;
        newBacklogTask.id = newTaskIndex;
        newBacklogTask.setAttribute("data-task", JSON.stringify(taskData));
        tasks.appendChild(newBacklogTask);
        event.target.remove();
        let script = document.querySelector(".dragndrop");
        Builder.tasks.push(taskData);
        script.remove();
        Builder.addSctipt();
    }
}

function search() {
    let input = document.querySelector(".backlog__search input").value.toLowerCase();
    let tasks = document.querySelectorAll(".backlog__task_column");

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i]
        if (!task.innerHTML.toLowerCase().includes(input)) {
            task.style.display = "none";
        } else {
            task.style.display = "flex";
        }
    }
}

let searchInput = document.querySelector(".backlog__search input");
searchInput.addEventListener("keyup", search)
let addButton = document.querySelector(".backlog__new_button");
addButton.addEventListener("click", addForm);
Builder.build();


