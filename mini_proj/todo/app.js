// Application state
let tasks = [];
let currentFilter = 'all';
let darkMode = false;
let taskIdCounter = 1;

// DOM elements
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = document.getElementById('darkModeIcon');
const darkModeText = document.getElementById('darkModeText');
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount = document.getElementById('taskCount');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize the application
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize with sample data
    initializeSampleData();
    
    // Set initial theme
    updateTheme();
    
    // Render initial state
    renderTasks();
    updateTaskCount();
}

// Set up all event listeners
function setupEventListeners() {
    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Add task functionality
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.target.getAttribute('data-filter');
            setFilter(filter);
        });
    });
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dueDateInput.min = today;
}

// Initialize with sample data
function initializeSampleData() {
    const sampleTasks = [
        {
            id: taskIdCounter++,
            text: "Complete project documentation",
            completed: false,
            due: "2025-10-10"
        },
        {
            id: taskIdCounter++,
            text: "Review code changes",
            completed: true,
            due: "2025-10-08"
        }
    ];
    
    tasks = sampleTasks;
    taskIdCounter = 3;
}

// Dark mode functionality
function toggleDarkMode() {
    darkMode = !darkMode;
    updateTheme();
}

function updateTheme() {
    const body = document.body;
    
    if (darkMode) {
        body.setAttribute('data-color-scheme', 'dark');
        darkModeIcon.textContent = '☀️';
        darkModeText.textContent = 'Light Mode';
    } else {
        body.setAttribute('data-color-scheme', 'light');
        darkModeIcon.textContent = '🌙';
        darkModeText.textContent = 'Dark Mode';
    }
}

// Task management functions
function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        taskInput.focus();
        return;
    }
    
    const dueDate = dueDateInput.value;
    const newTask = {
        id: taskIdCounter++,
        text: text,
        completed: false,
        due: dueDate || null
    };
    
    tasks.push(newTask);
    
    // Clear inputs
    taskInput.value = '';
    dueDateInput.value = '';
    
    // Re-render
    renderTasks();
    updateTaskCount();
    
    // Focus back to input for better UX
    taskInput.focus();
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateTaskCount();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks();
    updateTaskCount();
}

// Filter functionality
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter button
    filterButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-filter') === filter) {
            button.classList.add('active');
        }
    });
    
    renderTasks();
    updateTaskCount();
}

function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// Rendering functions
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        taskList.classList.add('hidden');
        emptyState.classList.remove('hidden');
        updateEmptyStateMessage();
        return;
    }
    
    taskList.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    taskList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    // Format due date
    let dueDateHTML = '';
    if (task.due) {
        const dueDate = new Date(task.due);
        const today = new Date();
        const isOverdue = dueDate < today && !task.completed;
        
        dueDateHTML = `
            <p class="task-due ${isOverdue ? 'overdue' : ''}">
                📅 Due: ${formatDate(task.due)}
                ${isOverdue ? ' (Overdue)' : ''}
            </p>
        `;
    }
    
    li.innerHTML = `
        <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''}
            onchange="toggleTask(${task.id})"
        >
        <div class="task-content">
            <p class="task-text">${escapeHtml(task.text)}</p>
            ${dueDateHTML}
        </div>
        <div class="task-actions">
            <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete task">
                🗑️
            </button>
        </div>
    `;
    
    return li;
}

function updateEmptyStateMessage() {
    const emptyStateContent = emptyState.querySelector('h3');
    const emptyStateDesc = emptyState.querySelector('p');
    
    switch (currentFilter) {
        case 'active':
            emptyStateContent.textContent = 'No active tasks';
            emptyStateDesc.textContent = 'All tasks are completed! 🎉';
            break;
        case 'completed':
            emptyStateContent.textContent = 'No completed tasks';
            emptyStateDesc.textContent = 'Complete some tasks to see them here.';
            break;
        default:
            emptyStateContent.textContent = 'No tasks yet';
            emptyStateDesc.textContent = 'Add a task above to get started!';
    }
}

function updateTaskCount() {
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    let countText;
    switch (currentFilter) {
        case 'active':
            countText = `${activeTasks} active task${activeTasks !== 1 ? 's' : ''}`;
            break;
        case 'completed':
            countText = `${completedTasks} completed task${completedTasks !== 1 ? 's' : ''}`;
            break;
        default:
            countText = `${totalTasks} total task${totalTasks !== 1 ? 's' : ''}`;
    }
    
    taskCount.textContent = countText;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add task
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        addTask();
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
        taskInput.value = '';
        dueDateInput.value = '';
        taskInput.focus();
    }
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add some interactive feedback
function addTaskWithAnimation() {
    const text = taskInput.value.trim();
    if (!text) return;
    
    // Add a loading state to the button
    const originalText = addTaskBtn.innerHTML;
    addTaskBtn.innerHTML = '<span>Adding...</span>';
    addTaskBtn.disabled = true;
    
    // Simulate async operation for better UX
    setTimeout(() => {
        addTask();
        addTaskBtn.innerHTML = originalText;
        addTaskBtn.disabled = false;
    }, 300);
}

// Enhanced add task with animation
addTaskBtn.removeEventListener('click', addTask);
addTaskBtn.addEventListener('click', addTaskWithAnimation);

// Add task completion celebration
function celebrateTaskCompletion(taskElement) {
    taskElement.style.transform = 'scale(1.05)';
    setTimeout(() => {
        taskElement.style.transform = 'scale(1)';
    }, 200);
}

// Override the original toggleTask to add celebration
const originalToggleTask = window.toggleTask;
window.toggleTask = function(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
        // Task is being completed
        originalToggleTask(taskId);
        
        // Add celebration effect
        setTimeout(() => {
            const taskElement = document.querySelector(`input[onchange="toggleTask(${taskId})"]`).closest('.task-item');
            if (taskElement && task.completed) {
                celebrateTaskCompletion(taskElement);
            }
        }, 50);
    } else {
        originalToggleTask(taskId);
    }
};

// Add smooth scrolling for better UX
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Auto-focus task input when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        taskInput.focus();
    }, 500);
});