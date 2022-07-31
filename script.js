const taskTemplate = document.getElementById("task-template");
const editInputTemplate = document.getElementById("edit-input-template");
const newTaskInput = document.getElementById("new-task-input");
const deleteAllBtn = document.getElementById("clearAll-Modal-btn");
const hideCompletedTasksSwitch = document.getElementById(
  "hideCompletedTasksSwitch"
);
const toggleSoundSwitch = document.getElementById("toggeSoundSwitch");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let areCompletedTasksHidden = JSON.parse(
  localStorage.getItem("areCompletedTasksHidden") || false
);
let isSoundOn = JSON.parse(localStorage.getItem("isSoundOn")) ?? true;

const tickSound = new Audio("./assets/audio/done.wav");
const deleteSound = new Audio("./assets/audio/delete.wav");

function init() {
  hideCompletedTasksSwitch.checked = areCompletedTasksHidden;
  hideCompletedTasksSwitch.onclick = handleCompletedTasksVisibility;
  hideCompletedTasksSwitch.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      e.target.checked = !e.target.checked;
      handleCompletedTasksVisibility(e);
    }
  });

  setAppSound(isSoundOn);
  toggleSoundSwitch.checked = isSoundOn;
  toggleSoundSwitch.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      e.target.checked = !e.target.checked;
      switchAppSound(e);
    }
  });

  renderTasks();
}

function renderTasks(editedTaskId) {
  tasks.length > 1
    ? deleteAllBtn.classList.remove("d-none")
    : deleteAllBtn.classList.add("d-none");

  const tasksList = document.getElementById("tasks-list");
  tasksList.innerHTML = null;

  function resolveMouseClick(e) {
    if (!e.target.closest(".input-group")) {
      renderTasks();
    }
  }

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
    editBtn.onclick = (e) => {
      editTask(e, task.id);
    };
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
      if (!task.isCompleted) {
        tasksList.appendChild(taskTmp);
      } else if (!areCompletedTasksHidden) {
        tasksList.appendChild(taskTmp);
      }
    }
  });
}

function saveAndRenderTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function handleCompletedTasksVisibility(e) {
  localStorage.setItem("areCompletedTasksHidden", e.target.checked);
  tickSound.play();
  areCompletedTasksHidden = e.target.checked;
  renderTasks();
}

function setAppSound(isSoundOn) {
  [tickSound, deleteSound].forEach((track) => {
    track.muted = !isSoundOn;
  });
}

function switchAppSound(e) {
  localStorage.setItem("isSoundOn", e.target.checked);
  setAppSound(e.target.checked);
}

const confirmTaskEdit = (currentTaskId) => {
  const editTaskInput = document.getElementById("edit-task-input");

  if (!editTaskInput.value) return;
  const handleTextChange = (taskId, taskText) => {
    if (taskId === currentTaskId && editTaskInput.value !== taskText) {
      tickSound.play();
      return editTaskInput.value;
    }
    return taskText;
  };

  tasks = tasks.map((task) => ({
    ...task,
    text: handleTextChange(task.id, task.text),
  }));

  saveAndRenderTasks();
};

function addTask() {
  const { value } = newTaskInput;

  if (!value) {
    return;
  }

  tasks.push({ id: Date.now().toString(), text: value, isCompleted: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById("new-task-input").value = "";
  renderTasks();
}

newTaskInput.addEventListener("keypress", (event) => {
  if (!newTaskInput.value) {
    return;
  }

  if (event.key === "Enter") {
    addTask();
  }
});

function editTask(e, taskId) {
  e.stopPropagation();
  renderTasks(taskId);
}

function deleteTask(taskId) {
  deleteSound.play();
  tasks = tasks.filter((task) => task.id !== taskId);
  saveAndRenderTasks();
}

function toggleTaskCompletion(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId && !task.isCompleted) {
      tickSound.play();
    }

    return {
      ...task,
      isCompleted:
        task.id === taskId
          ? task.isCompleted
            ? false
            : true
          : task.isCompleted,
    };
  });

  saveAndRenderTasks();
}

const clearAllTasks = () => {
  tasks = [];
  deleteSound.play();
  saveAndRenderTasks();
};

init();
