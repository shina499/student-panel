// نمودار
document.addEventListener('DOMContentLoaded', function() {
    const options = {
        series: [{
            name: 'مطالعه',
            data: [3, 4, 2, 5, 4, 6, 2]
        }, {
            name: 'ورزش',
            data: [1, 2, 1, 3, 1, 2, 1]
        }, {
            name: 'سرگرمی',
            data: [2, 3, 1, 4, 2, 3, 1]
        }, {
            name: 'استراحت',
            data: [8, 7, 9, 6, 8, 7, 9]
        }],
        chart: {
            type: 'bar',
            height: 320,
            stacked: true,
            toolbar: { show: false },
            fontFamily: 'Vazirmatn'
        },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'],
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: '60%',
                dataLabels: { position: 'top' }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => val + "h",
            style: { fontSize: '12px' }
        },
        xaxis: {
            categories: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
            labels: { style: { fontSize: '14px' } }
        },
        yaxis: {
            max: 24,
            labels: { formatter: (val) => val + "h" }
        },
        legend: { show: false },
        tooltip: {
            y: { formatter: (val) => val + " ساعت" },
            style: { fontFamily: 'Vazirmatn' }
        },
        responsive: [{
            breakpoint: 480,
            options: { plotOptions: { bar: { columnWidth: '70%' } } }
        }]
    };

    const chart = new ApexCharts(document.querySelector("#activity-chart"), options);
    chart.render();
});


// todo list
// مدیریت state
let todos = JSON.parse(localStorage.getItem('todos')) || [];
// عناصر DOM
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const countSpan = document.getElementById('count');
const addBtn = document.getElementById('addBtn');
// توابع
const updateLocalStorage = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
    countSpan.innerText = todos.length;
};
const createTodoElement = (todo) => {

        const li = document.createElement('li');
        li.className = 'flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors min-h-[72px]';
        // بقیه کد بدون تغییر...
    
    li.innerHTML = `
        <div class="flex-1">
            <span class="text-gray-800">${todo.text}</span>
            <span class="text-xs text-gray-400 block mt-1">${new Date(todo.timestamp).toLocaleString('fa-IR')}</span>
        </div>
        <button 
            class="delete-btn text-red-500 hover:text-red-700 transition-colors"
            data-id="${todo.id}"
        >
            ×
        </button>
    `;
    
    return li;
};
const renderTodos = () => {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });
};
const addTodo = () => {
    const text = todoInput.value.trim();
    
    if (!text) {
        alert('لطفا متن تکلیف را وارد کنید!');
        todoInput.focus();
        return;
    }
    
    const newTodo = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toISOString(),
        completed: false
    };
    addBtn.classList.add("animate__animated")
    addBtn.classList.add("animate__jackInTheBox")
    todos.unshift(newTodo);
    todoInput.value = '';
    renderTodos();
    updateLocalStorage();
};
const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
    updateLocalStorage();
};
// Event Listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = Number(e.target.dataset.id);
        deleteTodo(id);
    }
});
// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    updateLocalStorage();
});


// برنامه هفتگی
document.addEventListener('DOMContentLoaded', function () {
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه'];
    const periods = ['زنگ اول', 'زنگ دوم', 'زنگ سوم', 'زنگ چهارم', 'زنگ پنجم'];
    const tableBody = document.querySelector('#schedule tbody');
    const colors = ['bg-red-300', 'bg-yellow-300', 'bg-lime-300', 'bg-blue-300', 'bg-fuchsia-300'];

    // ایجاد ردیف‌ها و سلول‌ها
    periods.forEach((period, periodIndex) => {
        const row = document.createElement('tr');
        const periodCell = document.createElement('td');
        periodCell.textContent = period;
        periodCell.classList.add('p-2', 'font-bold', 'bg-gray-100', 'text-center');
        row.appendChild(periodCell);

        days.forEach((day, dayIndex) => {
            const cell = document.createElement('td');
            cell.contentEditable = true;
            cell.classList.add('p-2', 'border', 'border-gray-200', 'text-center', 'hover:bg-opacity-75', 'focus:bg-opacity-100', colors[dayIndex % colors.length], 'animate__animated', 'animate__fadeIn');
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    // ذخیره برنامه
    document.getElementById('saveBtn').addEventListener('click', function () {
        const schedule = [];
        tableBody.querySelectorAll('tr').forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach((cell, index) => {
                if (index !== 0) { // از سلول اول (زنگ) صرف‌نظر می‌کنیم
                    rowData.push(cell.textContent);
                }
            });
            schedule.push(rowData);
        });
        localStorage.setItem('weeklySchedule', JSON.stringify(schedule));
        alert('برنامه با موفقیت ذخیره شد!');
    });

    // بارگذاری برنامه ذخیره شده
    const savedSchedule = JSON.parse(localStorage.getItem('weeklySchedule'));
    if (savedSchedule) {
        tableBody.querySelectorAll('tr').forEach((row, rowIndex) => {
            row.querySelectorAll('td').forEach((cell, cellIndex) => {
                if (cellIndex !== 0) {
                    cell.textContent = savedSchedule[rowIndex][cellIndex - 1];
                }
            });
        });
    }
});



// هشدار تمرکز
class FocusTimer {
    constructor() {
        this.timer = null;
        this.isRunning = false;
        this.currentTime = parseInt(localStorage.getItem('currentTime')) || 0;
        this.isBreakTime = localStorage.getItem('isBreakTime') === 'true' || false;
        this.settings = JSON.parse(localStorage.getItem('focusSettings')) || {
            study: 25,
            break: 5
        };
        this.totalTime = (this.isBreakTime ? this.settings.break : this.settings.study) * 60;

        this.ui = {
            time: document.getElementById('time'),
            status: document.getElementById('status'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            studyInput: document.getElementById('studyTime'),
            breakInput: document.getElementById('breakTime'),
            progressCircle: document.querySelector('.progress-ring__circle')
        };

        this.init();
    }

    init() {
        this.ui.studyInput.value = this.settings.study;
        this.ui.breakInput.value = this.settings.break;
        this.updateProgress((this.currentTime / this.totalTime) * 100);
        this.updateDisplay(this.totalTime - this.currentTime);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.ui.startBtn.addEventListener('click', () => this.toggleTimer());
        this.ui.resetBtn.addEventListener('click', () => this.resetTimer());
        this.ui.studyInput.addEventListener('change', () => this.updateSettings());
        this.ui.breakInput.addEventListener('change', () => this.updateSettings());
    }

    toggleTimer() {
        if (!this.isRunning) {
            this.startTimer();
            this.ui.startBtn.textContent = '⏸ توقف';
            this.ui.startBtn.classList.replace('bg-blue-500', 'bg-yellow-500');
        } else {
            this.pauseTimer();
            this.ui.startBtn.textContent = '▶ ادامه';
            this.ui.startBtn.classList.replace('bg-yellow-500', 'bg-blue-500');
        }
        this.isRunning = !this.isRunning;
    }

    startTimer() {
        clearInterval(this.timer);

        if (this.currentTime === 0) {
            this.totalTime = (this.isBreakTime ? this.settings.break : this.settings.study) * 60;
            this.ui.status.textContent = this.isBreakTime ? 'زمان استراحت! ☕' : 'در حال تمرکز...';
        }

        this.timer = setInterval(() => {
            this.currentTime++;
            localStorage.setItem('currentTime', this.currentTime);
            const remaining = this.totalTime - this.currentTime;
            this.updateDisplay(remaining);

            if (remaining <= 0) {
                this.handleComplete();
            }
        }, 1000);
    }

    updateDisplay(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        this.ui.time.textContent = `${mins}:${secs}`.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
        this.updateProgress((this.currentTime / this.totalTime) * 100);
    }

    updateProgress(percent) {
        if (isNaN(percent)) percent = 0;
        const circumference = 565.48;
        const offset = circumference - (percent / 100 * circumference);
        this.ui.progressCircle.style.strokeDashoffset = offset;
    }

    handleComplete() {
        this.pauseTimer();
        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play();

        this.isBreakTime = !this.isBreakTime; // تغییر وضعیت بین مطالعه و استراحت
        localStorage.setItem('isBreakTime', this.isBreakTime);

        this.currentTime = 0;
        this.totalTime = (this.isBreakTime ? this.settings.break : this.settings.study) * 60;
        this.ui.status.textContent = this.isBreakTime ? 'زمان استراحت! ☕' : 'در حال تمرکز...';

        this.startTimer();
    }

    pauseTimer() {
        clearInterval(this.timer);
    }

    resetTimer() {
        this.pauseTimer();
        this.currentTime = 0;
        this.isRunning = false;
        this.isBreakTime = false;
        localStorage.setItem('currentTime', this.currentTime);
        localStorage.setItem('isBreakTime', this.isBreakTime);
        this.ui.startBtn.textContent = '▶ شروع';
        this.ui.startBtn.classList.replace('bg-yellow-500', 'bg-blue-500');
        this.ui.status.textContent = 'آماده';
        this.totalTime = this.settings.study * 60;
        this.updateDisplay(this.totalTime);
    }

    updateSettings() {
        this.settings = {
            study: parseInt(this.ui.studyInput.value) || 25,
            break: parseInt(this.ui.breakInput.value) || 5
        };
        localStorage.setItem('focusSettings', JSON.stringify(this.settings));

        this.totalTime = this.isBreakTime ? this.settings.break * 60 : this.settings.study * 60;

        if (!this.isRunning) {
            this.resetTimer();
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new FocusTimer();
});