class Task {
    constructor(id, name, description, priority, dueDate, completed = false) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = completed;
    }
}

class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.currentSort = 'priority';

        this.taskList = document.getElementById('taskList');
        this.addTaskBtn = document.getElementById('addTask');
        this.filterBtns = document.querySelectorAll('.filters button');
        this.sortSelect = document.getElementById('sortBy');

        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.filterBtns.forEach(btn => btn.addEventListener('click', (e) => this.setFilter(e)));
        this.sortSelect.addEventListener('change', () => this.sortTasks());

        this.renderTasks();
    }

    addTask() {
        const name = document.getElementById('taskName').value;
        const description = document.getElementById('taskDescription').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (name.trim() === '') return;

        const newTask = new Task(Date.now(), name, description, priority, dueDate);
        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
        this.clearInputs();
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        const filteredTasks = this.getFilteredTasks();
        const sortedTasks = this.getSortedTasks(filteredTasks);

        sortedTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority}${task.completed ? ' completed' : ''}`;
        li.innerHTML = `
            <div class="task-info">
                <h3>${task.name}</h3>
                <p>${task.description}</p>
                <p>Due: ${task.dueDate}</p>
            </div>
            <div class="task-actions">
                <button class="complete-btn"><i class="fas fa-check"></i></button>
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;

        const completeBtn = li.querySelector('.complete-btn');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        completeBtn.addEventListener('click', () => this.toggleComplete(task));
        editBtn.addEventListener('click', () => this.editTask(task));
        deleteBtn.addEventListener('click', () => this.deleteTask(task));

        return li;
    }

    toggleComplete(task) {
        task.completed = !task.completed;
        this.saveTasks();
        this.renderTasks();
    }

    editTask(task) {
        const newName = prompt('Edit task name:', task.name);
        const newDescription = prompt('Edit task description:', task.description);
        const newPriority = prompt('Edit task priority (low/medium/high):', task.priority);
        const newDueDate = prompt('Edit task due date (YYYY-MM-DD):', task.dueDate);

        if (newName !== null) task.name = newName;
        if (newDescription !== null) task.description = newDescription;
        if (newPriority !== null) task.priority = newPriority;
        if (newDueDate !== null) task.dueDate = newDueDate;

        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(task) {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.saveTasks();
            this.renderTasks();
        }
    }

    setFilter(e) {
        this.currentFilter = e.target.id.replace('filter', '').toLowerCase();
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.renderTasks();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    sortTasks() {
        this.currentSort = this.sortSelect.value;
        this.renderTasks();
    }

    getSortedTasks(tasks) {
        return tasks.sort((a, b) => {
            if (this.currentSort === 'priority') {
                const priorityOrder = { low: 1, medium: 2, high: 3 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            } else {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
        });
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    clearInputs() {
        document.getElementById('taskName').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskPriority').value = 'low';
        document.getElementById('taskDueDate').value = '';
    }
}

const app = new TodoApp();