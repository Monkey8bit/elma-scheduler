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
                this.monthDay = daysInMonth + this.monthDay;
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
            userRow.className = "employee";
            taskRow.className = "user_tasks";
            userRow.innerText = user.firstName + " " + user.surname;
            userRow.style.padding ="20px";
            userRow.setAttribute("data-user", JSON.stringify(user))
            taskRow.appendChild(userRow);

            for (let column = 0;column < dayAmount;column++) {
                let taskText = this.scheduler.createElement("p");
                let userTask = this.scheduler.createElement("div");
                userTask.className = "task_place";
                userTask.appendChild(taskText)
                taskRow.appendChild(userTask);
            }
            this.assignTasks(userRow, taskRow);
            mainTable.appendChild(taskRow);
        }
    }

    static buildBacklog() {
        let backlog = this.scheduler.querySelector(".backlog__tasks");
        for (let task of this.tasks) {
            if (!task.executor) {
                task.description = "Some description";
                let backTaskColumn = document.createElement("div");
                backTaskColumn.className = "backlog__task_column";
                backTaskColumn.innerHTML = `<strong>${task.subject}</strong>${task.description}`;
                backTaskColumn.setAttribute("data-task", JSON.stringify(task))
                backlog.appendChild(backTaskColumn);
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
            let executor = JSON.parse(assignedTask.parentNode.firstChild.getAttribute("data-user"));
            let dayIndex = Array.from(assignedTask.parentNode.children).indexOf(assignedTask);
            let monthDay = Array.from(document.querySelector(".weekdays").children)[dayIndex];
            let date = monthDay.getAttribute("data-date");
            this.tasks[taskData.id - 1].executor = executor.id;
            this.tasks[taskData.id - 1].planStartDate = date;
            assignedTask.setAttribute("data-task", JSON.stringify(taskData));
            assignedTask.classList.add("assigned");
            assignedTask.querySelector("p").innerText = taskData.subject;
            console.log(this.tasks);
        }));

    }

    static simplify () {
        let id = 1;
        for (let task of this.tasks) {
            task.id = id;
            id++;
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
        let loadScript = document.createElement("script");
        loadScript.src = "./dragndrop.js";
        document.getElementsByTagName("head")[0].appendChild(loadScript);
        this.addLogic();

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
                        let assignedTask = row.children[dayNumber];
                        let assignedTaskText = assignedTask.querySelector("p");
                        assignedTaskText.innerText = task.subject;
                        assignedTask.classList.add("assigned");
                    }
                }
                let month = taskDay.getMonth();
                let day = taskDay.getDate();
                calendar[month + 1][day][userData.id].push(task);
            }
        })
    }
}


Builder.build()
