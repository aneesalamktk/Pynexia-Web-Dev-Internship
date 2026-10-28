// Get the elements we need from the HTML page.
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');
const taskFilter = document.getElementById('task-filter');
const submitButton = document.getElementById('submit-button');
const formHeading = document.getElementById('form-heading');
const cancelEditButton = document.getElementById('cancel-edit');

const totalCount = document.getElementById('total-count');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');

// Load saved tasks when the page opens.
let tasks = JSON.parse(localStorage.getItem('pynexiTasks')) || [];
let editingTaskId = null;

// Save the current task list in the browser.
function saveTasks() {
    localStorage.setItem('pynexiTasks', JSON.stringify(tasks));
}

// Update the task counts at the top.
function updateCounts() {
    totalCount.textContent = tasks.length;
    completedCount.textContent = tasks.filter(task => task.completed).length;
    pendingCount.textContent = tasks.filter(task => !task.completed).length;
}

// Show tasks on the page.
function displayTasks() {
    taskList.innerHTML = '';

    const filter = taskFilter.value;
    const visibleTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    visibleTasks.forEach(task => {
        const item = document.createElement('li');
        item.className = 'task-item';

        if (task.completed) {
            item.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', `Mark ${task.name} as completed`);
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const name = document.createElement('span');
        name.className = 'task-name';
        // textContent displays user input as text rather than HTML.
        name.textContent = task.name;

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'action-button';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => startEditing(task.id));

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'action-button delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        actions.append(editButton, deleteButton);
        item.append(checkbox, name, actions);
        taskList.appendChild(item);
    });

    emptyMessage.classList.toggle('hidden', visibleTasks.length > 0);
    emptyMessage.textContent = tasks.length === 0
        ? 'No tasks yet. Add your first task above!'
        : 'No tasks match this filter.';
    updateCounts();
}

// Add a task or save changes to an existing task.
taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = taskInput.value.trim();

    if (name === '') {
        taskInput.focus();
        return;
    }

    if (editingTaskId !== null) {
        const task = tasks.find(task => task.id === editingTaskId);

        if (task) {
            task.name = name;
        }
    } else {
        const newTask = {
            id: Date.now(),
            name: name,
            completed: false
        };

        tasks.push(newTask);
    }

    saveTasks();
    displayTasks();
    resetForm();
});

// Start editing a task by putting its name in the input.
function startEditing(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) return;

    editingTaskId = id;
    taskInput.value = task.name;
    formHeading.textContent = 'Edit task';
    submitButton.textContent = 'Save changes';
    cancelEditButton.classList.remove('hidden');
    taskInput.focus();
}

// Return the form to add-task mode.
function resetForm() {
    editingTaskId = null;
    taskForm.reset();
    formHeading.textContent = 'Add a new task';
    submitButton.textContent = 'Add task';
    cancelEditButton.classList.add('hidden');
}

// Mark a task as complete or pending.
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

// Delete a task.
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    if (editingTaskId === id) {
        resetForm();
    }

    saveTasks();
    displayTasks();
}

// Cancel editing without changing the task.
cancelEditButton.addEventListener('click', resetForm);

// Update the displayed list when the filter changes.
taskFilter.addEventListener('change', displayTasks);

// Display saved tasks when the page first loads.
displayTasks();
