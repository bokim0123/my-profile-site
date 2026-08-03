const STORAGE_KEY = 'todos';
let todos = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function () {
  loadTodos();
  renderTodos();
  setupEventListeners();
  updatePendingCount();
});

// LocalStorage에서 할 일 목록 로드
function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  todos = stored ? JSON.parse(stored) : [];
}

// 할 일 목록을 LocalStorage에 저장
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 현재 필터에 맞는 할 일 목록 반환
function getFilteredTodos() {
  switch (currentFilter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

// UI에 할 일 목록 렌더링
function renderTodos() {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';

  const filtered = getFilteredTodos();

  if (filtered.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.className = 'text-center text-gray-400 py-8';
    emptyMessage.textContent =
      currentFilter === 'all'
        ? '할 일이 없습니다. 새로운 할 일을 추가해보세요!'
        : currentFilter === 'active'
          ? '진행 중인 할 일이 없습니다.'
          : '완료된 할 일이 없습니다.';
    todoList.appendChild(emptyMessage);
    return;
  }

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className =
      'flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition group';
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.className = 'w-5 h-5 cursor-pointer accent-blue-500';
    checkbox.setAttribute('aria-label', `${todo.text} 완료 여부`);

    const label = document.createElement('label');
    label.className = 'flex-1 cursor-pointer select-none';
    label.textContent = todo.text;

    if (todo.completed) {
      label.className += ' line-through text-gray-500 dark:text-gray-400';
    }

    const editBtn = document.createElement('button');
    editBtn.className =
      'px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition';
    editBtn.textContent = '편집';
    editBtn.setAttribute('aria-label', `"${todo.text}" 편집`);

    const deleteBtn = document.createElement('button');
    deleteBtn.className =
      'px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md';
    deleteBtn.textContent = '삭제';
    deleteBtn.setAttribute('aria-label', `"${todo.text}" 삭제`);

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
  });
}

// 새로운 할 일 추가
function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const newTodo = {
    id: Date.now(),
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  updatePendingCount();
  clearInput();
}

// 할 일 삭제
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
  updatePendingCount();
}

// 할 일 수정
function editTodo(id, newText) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  const trimmed = newText.trim();
  if (!trimmed) {
    deleteTodo(id);
    return;
  }

  todo.text = trimmed;
  saveTodos();
  renderTodos();
}

// 할 일 완료 상태 토글
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
    updatePendingCount();
  }
}

// 필터 설정
function setFilter(filter) {
  currentFilter = filter;

  // UI 버튼 상태 업데이트
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.dataset.filter === filter;
    btn.className = isActive
      ? 'filter-btn px-4 py-2 font-medium text-blue-500 border-b-2 border-blue-500 transition'
      : 'filter-btn px-4 py-2 font-medium text-gray-500 dark:text-gray-400 border-b-2 border-transparent hover:text-gray-700 dark:hover:text-gray-300 transition';
  });

  renderTodos();
}

// 남은 할 일 개수 업데이트
function updatePendingCount() {
  const pending = todos.filter(t => !t.completed).length;
  document.getElementById('pending-count').textContent = pending;

  // 완료 항목 삭제 버튼 활성화/비활성화
  const clearBtn = document.getElementById('clear-completed');
  const hasCompleted = todos.some(t => t.completed);
  clearBtn.disabled = !hasCompleted;
}

// 입력창 초기화
function clearInput() {
  document.getElementById('todo-input').value = '';
}

// 이벤트 위임을 활용한 이벤트 리스너 설정
function setupEventListeners() {
  const input = document.getElementById('todo-input');
  const addBtn = document.getElementById('add-btn');
  const todoList = document.getElementById('todo-list');
  const clearBtn = document.getElementById('clear-completed');

  // 추가 버튼 클릭
  addBtn.addEventListener('click', () => {
    addTodo(input.value);
  });

  // 입력창 Enter 키
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      addTodo(input.value);
    }
  });

  // 할 일 목록 이벤트 위임 (체크박스, 편집, 삭제)
  todoList.addEventListener('click', e => {
    const li = e.target.closest('li[data-id]');
    if (!li) return;

    const id = parseInt(li.dataset.id);

    if (e.target.tagName === 'INPUT') {
      // 체크박스 클릭
      toggleTodo(id);
    } else if (e.target.textContent === '삭제') {
      // 삭제 버튼 클릭
      deleteTodo(id);
    } else if (e.target.textContent === '편집') {
      // 편집 버튼 클릭 - 프롬프트로 새 텍스트 입력
      const todo = todos.find(t => t.id === id);
      if (todo) {
        const newText = prompt('할 일을 수정하세요:', todo.text);
        if (newText !== null) {
          editTodo(id, newText);
        }
      }
    }
  });

  // 필터 버튼 클릭
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter);
    });
  });

  // 완료 항목 삭제 버튼
  clearBtn.addEventListener('click', () => {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
    updatePendingCount();
  });
}
