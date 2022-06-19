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

const toggleTaskCompletion = (taskId) => {
  tasks = tasks.map((task) => ({
    ...task,
    isCompleted:
      task.id === taskId ? (task.isCompleted ? false : true) : task.isCompleted,
  }));

  saveTasks();
  renderTasks();
};

const addTask = () => {
  const { value } = newTask;

  if (!value) {
    return;
  }

  tasks.push({ id: Date.now().toString(), text: value, isCompleted: true });
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
    const checkedIcon = taskTmp.getElementById("checked-icon");
    const taskText = taskTmp.getElementById("task-content");
    taskText.innerText = task.text;

    if (task.isCompleted) {
      taskText.classList.add("text-decoration-line-through", "text-black-50");
      checkedIcon.classList.remove("bi-check-circle");
      checkedIcon.classList.add("bi-check-circle-fill");
    }

    checkedIcon.parentNode.onclick = () => toggleTaskCompletion(task.id);

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
