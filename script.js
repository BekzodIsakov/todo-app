const taskTemplate = document.getElementById("task-template");
const editInputTemplate = document.getElementById("edit-input-template");
const newTaskInput = document.getElementById("new-task-input");
const addTaskBtn = document.getElementById("add-task");
const deleteAllBtn = document.getElementById("clearAll-Modal-btn");
const confirmDeleteAllBtn = document.getElementById("confirm-delete-all-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const renderTasks = (editedTaskId) => {
  tasks.length > 1
    ? deleteAllBtn.classList.remove("d-none")
    : deleteAllBtn.classList.add("d-none");

  const tasksList = document.getElementById("tasks-list");
  tasksList.innerHTML = null;

  const resolveMouseClick = (e) => {
    if (!e.target.closest(".input-group")) {
      renderTasks();
    }
  };

  window.removeEventListener("click", resolveMouseClick);

  tasks.forEach((task) => {
    const taskTmp = document.importNode(taskTemplate.content, true);
    const taskItem = taskTmp.getElementById("task-item");
    const taskText = taskTmp.getElementById("task-content");
    const completeBtn = taskTmp.getElementById("complete-task-btn");
    const editBtn = taskTmp.getElementById("edit-task-btn");
    const deleteBtn = taskTmp.getElementById("delete-task-btn");
    const checkedIcon = completeBtn.firstElementChild;

    taskText.innerText = task.text;
    taskItem.dataset.taskId = task.id;

    completeBtn.onclick = () => toggleTaskCompletion(task.id);
    editBtn.onclick = (e) => editTask(e, task.id);
    deleteBtn.onclick = () => deleteTask(task.id);

    if (task.isCompleted) {
      taskText.classList.add("text-decoration-line-through", "text-black-50");
      checkedIcon.classList.remove("bi-check-circle");
      checkedIcon.classList.add("bi-check-circle-fill");
    }

    const inputTmp = document.importNode(editInputTemplate.content, true);
    const input = inputTmp.getElementById("edit-task-input");
    const confirmEditBtn = inputTmp.getElementById("confirm-edit-btn");

    if (editedTaskId === task.id) {
      input.value = task.text;
      input.onkeydown = (e) => {
        if (e.code == "Enter") {
          confirmTaskEdit(task.id);
        }
      };
      tasksList.appendChild(inputTmp);
      input.focus();
      confirmEditBtn.onclick = () => confirmTaskEdit(task.id);

      window.addEventListener("click", resolveMouseClick);
    } else {
      tasksList.appendChild(taskTmp);
    }
  });
};

const confirmTaskEdit = (taskId) => {
  const editTaskInput = document.getElementById("edit-task-input");

  if (!editTaskInput.value) return;

  tasks = tasks.map((task) => ({
    ...task,
    text: task.id === taskId ? editTaskInput.value : task.text,
  }));

  saveTasks();
  renderTasks();
};

function render() {
  renderTasks();
}

const addTask = () => {
  const { value } = newTaskInput;

  if (!value) {
    return;
  }

  tasks.push({ id: Date.now().toString(), text: value, isCompleted: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById("new-task-input").value = "";
  renderTasks();
};

newTaskInput.addEventListener("keypress", (event) => {
  if (!newTaskInput.value) {
    return;
  }

  if (event.key === "Enter") {
    addTask();
  }
});

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const editTask = (e, taskId) => {
  e.stopPropagation();
  renderTasks(taskId);
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

addTaskBtn.addEventListener("click", addTask);

const clearAllTasks = () => {
  tasks = [];
  saveTasks();
  renderTasks();
};

confirmDeleteAllBtn.onclick = clearAllTasks;

render();
