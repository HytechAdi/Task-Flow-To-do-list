```javascript
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

const totalCount = document.getElementById("total-count");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");

const emptyState = document.getElementById("empty-state");
const errorMessage = document.getElementById("error-message");
const clearCompletedBtn = document.getElementById("clear-completed");
const currentDate = document.getElementById("current-date");

// Store tasks while the page is open.
let tasks = [];
let nextTaskId = 1;

// Display today's date.
currentDate.textContent = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
}).format(new Date());

// Add a new task.
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        errorMessage.textContent = "Please enter a task first.";
        taskInput.focus();
        return;
    }

    const newTask = {
        id: nextTaskId++,
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = "";
    errorMessage.textContent = "";

    renderTasks();
    taskInput.focus();
});

// Handle completing and deleting tasks using event delegation.
taskList.addEventListener("click", function (event) {
    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    const taskId = Number(taskItem.dataset.id);

    // Mark task as complete or incomplete.
    if (event.target.classList.contains("complete-checkbox")) {
        const task = tasks.find(function (item) {
            return item.id === taskId;
        });

        if (task) {
            task.completed = event.target.checked;
            renderTasks();
        }
    }

    // Delete a task.
    if (event.target.closest(".delete-btn")) {
        tasks = tasks.filter(function (item) {
            return item.id !== taskId;
        });

        renderTasks();
    }
});

// Remove all completed tasks.
clearCompletedBtn.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    renderTasks();
});

// Update the list and statistics.
function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(function (task) {
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }

        listItem.dataset.id = task.id;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "complete-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task as complete");

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", "Delete task");

        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const pendingTasks = tasks.length - completedTasks;

    totalCount.textContent = tasks.length;
    completedCount.textContent = completedTasks;
    pendingCount.textContent = pendingTasks;

    emptyState.hidden = tasks.length > 0;
}

// Initial UI setup.
renderTasks();
```
