// Select DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Load tasks from Local Storage
document.addEventListener('DOMContentLoaded', loadTasks);

// Add a new task
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();

    if (taskText) {
        addTask(taskText);
        saveTaskToLocalStorage(taskText);
        todoInput.value = ''; // Clear input field
    }
});

// Add a task to the DOM
function addTask(taskText, completed = false) {
    const li = document.createElement('li');
    li.textContent = taskText;

    if (completed) {
        li.classList.add('completed');
    }

    // Add "Complete" and "Delete" buttons
    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        toggleTaskInLocalStorage(taskText);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete');
    deleteBtn.addEventListener('click', () => {
        li.remove();
        removeTaskFromLocalStorage(taskText);
    });

    li.appendChild(deleteBtn);
    todoList.appendChild(li);
}

// Load tasks from Local Storage and display them
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTask(task.text, task.completed));
}

// Save a task to Local Storage
function saveTaskToLocalStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove a task from Local Storage
function removeTaskFromLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Toggle task completion in Local Storage
function toggleTaskInLocalStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.text === taskText);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}
