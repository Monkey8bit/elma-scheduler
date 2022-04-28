import {months, weekDays, calendar} from "./data.js";

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


class Builder {
    static scheduler = document;
    static users;
    static tasks;
    static year = 2022;

    static async build() {
        [this.users, this.tasks] = await DataGetter.returnData();
        let week = document.querySelector(".weekdays");
        let mainTable = this.scheduler.querySelector(".main_table");
        let backlog = this.scheduler.querySelector(".backlog__tasks");
        let tasksTable = document.querySelector(".wrapper");
        let num = 0;

        for (let month in calendar) {
            for (let day in calendar[month]) {
                let date = new Date(2022, month, day)
                calendar[month][day]["weekDay"] = weekDays[date.getDay()];
                for (let user of this.users) {
                    calendar[month][day][user.id] = {};
                }
            }
        }

        let empty = document.createElement("div");
        empty.className = "weekdays__empty";
        week.appendChild(empty)
        let monthDay = 1;

        for (let day in weekDays) {
            let weekNode = document.createElement("div");
            let dayNumber = document.createElement("p");
            let weekDay = document.createElement("p");
            let date = new Date(this.year, 3, monthDay);
            weekNode.className = "weekday";
            dayNumber.innerText = parseInt(day) + 1;
            weekDay.innerText = weekDays[date.getDay()];
            weekNode.appendChild(dayNumber);
            weekNode.appendChild(weekDay);
            week.appendChild(weekNode);
            monthDay++;
        }

        for (let user of this.users) {
            let taskRow = this.scheduler.createElement("div");
            let userRow = this.scheduler.createElement("div");
            userRow.className = "employee";
            taskRow.className = "user_tasks";
            userRow.innerText = user.firstName + " " + user.surname;
            userRow.setAttribute("data-user", JSON.stringify(user))
            this.assignTask(userRow);
            taskRow.appendChild(userRow);

            for (let column = 0;column < 7;column++) {
                let taskText = this.scheduler.createElement("p");
                taskText.innerText = `task_${num}`
                let userTask = this.scheduler.createElement("div");
                userTask.className = "task_place";
                userTask.appendChild(taskText)
                taskRow.appendChild(userTask);
                num ++;
            }
            mainTable.appendChild(taskRow);
        }

        for (let task of this.tasks) {
            task.description = "Some description";
            let backTaskColumn = document.createElement("div");
            let backTask = document.createElement("p");
            let backTaskText = document.createElement("p");
            backTaskColumn.className = "backlog__task_column";
            backTask.className = "backlog__task";
            backTask.innerText = task.subject;
            backTaskText.innerText = task.description;
            backTaskColumn.setAttribute("data-task", JSON.stringify(task))
            backTaskColumn.appendChild(backTask);
            backTaskColumn.appendChild(backTaskText);
            backlog.appendChild(backTaskColumn);
        }

    }

    static assignTask(user) {
        let userData = JSON.parse(user.getAttribute("data-user"));
        this.tasks.forEach((task) => {
            if (userData.id === task.executor) {
                user.style.backgroundColor = "gray";
            }
        })
    }
}


Builder.build()
