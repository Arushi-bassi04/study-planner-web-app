// Dark Mode Toggle
// DARK MODE SAFE VERSION
const toggleBtn = document.getElementById("themeToggle");

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
}

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

// Load task data (placeholder logic for now)
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const progressFillEl = document.getElementById("progressFill");

if (totalTasksEl && completedTasksEl && progressFillEl) {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let total = tasks.length;
    let completed = tasks.filter(task => task.completed).length;

    totalTasksEl.innerText = total;
    completedTasksEl.innerText = completed;

    if (total > 0) {
        let progress = Math.round((completed / total) * 100);
        progressFillEl.style.width = progress + "%";

        const percentEl = document.getElementById("progressPercent");
        if (percentEl) {
            percentEl.innerText = progress + "% Completed";
        }
    }
}
// TASK LOGIC

function addTask() {
    const subject = document.getElementById("subjectInput").value;
    const taskText = document.getElementById("taskInput").value;

    if(subject === "" || taskText === "") return;

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push({
        subject: subject,
        text: taskText,
        completed: false
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.getElementById("subjectInput").value = "";
    document.getElementById("taskInput").value = "";

    loadTasks();
}

function loadTasks(filter = "all") {
    const taskList = document.getElementById("taskList");
    if(!taskList) return;

    taskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task, index) => {

        if(filter === "completed" && !task.completed) return;
        if(filter === "pending" && task.completed) return;

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? "completed" : ""}">
                ${task.subject} - ${task.text}
            </span>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleTask(${index})">
                ${task.completed ? "Undo" : "Complete"}
                </button>
                <button class="delete-btn" onclick="deleteTask(${index})">
                Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function toggleTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function filterTasks(type) {
    loadTasks(type);
}

loadTasks();
// POMODORO LOGIC

// POMODORO LOGIC SAFE VERSION

let interval = null;
let time = 1500; // 25 min
let isStudy = true;

function updateDisplay() {
    const timerDisplay = document.getElementById("timer");
    if (!timerDisplay) return;

    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    timerDisplay.innerText =
        (minutes < 10 ? "0" : "") + minutes + ":" +
        (seconds < 10 ? "0" : "") + seconds;
}

function startTimer() {
    if (interval !== null) return;

    interval = setInterval(() => {
        if (time > 0) {
            time--;
            updateDisplay();
        } else {
            clearInterval(interval);
            interval = null;
            alert("Time's up!");
        }
    }, 1000);
}

function pauseTimer() {
    if (interval !== null) {
        clearInterval(interval);
        interval = null;
    }
}

function resetTimer() {
    pauseTimer();
    time = isStudy ? 1500 : 300;
    updateDisplay();
}

function switchMode() {
    isStudy = !isStudy;
    pauseTimer();
    time = isStudy ? 1500 : 300;

    const modeLabel = document.getElementById("modeLabel");
    if (modeLabel) {
        modeLabel.innerText = isStudy ? "Mode: Study" : "Mode: Break";
    }

    updateDisplay();
}

updateDisplay();