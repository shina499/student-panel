let exams = JSON.parse(localStorage.getItem('exams')) || [];
let gradesData = JSON.parse(localStorage.getItem('gradesData')) || [];

document.addEventListener("DOMContentLoaded", () => {
    initializeExams();
    renderGrades();
});

// نمایش تاریخ امروز
function initializeExams() {
    document.getElementById('todayDate').textContent =
        new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    renderExams();
}

// نمایش لیست امتحانات
function renderExams() {
    const today = new Date().setHours(0, 0, 0, 0);

    const todayExams = exams.filter(exam =>
        new Date(exam.date).setHours(0, 0, 0, 0) === today
    );

    const upcomingExams = exams.filter(exam =>
        new Date(exam.date).setHours(0, 0, 0, 0) > today
    );

    const renderExamCard = (exam) => `
        <div class="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between animate__animated animate__fadeIn">
            <div>
                <h3 class="font-bold">${exam.title}</h3>
                <p class="text-sm text-gray-500">${new Date(exam.date).toLocaleDateString('fa-IR')}</p>
            </div>
            <button onclick="deleteExam('${exam.id}')" 
                    class="text-red-500 hover:text-red-600 transition-colors">
                ✕
            </button>
        </div>
    `;

    document.getElementById('todayExams').innerHTML =
        todayExams.length ? todayExams.map(renderExamCard).join('') :
        '<p class="text-gray-500 text-sm">امتحانی برای امروز ندارید!</p>';

    document.getElementById('upcomingExams').innerHTML =
        upcomingExams.length ? `<div class="max-h-64 overflow-y-auto space-y-2">${upcomingExams.map(renderExamCard).join('')}</div>` :
        '<p class="text-gray-500 text-sm">امتحانی در آینده نزدیک ندارید!</p>';
}

// اضافه کردن امتحان جدید
function addExam() {
    const titleInput = document.getElementById('examTitle');
    const dateInput = document.getElementById('examDate');

    if (!titleInput.value || !dateInput.value) {
        alert("لطفاً عنوان و تاریخ را وارد کنید!");
        return;
    }

    const exam = {
        id: Date.now().toString(),
        title: titleInput.value,
        date: dateInput.value
    };

    exams.push(exam);
    localStorage.setItem('exams', JSON.stringify(exams));

    titleInput.value = '';
    dateInput.value = '';
    renderExams();
}

// حذف امتحان
function deleteExam(id) {
    exams = exams.filter(e => e.id.toString() !== id.toString());
    localStorage.setItem('exams', JSON.stringify(exams));
    renderExams();
}

// ذخیره نمرات در localStorage
document.getElementById("saveBtn").addEventListener("click", function () {
    const studentName = document.getElementById("studentName").value;
    const date = document.getElementById("date").value;
    const grades = document.getElementById("grades").value;

    if (!studentName || !date || !grades) {
        alert("لطفاً همه فیلدها را پر کنید!");
        return;
    }

    const gradesArray = grades.split(",").map(grade => grade.trim());

    const newGrade = {
        id: Date.now().toString(),
        studentName,
        date,
        grades: gradesArray
    };

    gradesData.push(newGrade);
    localStorage.setItem('gradesData', JSON.stringify(gradesData));

    renderGrades();

    document.getElementById("studentName").value = "";
    document.getElementById("date").value = "";
    document.getElementById("grades").value = "";
});

// نمایش نمرات ذخیره‌شده
function renderGrades() {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = gradesData.length
    ? `<div class="grid grid-cols-1 gap-8">
        ${gradesData.map(entry => `
            <div class="relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 group">
                <!-- Background Gradient Layer -->
                <div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <!-- Content -->
                <div class="relative z-10 p-8">
                    <!-- Header -->
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            ${entry.studentName.charAt(0)}
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-500">${entry.studentName}</h3>
                            <p class="text-sm text-gray-500 group-hover:text-purple-100 transition-colors duration-500">${entry.date}</p>
                        </div>
                        <button class="ml-auto text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white/20"
                                onclick="deleteGrade('${entry.id}')">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                </path>
                            </svg>
                        </button>
                    </div>

                    <!-- Details List -->
                    <ul class="space-y-4">
                        <li class="flex items-center gap-4 bg-white/20 backdrop-blur-md p-4 rounded-xl">
                            <div class="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                    </path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 group-hover:text-purple-100 transition-colors duration-500">تاریخ ثبت</p>
                                <p class="font-medium text-gray-900 group-hover:text-white transition-colors duration-500">${entry.date}</p>
                            </div>
                        </li>
                        <li class="flex items-center gap-4 bg-white/20 backdrop-blur-md p-4 rounded-xl">
                            <div class="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z">
                                    </path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 group-hover:text-purple-100 transition-colors duration-500">نمرات</p>
                                <p class="font-medium text-gray-900 group-hover:text-white transition-colors duration-500">${entry.grades.join(", ")}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        `).join("")}
    </div>`
    : `<div class="text-center py-20">
          <div class="inline-block bg-gradient-to-br from-purple-500 to-blue-500 p-10 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105">
              <svg class="w-24 h-24 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                  </path>
              </svg>
              <h3 class="mt-6 text-2xl font-bold text-white">هنوز نمره‌ای ثبت نشده است</h3>
              <p class="mt-2 text-purple-100">برای شروع، نمره جدیدی اضافه کنید.</p>
              <button onclick="openAddGradeModal()" 
                      class="mt-8 bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 hover:shadow-lg transition-all">
                  افزودن نمره
              </button>
          </div>
      </div>`;
}


// حذف نمره
function deleteGrade(id) {
    gradesData = gradesData.filter(entry => entry.id.toString() !== id.toString());
    localStorage.setItem('gradesData', JSON.stringify(gradesData));
    renderGrades();
}


initializeExams();

// day chalange
// █████████████████████████████████████████████████████████████████████████████████████
// █████████████████████████████ بانک سوالات ███████████████████████████████████████████
// █████████████████████████████████████████████████████████████████████████████████████
const questionBank = {
    science: [
        {
            question: "کدام سیاره نزدیک‌ترین به خورشید است؟",
            options: ["زهره", "مریخ", "عطارد", "زحل"],
            answer: "عطارد"
        },
        {
            question: "کدام عنصر بیشترین درصد هوا را تشکیل می‌دهد؟",
            options: ["اکسیژن", "نیتروژن", "کربن دی‌اکسید", "هیدروژن"],
            answer: "نیتروژن"
        },
        {
            question: "کدام حیوان بزرگ‌ترین مغز را دارد؟",
            options: ["فیل", "نهنگ آبی", "شامپانزه", "دلفین"],
            answer: "نهنگ آبی"
        }
    ],
    math: [
        {
            question: "حاصل ۵ × (۳ + ۲) چیست؟",
            options: ["۱۵", "۲۰", "۲۵", "۳۰"],
            answer: "۲۵"
        },
        {
            question: "مقدار x در معادله ۲x + ۵ = ۱۵ چیست؟",
            options: ["۵", "۱۰", "۷.۵", "۲"],
            answer: "۵"
        },
        {
            question: "مساحت دایره با شعاع ۷ چقدر است؟ (π=۳)",
            options: ["۱۴۷", "۱۵۴", "۱۶۹", "۱۸۹"],
            answer: "۱۴۷"
        }
    ]
};
// █████████████████████████████████████████████████████████████████████████████████████
// █████████████████████████████ منطق بازی ████████████████████████████████████████████
// █████████████████████████████████████████████████████████████████████████████████████
let state = {
    totalScore: localStorage.getItem('totalScore') || 0,
    lastPlayedDate: localStorage.getItem('lastPlayedDate'),
    dailyProgress: 0,
    todayQuestions: { science: [], math: [] }
};
function initializeQuiz() {
    checkDailyReset();
    updateUI();
    generateDailyQuestions();
    renderQuestions();
}
function checkDailyReset() {
    const today = new Date().toLocaleDateString('fa-IR');
    document.getElementById('todayDate').textContent = today;

    if(state.lastPlayedDate !== today) {
        resetDailyProgress();
    }
}
function resetDailyProgress() {
    state.dailyProgress = 0;
    state.lastPlayedDate = new Date().toLocaleDateString('fa-IR');
    localStorage.setItem('lastPlayedDate', state.lastPlayedDate);
    generateDailyQuestions();
    renderQuestions();
}
function generateDailyQuestions() {
    const getRandomQuestions = (pool, count) => {
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };
    // Science
    state.todayQuestions.science = getRandomQuestions(questionBank.science, Math.min(2, questionBank.science.length));
    // Math
    state.todayQuestions.math = getRandomQuestions(questionBank.math, Math.min(2, questionBank.math.length));
}
function renderQuestions() {
    const renderQuestion = (q, index, subject) => `
        <div class="bg-white p-4 rounded-lg shadow-sm">
            <p class="font-bold mb-2">سوال ${index + 1}: ${q.question}</p>
            <div class="grid grid-cols-2 gap-2">
                ${q.options.map(option => `
                    <button onclick="handleAnswer('${subject}', ${index}, '${option}')" 
                            class="answer-btn p-2 bg-gray-50 rounded hover:bg-purple-100 transition-all"
                            data-correct="${option === q.answer}">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    document.getElementById('scienceQuestions').innerHTML = 
        state.todayQuestions.science.map((q, i) => renderQuestion(q, i, 'science')).join('');

    document.getElementById('mathQuestions').innerHTML = 
        state.todayQuestions.math.map((q, i) => renderQuestion(q, i, 'math')).join('');
}
function handleAnswer(subject, index, selected) {
    const question = state.todayQuestions[subject][index];

    const questionDiv = document.querySelectorAll(`#${subject}Questions > div`)[index];
    
    const buttons = questionDiv.querySelectorAll('.answer-btn');

    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.correct === 'true') {
            btn.classList.add('bg-green-200');
        }
        if (btn.textContent === selected) {
            btn.classList.add(selected === question.answer ? 
                'animate__tada' : 'animate__shakeX');
        }
    });

    if (selected === question.answer) {
        updateScore();
    }
}

function updateScore() {
    state.totalScore = parseInt(state.totalScore) + 10;
    state.dailyProgress++;
    localStorage.setItem('totalScore', state.totalScore);
    updateUI();
}
function updateUI() {
    document.getElementById('totalScore').textContent = state.totalScore;
    document.getElementById('dailyProgress').style.width = 
        `${(state.dailyProgress/4)*100}%`;
    document.getElementById('progressText').textContent = 
        `${state.dailyProgress}/4 سوال پاسخ داده شده`;
}
// █████████████████████████████████████████████████████████████████████████████████████
// █████████████████████████████ راه اندازی اولیه █████████████████████████████████████
// █████████████████████████████████████████████████████████████████████████████████████

window.onload = initializeQuiz();

