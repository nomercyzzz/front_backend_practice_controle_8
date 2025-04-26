document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const filters = document.querySelectorAll('.filters button');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks(filter = 'all') {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
      if (filter === 'active' && task.completed) return;
      if (filter === 'completed' && !task.completed) return;

      const li = document.createElement('li');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks(filter);
      });

      const span = document.createElement('span');
      span.textContent = task.text;
      if (task.completed) {
        span.style.textDecoration = 'line-through';
        span.style.color = '#999';
      }

      li.appendChild(checkbox);
      li.appendChild(span);
      taskList.appendChild(li);
    });
  }

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text !== '') {
      tasks.push({ text, completed: false });
      saveTasks();
      renderTasks();
      taskInput.value = '';

      // Пуш уведомление при добавлении новой задачи
      if (Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            registration.showNotification('Новая задача добавлена!', {
              body: text,
              icon: 'icon-192.png'
            });
          }
        });
      }
    }
  });

  filters.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.id;
      renderTasks(id);
    });
  });

  // Инициализация при старте
  renderTasks();

  // Уведомления
  const enableNotificationsButton = document.getElementById('enable-notifications');
  if (enableNotificationsButton) {
    enableNotificationsButton.addEventListener('click', () => {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) {
              registration.showNotification("Напоминания включены!", {
                body: "Теперь ты будешь получать напоминания о задачах.",
                icon: "icon-192.png"
              });
            }
          });
        } else {
          alert("Вы запретили уведомления :(");
        }
      });
    });
  }
});
