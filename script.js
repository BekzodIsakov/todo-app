const newTask = document.getElementById("new-task-input");
const taskTemplate = document.getElementById("task-template");
const addTaskBtn = document.getElementById("add-task");

const tasks = [
  { text: "pump the ball", id: 1 },
  { text: "write an essay on animal testing", id: 2 },
  { text: "cook the dinner", id: 3 },
];

newTask.addEventListener("keypress", (event) => {
  if (!newTask.value) {
    return;
  }

  if (event.key === "Enter") {
    addTask();
  }
});

const addTask = () => {
  const { value } = newTask;

  if (!value) {
    return;
  }

  tasks.push({ text: value, id: Date.now().toString() });
  document.getElementById("new-task-input").value = "";
  renderTasks();
};

addTaskBtn.addEventListener("click", addTask);

const renderTasks = () => {
  console.log(tasks);

  let tasksList = document.getElementById("tasks-list");
  tasksList.innerHTML = null;

  tasks.forEach((task) => {
    const taskTmp = document.importNode(taskTemplate.content, true);
    taskTmp.getElementById("task-content").innerText = task.text;
    tasksList.appendChild(taskTmp);
  });
};

function render() {
  renderTasks();
}

render();
