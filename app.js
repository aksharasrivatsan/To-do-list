document.addEventListener('DOMContentLoaded', () => {
    const progressCircle = document.querySelector('#RingFill .progress');
    const progressText = document.getElementById('progress-text');
    const moodEmoji = document.getElementById('mood-emoji');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const loadedTasks = localStorage.getItem('tasks');

    let tasks = [];

    const savetasks = () => {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }

    function updateProgress() {
        const completed = tasks.filter(t => t.completed).length;
        const total = tasks.length;
        const percent = total ? (completed / total) * 100 : 0;

        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;

        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = offset;

        progressText.textContent = `${completed} / ${total}`;

        if (percent === 0) moodEmoji.textContent = '😔';
        else if (percent < 50) moodEmoji.textContent = '😐';
        else if (percent < 100) moodEmoji.textContent = '🙂';
        else moodEmoji.textContent = '😄';

        if(tasks.length && completed === total){
          confettifunction();
        }
        
    }

    function createTaskElement(taskObj) {
        const li = document.createElement('li');
        li.classList.add('task-item');

        const label = document.createElement('label');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        checkbox.checked = taskObj.completed;

        const span = document.createElement('span');
        span.classList.add('task-text');
        span.textContent = taskObj.text;

        label.appendChild(checkbox);
        label.appendChild(span);

        // Buttons container
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('task-buttons');

        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.addEventListener('click', () => {
            const newText = prompt('Edit task:', taskObj.text);
            if (newText && newText.trim() !== '') {
                taskObj.text = newText.trim();
                span.textContent = taskObj.text;
                savetasks();
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.addEventListener('click', () => {
            li.remove();
            tasks = tasks.filter(t => t !== taskObj);
            updateProgress();
            savetasks();
        });

        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);

        li.appendChild(label);
        li.appendChild(buttonContainer);

        // Checkbox listener
        checkbox.addEventListener('change', () => {
            taskObj.completed = checkbox.checked;
            updateProgress();
            savetasks();
        });

        return li;
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (!taskText) return;

        const taskObj = { text: taskText, completed: false };
        tasks.push(taskObj);

        const taskElement = createTaskElement(taskObj);
        taskList.appendChild(taskElement);

        taskInput.value = '';
        updateProgress();
        savetasks();
    });

    updateProgress();
});

const confettifunction = () => {
  const defaults = {
  spread: 360,
  ticks: 50,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
  shapes: ["star"],
  colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
};

function shoot() {
  confetti({
    ...defaults,
    particleCount: 40,
    scalar: 1.2,
    shapes: ["star"],
  });

  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 0.75,
    shapes: ["circle"],
  });
}

setTimeout(shoot, 0);
setTimeout(shoot, 100);
setTimeout(shoot, 200);
}