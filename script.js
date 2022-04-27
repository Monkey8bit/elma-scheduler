class DataGetter {
    constructor(data) {
        this.data = data;
    }

    async getData() {
        try {
            const response = await fetch("https://varankin_dev.elma365.ru/" +
                                        "api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users")
            return await response.json();
        } catch (error) {
            console.error(error)
        }
    }

    clearData(data) {
        for (let user of data) {
            delete user.secondName
            console.log(user)
        }
    }


    async printData() {
        const data = await this.getData();
        this.clearData(data)
        
    }
}



// async function getData() {
//     try {
//         const response = await fetch("https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users")
//         const test = await response.json();
//         return test;
//     } catch (error) {
//         console.error(error)
//     }
// }


// async function printData() {
//     const block = document.getElementsByClassName("test")[0];
//     const table = document.createElement("table");
//     block.appendChild(table);
//     let id = document.createElement("th");
//     let username = document.createElement("th");
//     let name = document.createElement("th");
//     let surname = document.createElement("th");
//     id.innerText = "id";
//     username.innerText = "Username";
//     name.innerText = "Name";
//     surname.innerText = "Surname";
//     table.appendChild(id);
//     table.appendChild(username);
//     table.appendChild(name);
//     table.appendChild(surname);
//     let users = await getData()

//     for (let user of users) {
//         delete user.secondName
//     }

//     for (let user of users) {
//         let row = document.createElement("tr");
//         let id = document.createElement("td");
//         let username = document.createElement("td");
//         let name = document.createElement("td");
//         let surname = document.createElement("td");
//         id.innerText = user.id
//         username.innerText = user.username
//         name.innerText = user.firstName
//         surname.innerText = user.surname
//         row.append(id, username, name, surname)
//         table.appendChild(row)
//     }

// }


// printData()


var a = new DataGetter();
a.printData()