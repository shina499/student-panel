document.addEventListener('DOMContentLoaded', function () {
    const noteInput = document.getElementById('noteInput');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const notesContainer = document.getElementById('notesContainer');
    
    // بارگذاری یادداشت‌ها از localStorage
    let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

    // نمایش یادداشت‌های ذخیره شده
    savedNotes.forEach(note => {
        addNoteToDOM(note);
    });

    // افزودن یادداشت جدید
    addNoteBtn.addEventListener('click', function () {
        const noteText = noteInput.value.trim();
        if (noteText) {
            const newNote = {
                id: Date.now(),
                text: noteText
            };
            addNoteToDOM(newNote);
            savedNotes.push(newNote);
            localStorage.setItem('notes', JSON.stringify(savedNotes));
            noteInput.value = '';
        }
    });

    // تابع ایجاد کارت یادداشت
    function addNoteToDOM(note) {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note', 'bg-white', 'p-4', 'rounded-xl', 'shadow-md', 'animate__animated', 'animate__fadeIn');
        noteElement.setAttribute('data-id', note.id);
        
        noteElement.innerHTML = `
            <div class="note-content">
                <p 
                    class="text-gray-800 editable-text outline-none" 
                    contenteditable="false"
                >${note.text}</p>
                <div class="mt-4 flex gap-2">
                    <button class="edit-btn px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                        ✏️ ویرایش
                    </button>
                    <button class="delete-btn px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                        🗑️ حذف
                    </button>
                </div>
            </div>
        `;

        // قابلیت حذف
        const deleteBtn = noteElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            noteElement.remove();
            savedNotes = savedNotes.filter(n => n.id !== note.id);
            localStorage.setItem('notes', JSON.stringify(savedNotes));
        });

        // قابلیت ویرایش
        const editBtn = noteElement.querySelector('.edit-btn');
        const editableText = noteElement.querySelector('.editable-text');
        
        editBtn.addEventListener('click', () => {
            const isEditable = editableText.contentEditable === 'true';
            if (!isEditable) {
                editableText.contentEditable = 'true';
                editableText.focus();
                editBtn.textContent = '💾 ذخیره';
                editBtn.classList.replace('bg-blue-100', 'bg-green-100');
                editBtn.classList.replace('text-blue-600', 'text-green-600');
            } else {
                editableText.contentEditable = 'false';
                editBtn.textContent = '✏️ ویرایش';
                editBtn.classList.replace('bg-green-100', 'bg-blue-100');
                editBtn.classList.replace('text-green-600', 'text-blue-600');
                
                // آپدیت متن در localStorage
                const updatedNote = savedNotes.find(n => n.id === note.id);
                updatedNote.text = editableText.textContent;
                localStorage.setItem('notes', JSON.stringify(savedNotes));
            }
        });

        notesContainer.appendChild(noteElement);
    }
});