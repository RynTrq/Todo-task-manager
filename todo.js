const fs = require("fs");
const filePath = "./tasks.json";

const loadTasks = () => {
    try{
        const dataBuffer = fs.readFileSync(filePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    }catch (error) {
        return [];
    }
};

const saveTasks = (tasks) => {
    const dataJSON = JSON.stringify(tasks);
    fs.writeFileSync(filePath, dataJSON);
};

const addTask = (task) => {
    const tasks = loadTasks();
    tasks.push({task});
    saveTasks(tasks);
    console.log("Task successfully added.");
};

const listTasks = () => {
    const tasks = loadTasks();
    tasks.forEach((task, index) => console.log(`Task ${index+1} - ${task.task}`));
};

const removeTask = (t) => {
    const tasks = loadTasks();
    const updatedTasks = tasks.filter(task => task.task !== t);
    saveTasks(updatedTasks);
    console.log("Task successfully removed.");
}

const command = process.argv[2];
const argument = process.argv[3];

if(command === "add") {
    addTask(argument);
}else if(command === "list"){
    listTasks();
}else if (command === "remove"){
    removeTask(argument);
}else {
    console.log("Invalid command!");
}