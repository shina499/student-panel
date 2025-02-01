//تعداد لیوان های آب

// انتخاب المان‌ها
const countElement = document.getElementById('count');
const progressElement = document.getElementById('progress');
const statusElement = document.getElementById('status');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const resetBtn = document.getElementById('resetBtn');
// مدیریت state
let waterData = JSON.parse(localStorage.getItem('waterData')) || {
    count: 0,
    date: new Date().toLocaleDateString('fa-IR')
};
// توابع
const updateUI = () => {
    countElement.textContent = waterData.count;
    progressElement.style.width = `${Math.min((waterData.count / 8) * 100, 100)}%`;
    
    // بروزرسانی وضعیت
    if(waterData.count === 0) {
        statusElement.textContent = '😴 هنوز شروع نکردی!';
    } else if(waterData.count < 4) {
        statusElement.textContent = '💪 ادامه بده!';
    } else if(waterData.count < 8) {
        statusElement.textContent = '🎯 عالی پیش میری!';
    } else {
        statusElement.textContent = '🎉 هدف امروز تکمیل شد!';
    }
};
const changeCount = (amount) => {
    if(new Date().toLocaleDateString('fa-IR') !== waterData.date) {
        waterData.count = 0;
        waterData.date = new Date().toLocaleDateString('fa-IR');
    }
    
    waterData.count = Math.max(0, waterData.count + amount);
    localStorage.setItem('waterData', JSON.stringify(waterData));
    updateUI();
};
const resetCount = () => {
    waterData = {
        count: 0,
        date: new Date().toLocaleDateString('fa-IR')
    };
    localStorage.setItem('waterData', JSON.stringify(waterData));
    updateUI();
};
// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    if(new Date().toLocaleDateString('fa-IR') !== waterData.date) resetCount();
    else updateUI();
});
incrementBtn.addEventListener('click', () => changeCount(1));
decrementBtn.addEventListener('click', () => changeCount(-1));
resetBtn.addEventListener('click', resetCount);


// exercise
class WorkoutManager {
    constructor() {
      this.timer = {
        isRunning: false,
        startTime: 0,
        elapsedTime: 0,
        interval: null
      };
      
      this.history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
      this.maxHistoryItems = 7;
      
      this.elements = {
        timerDisplay: document.getElementById('timerDisplay'),
        controlButton: document.getElementById('controlButton'),
        saveButton: document.getElementById('saveButton'),
        clearHistoryButton: document.getElementById('clearHistoryButton'),
        historyList: document.getElementById('historyList')
      };
      
      this.initEventListeners();
      this.renderHistory();
    }
  
    initEventListeners() {
      this.elements.controlButton.addEventListener('click', () => this.toggleTimer());
      this.elements.saveButton.addEventListener('click', () => this.saveWorkout());
      this.elements.clearHistoryButton.addEventListener('click', () => this.clearHistory());
    }
  
    toggleTimer() {
      if (!this.timer.isRunning) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    }
  
    startTimer() {
      this.timer.startTime = Date.now() - this.timer.elapsedTime;
      this.timer.interval = setInterval(() => this.updateDisplay(), 1000);
      this.timer.isRunning = true;
      this.elements.controlButton.textContent = '⏸ توقف';
      this.elements.controlButton.classList.replace('bg-green-500', 'bg-yellow-500');
    }
  
    stopTimer() {
      clearInterval(this.timer.interval);
      this.timer.elapsedTime = Date.now() - this.timer.startTime;
      this.timer.isRunning = false;
      this.elements.controlButton.textContent = '▶ ادامه';
      this.elements.controlButton.classList.replace('bg-yellow-500', 'bg-green-500');
    }
  
    updateDisplay() {
      const totalSeconds = Math.floor((Date.now() - this.timer.startTime) / 1000);
      const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '۰');
      const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '۰');
      const seconds = (totalSeconds % 60).toString().padStart(2, '۰');
      this.elements.timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
  
    saveWorkout() {
      if (this.timer.elapsedTime > 0) {
        const workout = {
          id: Date.now(),
          duration: Math.floor(this.timer.elapsedTime / 1000),
          date: new Date().toLocaleDateString('fa-IR'),
          calories: Math.floor(this.timer.elapsedTime / 1000 * 0.1)
        };
        
        this.history.unshift(workout);
        this.history = this.history.slice(0, this.maxHistoryItems);
        localStorage.setItem('workoutHistory', JSON.stringify(this.history));
        this.renderHistory();
        this.resetTimer();
      }
    }
  
    renderHistory() {
      this.elements.historyList.innerHTML = this.history.map(workout => `
        <li class="flex justify-between items-center bg-gray-50 p-2 rounded">
          <div class="flex items-center gap-2">
            <span class="text-green-500">🔥 ${workout.calories}</span>
            <span>کالری</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-400">${workout.date}</span>
            <button onclick="workoutManager.deleteWorkout(${workout.id})" 
                    class="text-red-300 hover:text-red-500 transition-colors">
              ✕
            </button>
          </div>
        </li>
      `).join('');
    }
  
    deleteWorkout(id) {
      this.history = this.history.filter(workout => workout.id !== id);
      localStorage.setItem('workoutHistory', JSON.stringify(this.history));
      this.renderHistory();
    }
  
    clearHistory() {
      this.history = [];
      localStorage.removeItem('workoutHistory');
      this.renderHistory();
    }
  
    resetTimer() {
      this.timer = {
        isRunning: false,
        startTime: 0,
        elapsedTime: 0,
        interval: null
      };
      this.elements.timerDisplay.textContent = '۰۰:۰۰:۰۰';
      this.elements.controlButton.textContent = '▶ شروع';
      this.elements.controlButton.classList.replace('bg-yellow-500', 'bg-green-500');
    }
  }
  // مقداردهی اولیه سیستم
  const workoutManager = new WorkoutManager();


// sleep time
class SleepManager {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('sleepHistory')) || [];
        this.maxHistoryItems = 7;
        
        this.elements = {
            bedtime: document.getElementById('bedtime'),
            waketime: document.getElementById('waketime'),
            duration: document.getElementById('duration'),
            history: document.getElementById('history'),
            calculateBtn: document.getElementById('calculateBtn'),
            clearHistoryBtn: document.getElementById('clearHistoryBtn')
        };

        this.initEventListeners();
        this.updateHistory();
    }

    initEventListeners() {
        this.elements.calculateBtn.addEventListener('click', () => this.calculateSleep());
        this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }

    calculateSleep() {
        const bedtime = this.elements.bedtime.value;
        const waketime = this.elements.waketime.value;
        
        if(!bedtime || !waketime) return;

        const [bedHour, bedMin] = bedtime.split(':').map(Number);
        const [wakeHour, wakeMin] = waketime.split(':').map(Number);
        
        let diffHours = wakeHour - bedHour;
        let diffMinutes = wakeMin - bedMin;

        if(diffMinutes < 0) {
            diffHours--;
            diffMinutes += 60;
        }

        if(diffHours < 0) diffHours += 24;

        this.elements.duration.textContent = 
            `${diffHours} ساعت ${diffMinutes} دقیقه`;

        this.saveHistory({
            date: new Date().toLocaleDateString('fa-IR'),
            duration: `${diffHours}h ${diffMinutes}m`,
            bedtime,
            waketime
        });
    }

    saveHistory(entry) {
        this.history.unshift(entry);
        if(this.history.length > this.maxHistoryItems) {
            this.history.pop();
        }
        localStorage.setItem('sleepHistory', JSON.stringify(this.history));
        this.updateHistory();
    }

    updateHistory() {
        this.elements.history.innerHTML = this.history.map(entry => `
            <li class="flex items-center justify-between bg-white p-2 rounded">
                <div class="flex items-center gap-2">
                    <span class="text-purple-400">⭐</span>
                    <span>${entry.date}</span>
                </div>
                <div class="flex gap-4">
                    <span class="text-purple-500">${entry.duration}</span>
                    <span class="text-gray-400">${entry.bedtime} - ${entry.waketime}</span>
                </div>
            </li>
        `).join('');
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('sleepHistory');
        this.updateHistory();
    }
}
// مقداردهی اولیه
const sleepManager = new SleepManager();


// emotions
class MoodTracker {
    constructor() {
        console.log('سیستم راه‌اندازی شد!'); // تست راه‌اندازی
        this.data = JSON.parse(localStorage.getItem('moodData')) || { entries: [] };
        this.setupEventListeners();
        this.renderChart();
        this.updateStats();
    }

    setupEventListeners() {
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mood = btn.dataset.mood;
                this.addEntry(mood);
            });
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            if(confirm('آیا از پاک کردن تمام داده ها اطمینان دارید؟')) {
                this.resetData();
            }
        });
    }

    addEntry(mood) {
        this.data.entries.push({ date: new Date().toISOString(), mood });
        this.saveData();
        this.renderChart();
        this.updateStats();
    }

    renderChart() {
        const moodCounts = this.countMoods();
        const chartContainer = document.getElementById('mood-chart');
        chartContainer.innerHTML = Object.entries(moodCounts).map(([mood, count]) => `
            <div class="chart-item mb-1">
                <div class="flex items-center justify-between text-sm">
                    <span>${this.getMoodIcon(mood)} ${mood}</span>
                    <span>${count}</span>
                </div>
                <div class="bg-gray-200 rounded-full h-2">
                    <div class="mood-bar h-2 rounded-full ${this.getMoodColor(mood)}" 
                         style="width: ${(count / this.data.entries.length) * 100}%"></div>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        document.getElementById('total-entries').textContent = this.data.entries.length;
        document.getElementById('best-day').textContent = this.calculateBestDay();
    }

    countMoods() {
        return this.data.entries.reduce((acc, entry) => {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
            return acc;
        }, {});
    }

    calculateBestDay() {
        const days = {};
        this.data.entries.forEach(entry => {
            const date = new Date(entry.date).toLocaleDateString('fa-IR');
            days[date] = (days[date] || 0) + 1;
        });
        
        const bestDay = Object.entries(days).reduce((a, b) => b[1] > a[1] ? b : a, [null, 0]);
        return bestDay[0] || '---';
    }

    resetData() {
        localStorage.removeItem('moodData');
        this.data = { entries: [] };
        this.renderChart();
        this.updateStats();
    }

    saveData() {
        localStorage.setItem('moodData', JSON.stringify(this.data));
    }

    getMoodIcon(mood) {
        const icons = { happy: '😊', sad: '😢', angry: '😠' };
        return icons[mood] || '❓';
    }

    getMoodColor(mood) {
        const colors = { happy: 'bg-green-500', sad: 'bg-blue-500', angry: 'bg-red-500' };
        return colors[mood] || 'bg-gray-400';
    }
}

// راه‌اندازی سیستم
new MoodTracker();