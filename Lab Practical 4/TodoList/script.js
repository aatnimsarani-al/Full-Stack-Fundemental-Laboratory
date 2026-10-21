const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const errorMsg = document.getElementById('errorMsg');
const emptyState = document.getElementById('emptyState');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter');
        renderTasks();
    });
});

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        showError("Task cannot be empty or contain only spaces.");
        return;
    }

    hideError();

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    saveAndRender();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
}

function hideError() {
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
}

function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (tasks.length === 0) {
        emptyState.textContent = "No tasks yet. Add your first task!";
        emptyState.style.display = 'block';
    } else if (filteredTasks.length === 0) {
        emptyState.textContent = "No tasks match this filter.";
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center py-3 px-3 border-start-0 border-end-0';

        li.innerHTML = `
            <div class="form-check d-flex align-items-center gap-2">
                <input class="form-check-input task-checkbox mt-0" type="checkbox" ${task.completed ? 'checked' : ''} id="task-${task.id}">
                <label class="form-check-label ${task.completed ? 'completed-task' : ''}" for="task-${task.id}">
                    ${escapeHTML(task.text)}
                </label>
            </div>
            <button class="btn btn-danger btn-sm delete-btn px-3">Delete</button>
        `;

        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(li);
    });

    const remainingCount = tasks.filter(task => !task.completed).length;
    taskCounter.textContent = `${remainingCount} remaining`;
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

renderTasks();