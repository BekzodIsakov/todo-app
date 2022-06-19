const newTask = document.getElementById("new-task-input");
const taskTemplate = document.getElementById("task-template");
const addTaskBtn = document.getElementById("add-task");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

newTask.addEventListener("keypress", (event) => {
  if (!newTask.value) {
    return;
  }

  if (event.key === "Enter") {
    addTask();
  }
});

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const deleteTask = (taskId) => {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
};

const addTask = () => {
  const { value } = newTask;

  if (!value) {
    return;
  }

  tasks.push({ id: Date.now().toString(), text: value, isCompleted: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById("new-task-input").value = "";
  renderTasks();
};

addTaskBtn.addEventListener("click", addTask);

const renderTasks = () => {
  const tasksList = document.getElementById("tasks-list");
  tasksList.innerHTML = null;

  tasks.forEach((task) => {
    const taskTmp = document.importNode(taskTemplate.content, true);
    taskTmp.getElementById("task-content").innerText = task.text;
    taskTmp.getElementById("task-item").dataset.taskid = task.id;
    taskTmp
      .getElementById("delete-task-btn")
      .addEventListener("click", () => deleteTask(task.id));
    tasksList.appendChild(taskTmp);
  });
};

function render() {
  renderTasks();
}

render();
