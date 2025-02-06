let exams = JSON.parse(localStorage.getItem('exams')) || [];
function initialize() {
    document.getElementById('todayDate').textContent = 
        new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    renderExams();
}
function renderExams() {
    const today = new Date().toDateString();
    const todayExams = exams.filter(exam => new Date(exam.date).toDateString() === today);
    const upcomingExams = exams.filter(exam => new Date(exam.date).toDateString() > today);

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
        upcomingExams.length ? upcomingExams.map(renderExamCard).join('') : 
        '<p class="text-gray-500 text-sm">امتحانی در آینده نزدیک ندارید!</p>';
}
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
function deleteExam(id) {
    exams = exams.filter(e => e.id !== id);
    localStorage.setItem('exams', JSON.stringify(exams));
    renderExams();
}
// اجرای اولیه
initialize();


// exam score
document.getElementById("saveBtn").addEventListener("click", function () {
    const studentName = document.getElementById("studentName").value;
    const date = document.getElementById("date").value;
    const grades = document.getElementById("grades").value;
  
    // اعتبارسنجی فیلدها
    if (!studentName || !date || !grades) {
      alert("لطفاً همه فیلدها را پر کنید!");
      return;
    }
  
    // تبدیل نمرات به آرایه
    const gradesArray = grades.split(",").map((grade) => grade.trim());
  
    // نمایش نتیجه
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
      <p><strong>نام دانش‌آموز:</strong> ${studentName}</p>
      <p><strong>تاریخ:</strong> ${date}</p>
      <p><strong>نمرات:</strong> ${gradesArray.join(", ")}</p>
      <p class="text-green-600">نمرات با موفقیت ذخیره شد!</p>
    `;
  
    // پاک کردن فیلدها (اختیاری)
    document.getElementById("studentName").value = "";
    document.getElementById("date").value = "";
    document.getElementById("grades").value = "";
  });



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
function initialize() {
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

    state.todayQuestions.science = getRandomQuestions(questionBank.science, 2);
    state.todayQuestions.math = getRandomQuestions(questionBank.math, 2);
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
    const buttons = document.querySelectorAll(`#${subject}Questions .answer-btn`);
    
    buttons.forEach(btn => {
        btn.disabled = true;
        if(btn.dataset.correct === 'true') {
            btn.classList.add('bg-green-200');
        }
        if(btn.textContent === selected) {
            btn.classList.add(selected === question.answer ? 
                'animate__tada' : 'animate__shakeX');
        }
    });

    if(selected === question.answer) {
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

window.onload = initialize;